import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const formatDate = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
    locale: id,
  });
