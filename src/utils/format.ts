import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy');
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'h:mm a');
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'd MMM, h:mm a');
}

export function daysUntil(iso: string): number {
  return Math.max(0, differenceInCalendarDays(new Date(iso), new Date()));
}

export function dayGroupLabel(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd MMMM yyyy');
}