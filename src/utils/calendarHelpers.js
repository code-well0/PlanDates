import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  startOfDay,
  isWithinInterval,
  isBefore,
  isAfter,
  getDay,
} from "date-fns";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_IMAGES = {
  0: "/images/january.png",
  1: "/images/february.png",
  2: "/images/march.png",
  3: "/images/april_new.png",
  4: "/images/may.png",
  5: "/images/june.png",
  6: "/images/july.png",
  7: "/images/august.png",
  8: "/images/september.png",
  9: "/images/october.png",
  10: "/images/november.png",
  11: "/images/december.png",
};

// Per-month color themes: gradient colors extracted from each month's image palette
export const MONTH_THEMES = {
  0: {
    // January — icy blue, frost
    accent: "#4A90D9",
    accentLight: "#B8D4F0",
    accentGlow: "rgba(74, 144, 217, 0.25)",
    gradient: "linear-gradient(135deg, #4A90D9, #89C4F4)",
    bgTint: "rgba(74, 144, 217, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(74,144,217,0.06) 100%)",
    tagBg: "rgba(74, 144, 217, 0.08)",
  },
  1: {
    // February — rose, blush pink
    accent: "#D4547A",
    accentLight: "#F2B8C6",
    accentGlow: "rgba(212, 84, 122, 0.25)",
    gradient: "linear-gradient(135deg, #D4547A, #F5A0B8)",
    bgTint: "rgba(212, 84, 122, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(212,84,122,0.06) 100%)",
    tagBg: "rgba(212, 84, 122, 0.08)",
  },
  2: {
    // March — fresh mint, lavender
    accent: "#5AAF6E",
    accentLight: "#B4DDB8",
    accentGlow: "rgba(90, 175, 110, 0.25)",
    gradient: "linear-gradient(135deg, #5AAF6E, #A8D8B9)",
    bgTint: "rgba(90, 175, 110, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(90,175,110,0.06) 100%)",
    tagBg: "rgba(90, 175, 110, 0.08)",
  },
  3: {
    // April — cherry blossom pink, coral
    accent: "#E07BAF",
    accentLight: "#F5C6D8",
    accentGlow: "rgba(224, 123, 175, 0.25)",
    gradient: "linear-gradient(135deg, #E07BAF, #F8B4C8)",
    bgTint: "rgba(224, 123, 175, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(224,123,175,0.06) 100%)",
    tagBg: "rgba(224, 123, 175, 0.08)",
  },
  4: {
    // May — emerald green, golden
    accent: "#3D9B56",
    accentLight: "#A3D9A5",
    accentGlow: "rgba(61, 155, 86, 0.25)",
    gradient: "linear-gradient(135deg, #3D9B56, #8BC34A)",
    bgTint: "rgba(61, 155, 86, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(61,155,86,0.06) 100%)",
    tagBg: "rgba(61, 155, 86, 0.08)",
  },
  5: {
    // June — warm amber, sunflower gold
    accent: "#D4952B",
    accentLight: "#F2D48A",
    accentGlow: "rgba(212, 149, 43, 0.25)",
    gradient: "linear-gradient(135deg, #D4952B, #F0C75E)",
    bgTint: "rgba(212, 149, 43, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(212,149,43,0.06) 100%)",
    tagBg: "rgba(212, 149, 43, 0.08)",
  },
  6: {
    // July — turquoise, coral beach
    accent: "#20A9B2",
    accentLight: "#8CD9DD",
    accentGlow: "rgba(32, 169, 178, 0.25)",
    gradient: "linear-gradient(135deg, #20A9B2, #6DD5DA)",
    bgTint: "rgba(32, 169, 178, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(32,169,178,0.06) 100%)",
    tagBg: "rgba(32, 169, 178, 0.08)",
  },
  7: {
    // August — lavender, violet
    accent: "#7B5EA7",
    accentLight: "#C4A8E0",
    accentGlow: "rgba(123, 94, 167, 0.25)",
    gradient: "linear-gradient(135deg, #7B5EA7, #B68CD8)",
    bgTint: "rgba(123, 94, 167, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(123,94,167,0.06) 100%)",
    tagBg: "rgba(123, 94, 167, 0.08)",
  },
  8: {
    // September — burgundy, amber
    accent: "#B0603A",
    accentLight: "#DBA882",
    accentGlow: "rgba(176, 96, 58, 0.25)",
    gradient: "linear-gradient(135deg, #B0603A, #D4956B)",
    bgTint: "rgba(176, 96, 58, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(176,96,58,0.06) 100%)",
    tagBg: "rgba(176, 96, 58, 0.08)",
  },
  9: {
    // October — fiery orange, red
    accent: "#D46A2B",
    accentLight: "#F0A86A",
    accentGlow: "rgba(212, 106, 43, 0.25)",
    gradient: "linear-gradient(135deg, #D46A2B, #E89B5E)",
    bgTint: "rgba(212, 106, 43, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(212,106,43,0.06) 100%)",
    tagBg: "rgba(212, 106, 43, 0.08)",
  },
  10: {
    // November — warm brown, copper
    accent: "#8B6B4A",
    accentLight: "#C8A882",
    accentGlow: "rgba(139, 107, 74, 0.25)",
    gradient: "linear-gradient(135deg, #8B6B4A, #B89870)",
    bgTint: "rgba(139, 107, 74, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(139,107,74,0.06) 100%)",
    tagBg: "rgba(139, 107, 74, 0.08)",
  },
  11: {
    // December — deep navy, red, gold
    accent: "#C0392B",
    accentLight: "#E8A090",
    accentGlow: "rgba(192, 57, 43, 0.25)",
    gradient: "linear-gradient(135deg, #C0392B, #E74C3C)",
    bgTint: "rgba(192, 57, 43, 0.04)",
    heroBg: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(192,57,43,0.06) 100%)",
    tagBg: "rgba(192, 57, 43, 0.08)",
  },
};

export const MONTH_QUOTES = {
  0: "New beginnings, new adventures.",
  1: "Love is in the air.",
  2: "Spring is nature's way of saying, 'Let's party!'",
  3: "April hath put a spirit of youth in everything.",
  4: "Flowers always make people better, happier, and more helpful.",
  5: "And so the adventure begins.",
  6: "Sunshine is the best medicine.",
  7: "Live in the sunshine, swim the sea, drink the wild air.",
  8: "Autumn carries more gold in its pocket than all other seasons.",
  9: "Every leaf speaks bliss to me, fluttering from the autumn tree.",
  10: "Gratitude unlocks the fullness of life.",
  11: "It's the most wonderful time of the year.",
};

export const EVENT_COLORS = [
  { name: "Coral", value: "#FF6B6B", bg: "rgba(255,107,107,0.15)" },
  { name: "Mint", value: "#51CF66", bg: "rgba(81,207,102,0.15)" },
  { name: "Sky", value: "#339AF0", bg: "rgba(51,154,240,0.15)" },
  { name: "Lavender", value: "#CC5DE8", bg: "rgba(204,93,232,0.15)" },
  { name: "Amber", value: "#FF922B", bg: "rgba(255,146,43,0.15)" },
  { name: "Teal", value: "#20C997", bg: "rgba(32,201,151,0.15)" },
  { name: "Rose", value: "#F06595", bg: "rgba(240,101,149,0.15)" },
  { name: "Gold", value: "#FAB005", bg: "rgba(250,176,5,0.15)" },
];

export const CATEGORIES = [
  { name: "Personal", color: "#FF922B" },
  { name: "Work", color: "#339AF0" },
  { name: "Health", color: "#51CF66" },
  { name: "Social", color: "#CC5DE8" },
];

// US Holidays
export function getHolidays(year) {
  const holidays = {};

  // New Year's Day
  holidays[`${year}-01-01`] = "New Year's Day";
  // Valentine's Day
  holidays[`${year}-02-14`] = "Valentine's Day";
  // St Patrick's Day
  holidays[`${year}-03-17`] = "St. Patrick's Day";
  // Independence Day
  holidays[`${year}-07-04`] = "Independence Day";
  // Halloween
  holidays[`${year}-10-31`] = "Halloween";
  // Christmas
  holidays[`${year}-12-25`] = "Christmas Day";
  // New Year's Eve
  holidays[`${year}-12-31`] = "New Year's Eve";

  // MLK Day - 3rd Monday of January
  const mlk = getNthWeekday(year, 0, 1, 3);
  holidays[format(mlk, "yyyy-MM-dd")] = "MLK Jr. Day";

  // Presidents Day - 3rd Monday of February
  const presidents = getNthWeekday(year, 1, 1, 3);
  holidays[format(presidents, "yyyy-MM-dd")] = "Presidents' Day";

  // Memorial Day - Last Monday of May
  const memorial = getLastWeekday(year, 4, 1);
  holidays[format(memorial, "yyyy-MM-dd")] = "Memorial Day";

  // Labor Day - 1st Monday of September
  const labor = getNthWeekday(year, 8, 1, 1);
  holidays[format(labor, "yyyy-MM-dd")] = "Labor Day";

  // Thanksgiving - 4th Thursday of November
  const thanksgiving = getNthWeekday(year, 10, 4, 4);
  holidays[format(thanksgiving, "yyyy-MM-dd")] = "Thanksgiving";

  return holidays;
}

function getNthWeekday(year, month, weekday, n) {
  let date = new Date(year, month, 1);
  let count = 0;
  while (count < n) {
    if (getDay(date) === weekday) count++;
    if (count < n) date = new Date(year, month, date.getDate() + 1);
  }
  return date;
}

function getLastWeekday(year, month, weekday) {
  let date = endOfMonth(new Date(year, month, 1));
  while (getDay(date) !== weekday) {
    date = new Date(year, month, date.getDate() - 1);
  }
  return date;
}

export function getCalendarDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function getWeekDays(date) {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Time slots from 6am to 10pm
export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return {
    hour,
    label: `${h12}:00 ${ampm}`,
    shortLabel: `${h12} ${ampm}`,
  };
});

export function getEventsForWeek(events, date) {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  return events.filter((e) => {
    const eventDate = new Date(e.date + "T00:00:00");
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
}

// Parse time string "HH:MM" to decimal hours
export function timeToDecimal(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

export function isInRange(day, startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = isBefore(startDate, endDate) ? startDate : endDate;
  const end = isAfter(endDate, startDate) ? endDate : startDate;
  return isWithinInterval(day, { start, end });
}

export function isRangeStart(day, startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = isBefore(startDate, endDate) ? startDate : endDate;
  return isSameDay(day, start);
}

export function isRangeEnd(day, startDate, endDate) {
  if (!endDate) return false;
  const end = isAfter(endDate, startDate) ? endDate : startDate;
  return isSameDay(day, end);
}

// localStorage helpers
const EVENTS_KEY = "calendar_events";
const NOTES_KEY = "calendar_notes";

export function loadEvents() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function loadNotes() {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getEventsForDate(events, date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return events.filter((e) => e.date === dateStr);
}

export function getEventsForMonth(events, date) {
  const monthStr = format(date, "yyyy-MM");
  return events.filter((e) => e.date.startsWith(monthStr));
}

export {
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  startOfDay,
  startOfWeek,
};
