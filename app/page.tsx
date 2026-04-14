import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-56px)] w-full max-w-6xl place-items-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Welcome to MeetOS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>Internal meeting operations platform for Legal Capital.</p>
          <div className="flex gap-4">
            <Link href="/book" className="text-blue-600 hover:underline">
              Book a meeting
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Open dashboard
            </Link>
            <Link href="/display" className="text-blue-600 hover:underline">
              Open display
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
