import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Release";
  const date = searchParams.get("date");
  const url = searchParams.get("url") ?? "";

  // si no hay fecha, devolvemos 400
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const start = new Date(date);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z"); // YYYYMMDDTHHMMSSZ

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//seasontrack.app//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@seasontrack.app`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    url ? `URL:${url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="event.ics"`,
    },
  });
}
