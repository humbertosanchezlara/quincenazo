import {
  endOfMonth,
  format,
  parse,
  startOfMonth,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";

export const pesoFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return pesoFormatter.format(value);
}

export function monthOptions(baseMonth: string, count = 8) {
  const base = parse(`${baseMonth}-01`, "yyyy-MM-dd", new Date());

  return Array.from({ length: count }).map((_, index) => {
    const monthDate = subMonths(base, index);
    return {
      value: format(monthDate, "yyyy-MM"),
      label: format(monthDate, "MMMM yyyy", { locale: es }),
    };
  });
}

export function formatMonthLabel(value: string) {
  return format(parse(`${value}-01`, "yyyy-MM-dd", new Date()), "MMMM yyyy", {
    locale: es,
  });
}

export function getMonthBounds(value: string) {
  const date = parse(`${value}-01`, "yyyy-MM-dd", new Date());
  return {
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export function getCurrentMonthValue() {
  return format(new Date(), "yyyy-MM");
}

export function isValidMonth(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value);
}

export function sanitizeMonth(value: string | undefined): string {
  return value && isValidMonth(value) ? value : getCurrentMonthValue();
}

export function getPreviousMonth(month: string): string {
  const date = parse(`${month}-01`, "yyyy-MM-dd", new Date());
  return format(subMonths(date, 1), "yyyy-MM");
}

export function formatShortDate(value: string) {
  return format(new Date(value), "d MMM", { locale: es });
}

export function formatLongDate(value: string) {
  return format(new Date(value), "d 'de' MMMM, yyyy", { locale: es });
}
