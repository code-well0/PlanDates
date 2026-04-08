"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  isSameMonth,
  isSameDay,
  isToday,
  getCalendarDays,
  isInRange,
  isRangeStart,
  isRangeEnd,
  getEventsForDate,
  WEEKDAYS,
} from "@/utils/calendarHelpers";

export default function Sidebar({
  currentDate,
  selectedRange,
  events,
  notes,
  onMonthChange,
  onDateClick,
  onEventClick,
  onDeleteNote,
  isOpen,
  onClose,
}) {
  const [showAllDayNotes, setShowAllDayNotes] = useState(false);
  const [showAllRangeNotes, setShowAllRangeNotes] = useState(false);
  const calendarDays = getCalendarDays(currentDate);

  const savedRangeNotes = Object.entries(notes || {})
    .filter(([key, value]) => key.includes("_") && typeof value === "string" && value.trim())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, value]) => {
      const [start, end] = key.split("_");
      return {
        key,
        start,
        end,
        preview: value.trim(),
      };
    });

  const monthPrefix = format(currentDate, "yyyy-MM");
  const selectedEvents = selectedRange.start
    ? getEventsForDate(events, selectedRange.start)
    : [];
  const dayNotes = Object.entries(notes || {})
    .filter(([key, value]) => {
      if (typeof value !== "string" || !value.trim()) return false;
      if (key.includes("_")) return false;
      if (key.length !== 10) return false;
      return key.startsWith(monthPrefix);
    })
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .map(([key, value]) => ({
      key,
      preview: value.trim(),
    }));

  const visibleDayNotes = showAllDayNotes ? dayNotes : dayNotes.slice(0, 2);
  const visibleRangeNotes = showAllRangeNotes
    ? savedRangeNotes
    : savedRangeNotes.slice(0, 2);
  const monthSelectValue = format(currentDate, "yyyy-MM");
  const monthOptions = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 12 + i,
      1
    );
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
      date,
    };
  });

  return (
    <>
      {isOpen && (
        <div
          className="mobile-backdrop"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 49,
            display: "none",
          }}
        />
      )}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        {/* Header */}
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-app-name">
            Plan<span>Dates</span>
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="mini-calendar">
          <div className="mini-calendar-header">
            <select
              className="mini-month-select"
              value={monthSelectValue}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-").map(Number);
                onMonthChange(new Date(year, month - 1, 1));
              }}
              aria-label="Select month"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mini-weekdays">
            {WEEKDAYS.map((day) => (
              <div key={day} className="mini-weekday">
                {day.charAt(0)}
              </div>
            ))}
          </div>
          <div className="mini-days">
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDate(events, day);
              const inCurrentMonth = isSameMonth(day, currentDate);
              const classes = [
                "mini-day",
                !inCurrentMonth && "other-month",
                isToday(day) && "today",
                isInRange(day, selectedRange.start, selectedRange.end) &&
                  "in-range",
                isRangeStart(day, selectedRange.start, selectedRange.end) &&
                  "selected range-start",
                isRangeEnd(day, selectedRange.start, selectedRange.end) &&
                  "selected range-end",
                dayEvents.length > 0 && "has-event",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={i}
                  className={classes}
                  onClick={() => onDateClick(day)}
                >
                  {format(day, "d")}
                  {dayEvents.length > 0 && <span className="mini-event-dot" />}
                  {dayEvents.length > 0 && (
                    <div className="mini-day-tooltip">
                      {dayEvents.slice(0, 2).map((evt) => evt.title).join(", ")}
                      {dayEvents.length > 2 ? ` +${dayEvents.length - 2}` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events on selected day */}
        {selectedRange.start && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Events on this day</div>
            {selectedEvents.length === 0 ? (
              <div className="empty-state" style={{ padding: "12px 0" }}>
                <div className="empty-state-text">No events on this day</div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {selectedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="event-item"
                    style={{ borderLeftColor: event.color || "#7c5cfc" }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="event-item-title">{event.title}</div>
                    <div className="event-item-time">
                      🕐 {event.startTime || "All day"}{" "}
                      {event.endTime ? `- ${event.endTime}` : ""}
                    </div>
                    {event.category && (
                      <span
                        className="event-item-category"
                        style={{
                          background: event.bgColor || "rgba(124,92,252,0.15)",
                          color: event.color || "#7c5cfc",
                        }}
                      >
                        {event.category}
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Saved Day Notes */}
        <div className={`sidebar-section ${dayNotes.length === 0 ? "sidebar-section-compact-empty" : ""}`}>
          <div 
            className="sidebar-section-title"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "16px",
              fontWeight: 600
            }}
          >
            Saved Day Notes
          </div>          
          {dayNotes.length === 0 ? (
            <div className="empty-state" style={{ padding: "16px 0" }}>
              <div 
                className="empty-state-text"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  opacity: 0.7
                }}
              >
                No saved day notes
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleDayNotes.map((note) => (
                <motion.div
                  key={note.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="event-item sidebar-note-item"
                  onClick={() => onDateClick(new Date(`${note.key}T00:00:00`))}
                >
                  <div className="sidebar-note-top-row">
                    <div className="event-item-time">
                      📅 {note.key}
                    </div>
                    <button
                      className="sidebar-note-delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.key);
                      }}
                      aria-label="Delete note"
                      title="Delete note"
                    >
                      🗑
                    </button>
                  </div>
                  <div className="event-item-title sidebar-note-preview">
                    {note.preview}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {dayNotes.length > 2 && (
            <button
              className="clear-range-btn"
              onClick={() => setShowAllDayNotes((prev) => !prev)}
              style={{ marginTop: 8 }}
            >
              {showAllDayNotes
                ? "Show less"
                : `More (${dayNotes.length - 2})`}
            </button>
          )}
        </div>

        {/* Saved Range Notes */}
        <div className={`sidebar-section ${savedRangeNotes.length === 0 ? "sidebar-section-compact-empty" : ""}`}>
          <div 
            className="sidebar-section-title"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.3px"
            }}
          >
            Saved Range Notes
          </div>          
          {savedRangeNotes.length === 0 ? (
            <div className="empty-state" style={{ padding: "16px 0" }}>
              <div 
                className="empty-state-text"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  opacity: 0.7
                }}
              >
                No saved range notes
              </div>
            </div>
          ) : (
            <div className="events-list">
              {visibleRangeNotes.map((note) => (
                <div key={note.key} className="event-item sidebar-note-item">
                  <div className="sidebar-note-top-row">
                    <div className="event-item-time">
                      📌 {note.start} → {note.end}
                    </div>
                    <button
                      className="sidebar-note-delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.key);
                      }}
                      aria-label="Delete note"
                      title="Delete note"
                    >
                      🗑
                    </button>
                  </div>
                  <div className="event-item-title sidebar-note-preview">
                    {note.preview}
                  </div>
                </div>
              ))}
            </div>
          )}
          {savedRangeNotes.length > 2 && (
            <button
              className="clear-range-btn"
              onClick={() => setShowAllRangeNotes((prev) => !prev)}
              style={{ marginTop: 8 }}
            >
              {showAllRangeNotes
                ? "Show less"
                : `More (${savedRangeNotes.length - 2})`}
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="sidebar-profile-footer">
          <div className="sidebar-profile">
            <div className="profile-avatar">U</div>
            <div className="profile-info">
              <h3>Username</h3>
              <p>Personal Workspace</p>
            </div>
          </div>
        </div>
      </aside>
      <style jsx>{`
        @media (max-width: 1024px) {
          .mobile-backdrop {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
