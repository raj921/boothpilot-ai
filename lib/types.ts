export type CompanyProfile = {
  id: string;
  name: string;
  productDescription: string;
  icp: string;
  pricing: string;
  caseStudy: string;
  calendarLink: string;
  baseDealSize: number;
};

export type TranscriptTurn = {
  speaker: "Sales Rep" | "Visitor" | "Speaker 1" | "Speaker 2";
  text: string;
  start?: number;
  end?: number;
};

export type LeadRecord = {
  id: string;
  name: string;
  prospectCompany: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  leadScore: number;
  priority: "Hot" | "Warm" | "Cold";
  status: "new" | "follow_up_ready" | "follow_up_sent" | "meeting_booked";
  estimatedValue: number;
  summary: string;
  transcript: string;
  transcriptJson: { speakers: TranscriptTurn[] };
  qualification: Record<string, unknown>;
  strategy: Record<string, unknown>;
  followup: {
    subject: string;
    emailBody: string;
    crmNote: string;
    meetingAgenda: string[];
    slackAlert: string;
  };
  agentRuns: AgentRunRecord[];
};

export type AgentRunRecord = {
  agentName: string;
  status: string;
  latencyMs: number;
  inputJson: Record<string, unknown>;
  outputJson: Record<string, unknown>;
};
