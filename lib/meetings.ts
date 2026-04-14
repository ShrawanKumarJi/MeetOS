import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Meeting, MeetingPriority, MeetingRole, MeetingStatus } from "@/lib/types";

type CreateMeetingInput = {
  name: string;
  role: MeetingRole;
  reason: string;
  priority: MeetingPriority;
  scheduledTime: string;
};

export async function fetchMeetings() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("scheduled_time", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Meeting[];
}

export async function createMeeting(input: CreateMeetingInput) {
  const { error } = await supabase.from("meetings").insert({
    name: input.name.trim(),
    role: input.role,
    reason: input.reason.trim(),
    priority: input.priority,
    status: "pending",
    scheduled_time: new Date(input.scheduledTime).toISOString()
  });

  if (error) throw new Error(error.message);
}

export async function updateMeetingStatus(id: string, status: MeetingStatus) {
  const { error } = await supabase.from("meetings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export function subscribeToMeetings(
  channelName: string,
  onChange: () => void
): RealtimeChannel {
  return supabase
    .channel(channelName)
    .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, onChange)
    .subscribe();
}
