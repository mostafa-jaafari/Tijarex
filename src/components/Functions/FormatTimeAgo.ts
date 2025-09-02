

export function FormatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = Math.round((now - timestamp) / 1000);

  // Define time intervals in seconds
  const intervals = {
    y: 31536000, // 365 days
    w: 604800,   // 7 days
    d: 86400,    // 24 hours
    h: 3600,     // 60 minutes
    m: 60,       // 60 seconds
  };

  if (secondsAgo < 0) return "just now"; // Handle edge cases
  if (secondsAgo < intervals.m) return `${secondsAgo}s`;

  if (secondsAgo < intervals.h) {
    return `${Math.floor(secondsAgo / intervals.m)}m`;
  }
  if (secondsAgo < intervals.d) {
    return `${Math.floor(secondsAgo / intervals.h)}h`;
  }
  if (secondsAgo < intervals.w) {
    return `${Math.floor(secondsAgo / intervals.d)}d`;
  }
  if (secondsAgo < intervals.y) {
    return `${Math.floor(secondsAgo / intervals.w)}w`;
  }
  
  return `${Math.floor(secondsAgo / intervals.y)}y`;
}