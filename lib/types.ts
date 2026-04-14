export type MeetingRole = "Client" | "Internal Team" | "Interview";
export type MeetingPriority = "Normal" | "Important" | "Urgent";
export type MeetingStatus = "pending" | "approved" | "in_progress" | "completed";

export type Meeting = {
  id: string;
  name: string;
  role: MeetingRole;
  reason: string;
  priority: MeetingPriority;
  status: MeetingStatus;
  scheduled_time: string;
  created_at: string;
};
