// Get current date with format "YYYY-MM-DDTHH:MM"
export function getCurrentDateFormatted(): string {
  const now = new Date();

  const pad = (n: Number) => n.toString().padStart(2, '0');
  const formatted =
    now.getFullYear() +
    '-' +
    pad(now.getMonth() + 1) +
    '-' +
    pad(now.getDate()) +
    'T' +
    pad(now.getHours()) +
    ':' +
    pad(now.getMinutes());

  return formatted;
}
