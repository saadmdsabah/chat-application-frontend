function timeAgo(date: string | Date): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1 ? `${count} ${key} ago` : `${count} ${key}s ago`;
    }
  }

  return "just now";
}

export default timeAgo;
