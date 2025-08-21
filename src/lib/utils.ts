import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isYesterday, isThisYear } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatDateOptions = {
  formatStr?: string;
  relative?: boolean;
  includeTime?: boolean;
};

export function formatDate(
  date: Date | string | number,
  options: FormatDateOptions = {}
): string {
  const { formatStr = 'PPP', relative = true, includeTime = false } = options;
  const parsedDate = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  // Handle relative dates (e.g., "2 hours ago", "yesterday")
  if (relative) {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (isToday(parsedDate)) {
      return `Today${includeTime ? ` at ${format(parsedDate, 'h:mm a')}` : ''}`;
    } 
    
    if (isYesterday(parsedDate)) {
      return `Yesterday${includeTime ? ` at ${format(parsedDate, 'h:mm a')}` : ''}`;
    }
    
    if (diffInDays > 1 && diffInDays <= 7) {
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }

  // Format date based on the current year
  if (isThisYear(parsedDate)) {
    return format(parsedDate, includeTime ? 'MMM d, h:mm a' : 'MMM d');
  }

  // Default format
  return format(parsedDate, formatStr);
}
