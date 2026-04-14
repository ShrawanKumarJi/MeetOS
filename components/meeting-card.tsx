"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meeting } from "@/lib/types";

type MeetingCardProps = {
  meeting: Meeting;
  onApprove?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  loading?: boolean;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function MeetingCard({
  meeting,
  onApprove,
  onStart,
  onComplete,
  loading
}: MeetingCardProps) {
  const priorityVariant =
    meeting.priority === "Urgent"
      ? "danger"
      : meeting.priority === "Important"
        ? "warning"
        : "secondary";

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{meeting.name}</CardTitle>
          <Badge variant={priorityVariant}>{meeting.priority}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{meeting.role}</Badge>
          <Badge variant="secondary">{meeting.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">{meeting.reason}</p>
        <p className="text-xs text-slate-500">{formatDate(meeting.scheduled_time)}</p>
        <div className="flex flex-wrap gap-2">
          {meeting.status === "pending" && onApprove ? (
            <Button size="sm" onClick={onApprove} disabled={loading}>
              Approve
            </Button>
          ) : null}
          {meeting.status === "approved" && onStart ? (
            <Button size="sm" variant="secondary" onClick={onStart} disabled={loading}>
              Start Meeting
            </Button>
          ) : null}
          {meeting.status === "in_progress" && onComplete ? (
            <Button size="sm" variant="outline" onClick={onComplete} disabled={loading}>
              Complete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
