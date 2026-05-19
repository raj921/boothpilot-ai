import type { AgentRunRecord, CompanyProfile, LeadRecord, TranscriptTurn } from "@/lib/types";

export const demoCompany: CompanyProfile = {
  id: "demo_company",
  name: "CloudOps AI",
  productDescription: "AI support automation for mid-market SaaS and logistics teams.",
  icp: "Companies with 50-500 employees, high customer support volume, and manual ticket routing.",
  pricing: "Starts at EUR 1,000/month",
  caseStudy: "Reduced support response time by 42% for a logistics operator.",
  calendarLink: "https://calendly.com/cloudops/demo",
  baseDealSize: 12000
};

export const transcriptTurns: TranscriptTurn[] = [
  {
    speaker: "Sales Rep",
    text: "What brings you to Milan AI Week today?"
  },
  {
    speaker: "Visitor",
    text: "I am Marco from NorthStar Logistics. We have 80 employees and we need to automate customer support tickets before Q3."
  },
  {
    speaker: "Sales Rep",
    text: "Are you mostly looking at routing, response drafting, or analytics?"
  },
  {
    speaker: "Visitor",
    text: "Routing is the pain. Right now our operations team manually routes everything, and response delays are hurting our enterprise customers."
  },
  {
    speaker: "Visitor",
    text: "I am not the final signer, but I own the evaluation and can bring our VP Operations into a call next week."
  }
];

export const demoTranscript = transcriptTurns.map((turn) => `${turn.speaker}: ${turn.text}`).join("\n");

export const demoAgentRuns: AgentRunRecord[] = [
  {
    agentName: "Speechmatics Transcription",
    status: "completed",
    latencyMs: 1420,
    inputJson: { source: "audio", diarization: true },
    outputJson: { speakers: transcriptTurns.length, provider: "Speechmatics" }
  },
  {
    agentName: "Gemini Identity Agent",
    status: "completed",
    latencyMs: 980,
    inputJson: { source: "badge_image" },
    outputJson: {
      name: "Marco Rossi",
      company: "NorthStar Logistics",
      title: "Operations Director",
      email: "marco@northstarlogistics.com",
      confidence: 0.94
    }
  },
  {
    agentName: "Gemini Listener Agent",
    status: "completed",
    latencyMs: 1240,
    inputJson: { transcript: "Speechmatics diarized transcript" },
    outputJson: {
      pain_points: ["Manual ticket routing", "Enterprise customer response delays"],
      urgency: "Before Q3",
      buying_intent: "High"
    }
  },
  {
    agentName: "Gemini Qualification Agent",
    status: "completed",
    latencyMs: 1520,
    inputJson: { framework: "BANT" },
    outputJson: {
      budget: "Medium-high",
      authority: "Evaluator with executive access",
      need: "High",
      timeline: "Q3",
      lead_score: 91,
      priority: "Hot"
    }
  },
  {
    agentName: "Gemini Strategy Agent",
    status: "completed",
    latencyMs: 1080,
    inputJson: { lead_score: 91 },
    outputJson: {
      recommended_action: "Book discovery call within 24 hours",
      assets_to_send: ["Logistics support automation case study", "AI ticket-routing product deck"]
    }
  },
  {
    agentName: "Gemini Follow-Up Agent",
    status: "completed",
    latencyMs: 1320,
    inputJson: { action: "Book discovery call" },
    outputJson: { subject: "Support automation for NorthStar Logistics" }
  }
];

export const demoLead: LeadRecord = {
  id: "lead_marco_rossi",
  name: "Marco Rossi",
  prospectCompany: "NorthStar Logistics",
  title: "Operations Director",
  email: "marco@northstarlogistics.com",
  phone: "+39 123 456 789",
  website: "northstarlogistics.com",
  leadScore: 91,
  priority: "Hot",
  status: "follow_up_ready",
  estimatedValue: 12000,
  summary:
    "Marco owns the evaluation for support automation at an 80-person logistics company and wants ticket routing improved before Q3.",
  transcript: demoTranscript,
  transcriptJson: { speakers: transcriptTurns },
  qualification: {
    budget: "Medium-high",
    authority: "Evaluator with VP Operations access",
    need: "High",
    timeline: "Q3",
    lead_score: 91,
    priority: "Hot",
    qualification_reasoning:
      "Clear operational pain, defined evaluation owner, near-term timeline, and strong ICP match."
  },
  strategy: {
    recommended_action: "Book discovery call within 24 hours",
    reason: "High-intent operations buyer with urgent automation need.",
    sales_owner: "Enterprise Sales",
    assets_to_send: ["Logistics support automation case study", "AI ticket-routing product deck"],
    followup_deadline: "24 hours",
    meeting_recommended: true,
    crm_status: "follow_up_ready",
    estimated_deal_value: 12000
  },
  followup: {
    subject: "Support automation for NorthStar Logistics",
    emailBody:
      "Hi Marco,\n\nGreat speaking with you at Milan AI Week. You mentioned that NorthStar Logistics is looking to automate customer support ticket routing before Q3, and that manual routing is creating response delays for enterprise customers.\n\nBased on that, our logistics support automation case study should be relevant. Teams similar to yours have reduced response time by 42% using our AI routing workflow.\n\nWould you be open to a 30-minute discovery call next week with your VP Operations?\n\nBest,\nCloudOps AI Team",
    crmNote:
      "Hot lead. Operations Director at NorthStar Logistics. Pain: manual support ticket routing. Timeline: before Q3. Next action: discovery call within 24 hours.",
    meetingAgenda: ["Current ticket routing process", "Q3 automation goals", "VP Operations decision criteria"],
    slackAlert:
      "Hot lead ready: Marco Rossi from NorthStar Logistics scored 91/100. Book discovery call within 24 hours."
  },
  agentRuns: demoAgentRuns
};

export const demoLeads: LeadRecord[] = [
  demoLead,
  {
    ...demoLead,
    id: "lead_anna_bianchi",
    name: "Anna Bianchi",
    prospectCompany: "MedDesk Europe",
    title: "Head of Customer Experience",
    email: "anna@meddesk.example",
    leadScore: 76,
    priority: "Warm",
    status: "new",
    estimatedValue: 8000,
    summary: "Interested in reducing support backlog, but no confirmed timeline yet."
  },
  {
    ...demoLead,
    id: "lead_luca_ferrari",
    name: "Luca Ferrari",
    prospectCompany: "RetailGrid",
    title: "Innovation Manager",
    email: "luca@retailgrid.example",
    leadScore: 44,
    priority: "Cold",
    status: "new",
    estimatedValue: 3000,
    summary: "General exploration with weak urgency and unclear ownership."
  }
];

export function computeMetrics(leads = demoLeads) {
  const hotLeads = leads.filter((lead) => lead.priority === "Hot");
  const warmLeads = leads.filter((lead) => lead.priority === "Warm");
  const coldLeads = leads.filter((lead) => lead.priority === "Cold");
  const estimatedPipeline = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const lostRevenuePrevented = hotLeads
    .filter((lead) => lead.status !== "follow_up_sent" && lead.status !== "meeting_booked")
    .reduce((sum, lead) => sum + lead.estimatedValue, 0);

  return {
    totalConversations: leads.length,
    hot: hotLeads.length,
    warm: warmLeads.length,
    cold: coldLeads.length,
    followupsGenerated: leads.filter((lead) => lead.followup.emailBody).length,
    estimatedPipeline,
    lostRevenuePrevented,
    formula: "estimated_value = base_deal_size * lead_score_multiplier"
  };
}
