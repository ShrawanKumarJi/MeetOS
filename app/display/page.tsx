"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMeetings, subscribeToMeetings } from "@/lib/meetings";
import { supabase } from "@/lib/supabase";
import { Meeting } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export default function DisplayPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const loadMeetings = useCallback(async () => {
    try {
      const data = await fetchMeetings();
      setMeetings(data);
      setUpdatedAt(new Date());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meetings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMeetings();
    const channel = subscribeToMeetings("meetings-display", () => void loadMeetings());

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadMeetings]);

  const currentMeeting = useMemo(
    () => meetings.find((m) => m.status === "in_progress") ?? null,
    [meetings]
  );
  const waitingQueue = useMemo(
    () => meetings.filter((m) => m.status === "approved" || m.status === "pending"),
    [meetings]
  );
  const nextMeeting = waitingQueue[0] ?? null;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-3">
        <Card className="border-slate-700 bg-slate-900 text-slate-50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Current Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-slate-300">Loading...</p>
            ) : error ? (
              <p className="text-red-300">{error}</p>
            ) : currentMeeting ? (
              <>
                <p className="text-4xl font-semibold">{currentMeeting.name}</p>
                <p className="text-lg text-slate-300">{currentMeeting.reason}</p>
                <div className="flex gap-2">
                  <Badge variant="warning">{currentMeeting.role}</Badge>
                  <Badge variant="danger">{currentMeeting.priority}</Badge>
                </div>
              </>
            ) : (
              <p className="text-xl text-slate-300">No meeting in progress.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900 text-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-slate-400">
              Last updated: {updatedAt ? updatedAt.toLocaleTimeString() : "-"}
            </div>
            <div>
              <p className="text-sm text-slate-400">Waiting Count</p>
              <p className="text-4xl font-semibold text-yellow-300">{waitingQueue.length}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Next Meeting</p>
              {nextMeeting ? (
                <div className="mt-2 space-y-1 rounded-lg border border-slate-700 p-3">
                  <p className="font-medium">{nextMeeting.name}</p>
                  <p className="text-sm text-slate-300">{nextMeeting.role}</p>
                  <p className="text-sm text-slate-300">{formatDate(nextMeeting.scheduled_time)}</p>
                </div>
              ) : (
                <p className="mt-2 text-slate-300">No one waiting.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
