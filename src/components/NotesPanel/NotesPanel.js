"use client";
import { useEffect, useState } from "react";
import {
  format,
  isSameDay,
  getEventsForMonth,
} from "@/utils/calendarHelpers";

export default function NotesPanel({
  currentDate,
  selectedRange,
  events,
  notes,
  onUpdateNote,
  onClearRange,
  onEventClick,
  isOpen,
  onClose,
}) {
  const monthKey = format(currentDate, "yyyy-MM");
  const monthNote = notes[monthKey] || "";

  // Get range key if we have a range
  const rangeKey =
    selectedRange.start && selectedRange.end
      ? `${format(selectedRange.start, "yyyy-MM-dd")}_${format(selectedRange.end, "yyyy-MM-dd")}`
      : selectedRange.start
        ? format(selectedRange.start, "yyyy-MM-dd")
        : null;

  const rangeNote = rangeKey ? notes[rangeKey] || "" : "";
  const [rangeNoteDraft, setRangeNoteDraft] = useState("");
  const [rangeSaveMessage, setRangeSaveMessage] = useState("");

  useEffect(() => {
    setRangeNoteDraft(rangeNote);
    setRangeSaveMessage("");
  }, [rangeKey]);

  useEffect(() => {
    if (!rangeSaveMessage) return undefined;
    const timeoutId = setTimeout(() => {
      setRangeSaveMessage("");
    }, 1800);
    return () => clearTimeout(timeoutId);
  }, [rangeSaveMessage]);

  const hasRangeChanges = rangeKey && rangeNoteDraft.trim().length > 0;

  const monthEvents = getEventsForMonth(events, currentDate);

  return (
    <aside className={`notes-panel ${isOpen ? "open" : ""}`} id="notes-panel">
      <div className="notes-header">
        <h3>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Notes & Events
        </h3>
        {isOpen && (
          <button
            className="modal-close"
            onClick={onClose}
            style={{ width: 28, height: 28, fontSize: 14 }}
          >
            ✕
          </button>
        )}
      </div>

      <div className="notes-content">
        {/* Monthly Notes */}
        <div>
          <div className="notes-section-label">Monthly Memo</div>
          <textarea
            className="notes-area"
            placeholder={`Notes for ${format(currentDate, "MMMM yyyy")}...`}
            value={monthNote}
            onChange={(e) => onUpdateNote(monthKey, e.target.value)}
            id="month-notes"
          />
        </div>

        {/* Range / Date Notes */}
        {rangeKey && (
          <div>
            <div className="notes-section-label">
              {selectedRange.end &&
              !isSameDay(selectedRange.start, selectedRange.end)
                ? "Range Notes"
                : "Day Notes"}
            </div>
            <textarea
              className="notes-area"
              placeholder="Add notes for this selection..."
              value={rangeNoteDraft}
              onChange={(e) => setRangeNoteDraft(e.target.value)}
              id="range-notes"
            />
            <div className="range-note-actions">
              <button
                className="btn-primary range-note-save-btn"
                onClick={() => {
                  onUpdateNote(rangeKey, rangeNoteDraft);
                  setRangeSaveMessage("Saved");
                  setRangeNoteDraft("");
                  onClearRange();
                }}
                disabled={!hasRangeChanges}
              >
                Save
              </button>
              <button
                className="btn-secondary range-note-delete-btn"
                onClick={() => {
                  setRangeNoteDraft("");
                  onUpdateNote(rangeKey, "");
                }}
                disabled={!rangeNote && !rangeNoteDraft}
              >
                Delete
              </button>
            </div>
            {rangeSaveMessage && (
              <div className="range-note-saved-message">{rangeSaveMessage}</div>
            )}
          </div>
        )}

        {/* Notes instruction + Upcoming placeholder (swapped order when fully empty) */}
        {!selectedRange.start && monthEvents.length === 0 && (
          <div>
            <div className="empty-state" style={{ padding: "10px 0 14px" }}>
              <div className="empty-state-icon">✨</div>
              <div className="empty-state-text">
                Select dates on the calendar to add notes, or click + to create
                events.
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                margin: "6px 0 14px",
              }}
            />
          </div>
        )}

        {/* This month's events overview */}
        <div>
          <div className="notes-section-label">
            Upcoming Events {monthEvents.length > 0 ? `(${monthEvents.length})` : ""}
          </div>
          {monthEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: "10px 0 4px" }}>
              <div className="empty-state-text">No upcoming events</div>
            </div>
          ) : (
            <div className="events-list">
              {monthEvents.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="event-item"
                  style={{ borderLeftColor: event.color || "#7c5cfc" }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="event-item-title">{event.title}</div>
                  <div className="event-item-time">
                    📅 {event.date} · {event.startTime || "All day"}
                  </div>
                </div>
              ))}
              {monthEvents.length > 8 && (
                <div className="empty-state-text" style={{ padding: "8px 0" }}>
                  +{monthEvents.length - 8} more events
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
