"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createMeeting } from "@/lib/meetings";
import { MeetingPriority, MeetingRole } from "@/lib/types";

const roles: MeetingRole[] = ["Client", "Internal Team", "Interview"];
const priorities: MeetingPriority[] = ["Normal", "Important", "Urgent"];

export default function BookPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<MeetingRole>("Client");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<MeetingPriority>("Normal");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(
    () => Boolean(name.trim() && reason.trim() && scheduledTime),
    [name, reason, scheduledTime]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) {
      setMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createMeeting({
        name,
        role,
        reason,
        priority,
        scheduledTime
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to submit booking.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setName("");
    setRole("Client");
    setReason("");
    setPriority("Normal");
    setScheduledTime("");
    setMessage("Meeting request submitted.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Book a Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Role</label>
                <Select value={role} onChange={(e) => setRole(e.target.value as MeetingRole)}>
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as MeetingPriority)}
                >
                  {priorities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the purpose of the meeting"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Date & Time</label>
              <Input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>

            {message ? <p className="text-sm text-slate-600">{message}</p> : null}

            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
