import { format } from "date-fns";
import sv from "date-fns/locale/sv";

export function fmt(d) {
  if (!d) return "";
  try {
    return format(new Date(d), "d MMM yyyy", { locale: sv });
  } catch {
    return "";
  }
}

export function fmtRange(start, end) {
  if (!start && !end) return "";
  if (start && !end) return fmt(start);
  if (!start && end) return fmt(end);
  return `${fmt(start)} – ${fmt(end)}`;
}
