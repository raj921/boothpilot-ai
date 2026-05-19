"use client";

import { useRef, useState } from "react";
import { Mic, Square, UploadCloud, Wand2 } from "lucide-react";
import { Panel, StatusPill } from "@/components/ui";

type RunResult = {
  leadId: string;
  leadScore: number;
  priority: string;
  recommendedAction: string;
};

export function CaptureClient() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(true);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Ready for booth demo");
  const [result, setResult] = useState<RunResult | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioFile(new File([blob], "live-booth-recording.webm", { type: "audio/webm" }));
      stream.getTracks().forEach((track) => track.stop());
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setStatus("Recording live booth conversation");
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
    setStatus("Live recording captured");
  }

  async function runBoothPilot() {
    setStatus("Running Speechmatics + Gemini agent pipeline");
    const form = new FormData();
    if (audioFile) form.append("audio", audioFile);
    if (badgeFile) form.append("badge", badgeFile);
    form.append("companyId", "demo_company");
    form.append("consent", String(consent));

    const response = await fetch("/api/agent/run", {
      method: "POST",
      body: form
    });
    const json = (await response.json()) as RunResult;
    setResult(json);
    setStatus("Lead created in BoothPilot CRM");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel title="Capture Inputs" eyebrow="Speechmatics + Gemini">
        <div className="space-y-4">
          <label className="block border border-dashed border-line bg-field/60 p-5">
            <UploadCloud className="mb-3 h-6 w-6 text-signal" />
            <span className="block font-semibold text-fog">Upload booth audio</span>
            <span className="block text-sm text-fog/55">MP3, WAV, M4A, or WebM. Speechmatics is the primary STT layer.</span>
            <input
              className="mt-4 block w-full text-sm text-fog/70 file:mr-4 file:border-0 file:bg-signal file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink"
              type="file"
              accept="audio/*"
              onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <div className="border border-line bg-field/60 p-5">
            <Mic className="mb-3 h-6 w-6 text-signal" />
            <p className="font-semibold text-fog">Live recording</p>
            <p className="text-sm text-fog/55">Record in-browser, then send the captured audio through the same Speechmatics route.</p>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className="focus-ring mt-4 inline-flex items-center gap-2 border border-line bg-panel px-4 py-3 text-sm font-semibold text-fog hover:border-signal"
            >
              {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          <label className="block border border-dashed border-line bg-field/60 p-5">
            <UploadCloud className="mb-3 h-6 w-6 text-copper" />
            <span className="block font-semibold text-fog">Upload badge or business card</span>
            <span className="block text-sm text-fog/55">Gemini vision extracts visitor identity.</span>
            <input
              className="mt-4 block w-full text-sm text-fog/70 file:mr-4 file:border-0 file:bg-copper file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink"
              type="file"
              accept="image/*"
              onChange={(event) => setBadgeFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <label className="flex gap-3 border border-line bg-field/60 p-4 text-sm text-fog/70">
            <input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" />
            The visitor has consented to conversation processing for follow-up purposes.
          </label>

          <button
            type="button"
            onClick={runBoothPilot}
            disabled={!consent}
            className="focus-ring flex w-full items-center justify-center gap-2 bg-signal px-4 py-4 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            Run BoothPilot
          </button>
        </div>
      </Panel>

      <Panel title="Demo Result" eyebrow="Agent output">
        <div className="mb-5 flex items-center justify-between gap-4 border border-line bg-field/70 p-4">
          <span className="text-sm text-fog/70">{status}</span>
          <StatusPill>{audioFile ? "Audio ready" : "Fallback ready"}</StatusPill>
        </div>
        {result ? (
          <div className="space-y-4">
            <div className="border border-signal/30 bg-signal/10 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Lead created</p>
              <h2 className="mt-2 text-3xl font-semibold text-fog">{result.priority} lead, {result.leadScore}/100</h2>
              <p className="mt-2 text-fog/70">{result.recommendedAction}</p>
            </div>
            <a className="inline-flex bg-signal px-4 py-3 text-sm font-semibold text-ink" href={`/leads/${result.leadId}`}>
              Open lead detail
            </a>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-sm text-fog/60">
            <p>[1] Speechmatics transcription waiting</p>
            <p>[2] Gemini badge identity waiting</p>
            <p>[3] BANT qualification waiting</p>
            <p>[4] Follow-up generation waiting</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
