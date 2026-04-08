"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "@/utils/calendarHelpers";
import { EVENT_COLORS, CATEGORIES } from "@/utils/calendarHelpers";

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  editEvent,
}) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [bgColor, setBgColor] = useState(EVENT_COLORS[0].bg);
  const [category, setCategory] = useState("Personal");
  const titleRef = useRef(null);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || "");
      setStartTime(editEvent.startTime || "09:00");
      setEndTime(editEvent.endTime || "10:00");
      setLocation(editEvent.location || "");
      setNotes(editEvent.notes || "");
      setColor(editEvent.color || EVENT_COLORS[0].value);
      setBgColor(editEvent.bgColor || EVENT_COLORS[0].bg);
      setCategory(editEvent.category || "Personal");
    } else {
      setTitle("");
      setStartTime("09:00");
      setEndTime("10:00");
      setLocation("");
      setNotes("");
      setColor(EVENT_COLORS[0].value);
      setBgColor(EVENT_COLORS[0].bg);
      setCategory("Personal");
    }
  }, [editEvent, isOpen]);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleColorSelect = (c) => {
    setColor(c.value);
    setBgColor(c.bg);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      location: location.trim(),
      notes: notes.trim(),
      color,
      bgColor,
      category,
    });
    onClose();
  };

  const handleDelete = () => {
    if (editEvent) {
      onDelete(editEvent.id);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && e.metaKey) handleSubmit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <h2>{editEvent ? "Edit Event" : "New Event"}</h2>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Date display */}
              <div className="modal-date-display">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  ref={titleRef}
                  type="text"
                  className="form-input"
                  placeholder="Meet with Jonson Rider"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="event-title"
                />
              </div>

              {/* Time */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    id="event-start-time"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    id="event-end-time"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Park Lane Office"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  id="event-location"
                />
              </div>

              {/* Color */}
              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-picker">
                  {EVENT_COLORS.map((c) => (
                    <div
                      key={c.value}
                      className={`color-option ${color === c.value ? "selected" : ""}`}
                      style={{ background: c.value }}
                      onClick={() => handleColorSelect(c)}
                      title={c.name}
                    >
                      {color === c.value && (
                        <span className="color-option-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-tags">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      className={`category-tag ${category === cat.name ? "selected" : ""}`}
                      style={
                        category === cat.name
                          ? { background: cat.color, borderColor: cat.color }
                          : {}
                      }
                      onClick={() => setCategory(cat.name)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  placeholder="Add notes about this event..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  id="event-notes"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              {editEvent && (
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  id="event-delete"
                >
                  Delete
                </button>
              )}
              <button
                className="btn-secondary"
                onClick={onClose}
                id="event-cancel"
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                id="event-save"
              >
                {editEvent ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
