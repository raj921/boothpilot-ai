import { demoTranscript, transcriptTurns } from "@/lib/demo";

type SpeechmaticsJob = {
  id: string;
};

export async function transcribeWithSpeechmatics(file?: File) {
  const apiKey = process.env.SPEECHMATICS_API_KEY;

  if (!apiKey || !file) {
    return {
      transcript: demoTranscript,
      transcriptJson: { speakers: transcriptTurns },
      provider: "Speechmatics demo fallback",
      fallback: true
    };
  }

  const form = new FormData();
  form.append(
    "config",
    JSON.stringify({
      type: "transcription",
      transcription_config: {
        language: "en",
        diarization: "speaker",
        operating_point: "enhanced"
      }
    })
  );
  form.append("data_file", file, file.name);

  const createResponse = await fetch("https://asr.api.speechmatics.com/v2/jobs/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });

  if (!createResponse.ok) {
    throw new Error(`Speechmatics job failed: ${createResponse.status}`);
  }

  const job = (await createResponse.json()) as { job: SpeechmaticsJob };
  const jobId = job.job.id;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const statusResponse = await fetch(`https://asr.api.speechmatics.com/v2/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const status = (await statusResponse.json()) as { job: { status: string } };
    if (status.job.status === "done") break;
    if (status.job.status === "rejected") throw new Error("Speechmatics rejected the audio job");
  }

  const transcriptResponse = await fetch(
    `https://asr.api.speechmatics.com/v2/jobs/${jobId}/transcript?format=json-v2`,
    {
      headers: { Authorization: `Bearer ${apiKey}` }
    }
  );

  if (!transcriptResponse.ok) {
    throw new Error(`Speechmatics transcript failed: ${transcriptResponse.status}`);
  }

  const transcriptJson = await transcriptResponse.json();
  const transcript = normalizeSpeechmaticsTranscript(transcriptJson);

  return {
    transcript,
    transcriptJson,
    provider: "Speechmatics",
    fallback: false
  };
}

function normalizeSpeechmaticsTranscript(transcriptJson: any) {
  const results = Array.isArray(transcriptJson.results) ? transcriptJson.results : [];
  const turns = results
    .filter((item: any) => item.type === "word" && item.alternatives?.[0]?.content)
    .map((item: any) => ({
      speaker: item.alternatives?.[0]?.speaker ?? "Speaker",
      text: item.alternatives[0].content
    }));

  if (!turns.length) return demoTranscript;

  const grouped: Record<string, string[]> = {};
  for (const turn of turns) {
    const speaker = turn.speaker === "S1" ? "Sales Rep" : turn.speaker === "S2" ? "Visitor" : turn.speaker;
    grouped[speaker] = grouped[speaker] ?? [];
    grouped[speaker].push(turn.text);
  }

  return Object.entries(grouped)
    .map(([speaker, words]) => `${speaker}: ${words.join(" ")}`)
    .join("\n");
}
