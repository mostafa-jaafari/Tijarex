"use client";


export function formatFirestoreDate(timestamp: { seconds: number; nanoseconds: number }): string {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",  // Aug, Sep, ...
    year: "numeric",
  });
}

export function formatFirestoreTime(timestamp: { seconds: number; nanoseconds: number }): string {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // يخليها 24 ساعة
  });
}
