import { GoogleGenAI } from "@google/genai";
import { demoLead } from "@/lib/demo";
import { leadScoreMultiplier } from "@/lib/utils";

const GEMINI_MODEL_FAST = process.env.GEMINI_FAST_MODEL ?? "gemini-flash-latest";
const GEMINI_MODEL_REASONING = process.env.GEMINI_REASONING_MODEL ?? "gemini-flash-latest";

function parseJsonResponse(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function geminiJson(prompt: string, model = GEMINI_MODEL_REASONING) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });

  return parseJsonResponse(result.text ?? "{}");
}

export async function extractBadgeIdentity(imageBase64?: string, mimeType = "image/png") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !imageBase64) {
    return {
      name: demoLead.name,
      company: demoLead.prospectCompany,
      title: demoLead.title,
      email: demoLead.email,
      phone: demoLead.phone,
      website: demoLead.website,
      confidence: 0.94,
      source: "demo_fallback"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: GEMINI_MODEL_FAST,
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType
          }
        },
        {
          text:
            "Extract contact information from this trade-show badge or business card. Return strict JSON with name, company, title, email, phone, website, confidence. Use null for missing fields."
        }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0
      }
    });

    return parseJsonResponse(result.text ?? "{}");
  } catch (error) {
    console.error("Gemini badge extraction failed, using fallback", error);
    return {
      name: demoLead.name,
      company: demoLead.prospectCompany,
      title: demoLead.title,
      email: demoLead.email,
      phone: demoLead.phone,
      website: demoLead.website,
      confidence: 0.94,
      source: "demo_fallback"
    };
  }
}

export async function runLeadAgents(input: {
  company: Record<string, unknown>;
  identity: Record<string, unknown>;
  transcript: string;
  baseDealSize?: number;
}) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      listener: demoLead.agentRuns[2].outputJson,
      qualification: demoLead.qualification,
      strategy: demoLead.strategy,
      followup: demoLead.followup,
      source: "demo_fallback"
    };
  }

  try {
    const listener = await geminiJson(`You are the Listener Agent for BoothPilot AI.
Analyze this Speechmatics diarized trade-show transcript and return strict JSON with pain_points, buying_intent, objections, requested_features, current_solution, urgency, budget_signals, decision_maker_signals, timeline, direct_quotes, summary.

Company context:
${JSON.stringify(input.company)}

Transcript:
${input.transcript}`);

    const qualification = await geminiJson(`You are the Qualification Agent for BoothPilot AI.
Score this prospect using BANT. Return strict JSON with budget, authority, need, timeline, lead_score from 0 to 100, priority Hot/Warm/Cold, qualification_reasoning, risks, missing_information.

Company ICP:
${JSON.stringify(input.company)}

Prospect identity:
${JSON.stringify(input.identity)}

Conversation insights:
${JSON.stringify(listener)}`);

    const score = Number(qualification.lead_score ?? 70);
    const estimatedValue = Math.round((input.baseDealSize ?? 12000) * leadScoreMultiplier(score));

    const strategy = await geminiJson(`You are the Strategy Agent for BoothPilot AI.
Decide the best next action. Return strict JSON with recommended_action, reason, sales_owner, assets_to_send, followup_deadline, meeting_recommended, crm_status, estimated_deal_value.

Company context:
${JSON.stringify(input.company)}

Lead qualification:
${JSON.stringify(qualification)}

Conversation insights:
${JSON.stringify(listener)}

Calculated estimated deal value: ${estimatedValue}`);

    const followup = await geminiJson(`You are the Follow-Up Agent for BoothPilot AI.
Write a personalized post-event follow-up email. Return strict JSON with subject, email_body, crm_note, meeting_agenda, slack_alert. Do not invent facts.

Company context:
${JSON.stringify(input.company)}

Prospect identity:
${JSON.stringify(input.identity)}

Conversation insights:
${JSON.stringify(listener)}

Strategy:
${JSON.stringify(strategy)}`);

    return { listener, qualification, strategy, followup, source: "gemini" };
  } catch (error) {
    console.error("Gemini agent pipeline failed, using fallback", error);
    return {
      listener: demoLead.agentRuns[2].outputJson,
      qualification: demoLead.qualification,
      strategy: demoLead.strategy,
      followup: demoLead.followup,
      source: "demo_fallback"
    };
  }
}
