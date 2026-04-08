"use client";
import { useState, useCallback, useEffect } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import Sidebar from "@/components/Sidebar/Sidebar";
import CalendarGrid from "@/components/Calendar/CalendarGrid";
import EventModal from "@/components/EventModal/EventModal";
import EventDetailsModal from "@/components/EventModal/EventDetailsModal";
import NotesPanel from "@/components/NotesPanel/NotesPanel";
import { format, MONTH_THEMES } from "@/utils/calendarHelpers";
import { MONTH_IMAGES } from "@/utils/calendarHelpers";

const THEME_STORAGE_KEY = "calendar_theme_mode";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export default function CalendarApp() {
  const calendar = useCalendar();
  const [view, setView] = useState("Month");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [direction, setDirection] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const nextIsDark = storedTheme ? storedTheme === "dark" : false;
    setIsDarkMode(nextIsDark);
  }, []);

  useEffect(() => {
    Object.values(MONTH_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Dynamically apply month theme CSS variables
  useEffect(() => {
    const monthIndex = calendar.currentDate.getMonth();
    const theme = MONTH_THEMES[monthIndex];
    if (!theme) return;

    const root = document.documentElement;
    const rgb = hexToRgb(theme.accent);
    const darkBgTint = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
    const darkTagBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;

    root.style.setProperty("--accent-primary", theme.accent);
    root.style.setProperty("--accent-light", theme.accentLight);
    root.style.setProperty("--accent-primary-glow", theme.accentGlow);
    root.style.setProperty("--accent-gradient", theme.gradient);
    root.style.setProperty("--accent-bg-tint", isDarkMode ? darkBgTint : theme.bgTint);
    root.style.setProperty("--accent-tag-bg", isDarkMode ? darkTagBg : theme.tagBg);
    root.style.setProperty("--text-accent", theme.accent);
    root.style.setProperty("--border-accent", theme.accentGlow);
  }, [calendar.currentDate, isDarkMode]);

  // View-aware navigation
  const handlePrev = useCallback(() => {
    setDirection(-1);
    if (view === "Week") calendar.prevWeek();
    else if (view === "Day") calendar.prevDay();
    else calendar.prevMonth();
  }, [calendar, view]);

  const handleNext = useCallback(() => {
    setDirection(1);
    if (view === "Week") calendar.nextWeek();
    else if (view === "Day") calendar.nextDay();
    else calendar.nextMonth();
  }, [calendar, view]);

  const handleAddEvent = useCallback((date) => {
    setModalDate(date);
    setEditEvent(null);
    setModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event) => {
    setDetailsEvent(event);
    setDetailsOpen(true);
  }, []);

  const handleEditFromDetails = useCallback(() => {
    if (!detailsEvent) return;
    const eventDate = new Date(detailsEvent.date + "T00:00:00");
    setDetailsOpen(false);
    setModalDate(eventDate);
    setEditEvent(detailsEvent);
    setModalOpen(true);
  }, [detailsEvent]);

  const handleSaveEvent = useCallback(
    (eventData) => {
      if (editEvent) {
        calendar.updateEvent(editEvent.id, eventData);
      } else {
        calendar.addEvent(eventData);
      }
    },
    [calendar, editEvent]
  );

  const handleDeleteEvent = useCallback(
    (id) => {
      calendar.deleteEvent(id);
    },
    [calendar]
  );

  const handleDeleteNote = useCallback(
    (noteKey) => {
      calendar.updateNote(noteKey, "");
    },
    [calendar]
  );

  // When switching to Day view, navigate to a specific date
  const handleViewChange = useCallback(
    (newView) => {
      setView(newView);
    },
    []
  );

  // Jump to a specific date (used when clicking a day in week view to go to day view)
  const handleGoToDate = useCallback(
    (date) => {
      calendar.setCurrentDate(date);
      setView("Day");
    },
    [calendar]
  );

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  if (!calendar.mounted) {
    return (
      <div className="app-layout">
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="skeleton"
            style={{ width: 200, height: 30, margin: "auto" }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`app-layout ${notesOpen ? "notes-open" : "notes-closed"}`}>
      {/* Sidebar */}
      <Sidebar
        currentDate={calendar.currentDate}
        selectedRange={calendar.selectedRange}
        events={calendar.events}
        notes={calendar.notes}
        onMonthChange={calendar.setCurrentDate}
        onDateClick={calendar.handleDateClick}
        onEventClick={handleEventClick}
        onDeleteNote={handleDeleteNote}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Calendar */}
<CalendarGrid
  currentDate={calendar.currentDate}
  selectedRange={calendar.selectedRange}
  events={calendar.events}
  onDateClick={calendar.handleDateClick}
  onAddEvent={handleAddEvent}
  onEventClick={handleEventClick}
  onDragStart={calendar.handleDragStart}
  onDragMove={calendar.handleDragMove}
  onDragEnd={calendar.handleDragEnd}
  onPrev={handlePrev}
  onNext={handleNext}
  onGoToToday={calendar.goToToday}
  onGoToDate={handleGoToDate}
  view={view}
  onViewChange={handleViewChange}
  notesOpen={notesOpen}
  onOpenNotes={() => setNotesOpen(true)}
  isDarkMode={isDarkMode}
  onToggleTheme={handleToggleTheme}
  direction={direction}
/>

      {/* Notes Panel */}
      {notesOpen && (
        <NotesPanel
          currentDate={calendar.currentDate}
          selectedRange={calendar.selectedRange}
          events={calendar.events}
          notes={calendar.notes}
          onUpdateNote={calendar.updateNote}
          onClearRange={calendar.clearRange}
          onEventClick={handleEventClick}
          isOpen={notesOpen}
          onClose={() => setNotesOpen(false)}
        />
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={modalDate}
        editEvent={editEvent}
      />

      <EventDetailsModal
        isOpen={detailsOpen}
        event={detailsEvent}
        onClose={() => {
          setDetailsOpen(false);
          setDetailsEvent(null);
        }}
        onEdit={handleEditFromDetails}
      />

      {/* Mobile toggles */}
      <button
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        id="mobile-sidebar-toggle"
      >
        ☰
      </button>

      <button
        className="mobile-toggle-notes"
        onClick={() => setNotesOpen(!notesOpen)}
        aria-label="Toggle notes"
        id="mobile-notes-toggle"
      >
        ✎
      </button>
      </div>
      <footer className="app-global-footer">© 2026 PlanDates • Privacy <br/> Made with ❤️ by Shubrali</footer>
    </>
  );
}
