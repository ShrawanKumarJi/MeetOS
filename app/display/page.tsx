"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Meeting } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export default function DisplayPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    const { data } = await supabase
      .from("meetings")
      .select("*")
      .order("scheduled_time", { ascending: true });

    if (data) setMeetings(data as Meeting[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMeetings();
    const channel = supabase
      .channel("meetings-display")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meetings" },
        () => void fetchMeetings()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMeetings]);

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
