"use client";

import { useCallback, useEffect, useState } from "react";
import { MeetingCard } from "@/components/meeting-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMeetings, subscribeToMeetings, updateMeetingStatus } from "@/lib/meetings";
import { supabase } from "@/lib/supabase";
import { Meeting, MeetingStatus } from "@/lib/types";

function sectionTitle(title: string, count: number) {
  return `${title} (${count})`;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadMeetings = useCallback(async () => {
    try {
      const data = await fetchMeetings();
      setMeetings(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meetings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMeetings();
    const channel = subscribeToMeetings("meetings-dashboard", () => void loadMeetings());

    return () => {
      // Remove channel on unmount to avoid duplicate subscriptions.
      void supabase.removeChannel(channel);
    };
  }, [loadMeetings]);

  async function updateStatus(id: string, status: MeetingStatus) {
    setUpdatingId(id);
    try {
      await updateMeetingStatus(id, status);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update meeting status.");
    }
    setUpdatingId(null);
  }

  const live = meetings.filter((m) => m.status === "in_progress");
  const waiting = meetings.filter((m) => m.status === "approved" || m.status === "pending");
  const completed = meetings.filter((m) => m.status === "completed");

  const sections = [
    { key: "live", title: sectionTitle("Live", live.length), items: live },
    { key: "waiting", title: sectionTitle("Waiting", waiting.length), items: waiting },
    { key: "completed", title: sectionTitle("Completed", completed.length), items: completed }
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Meeting Dashboard</h1>
        <p className="text-sm text-slate-600">
          Real-time control panel for Legal Capital meeting operations.
        </p>
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading meetings...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.key} className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {section.items.length === 0 ? (
                <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                  No meetings in this section.
                </p>
              ) : (
                <div className="space-y-3">
                  {section.items.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      loading={updatingId === meeting.id}
                      onApprove={
                        meeting.status === "pending"
                          ? () => void updateStatus(meeting.id, "approved")
                          : undefined
                      }
                      onStart={
                        meeting.status === "approved"
                          ? () => void updateStatus(meeting.id, "in_progress")
                          : undefined
                      }
                      onComplete={
                        meeting.status === "in_progress"
                          ? () => void updateStatus(meeting.id, "completed")
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
