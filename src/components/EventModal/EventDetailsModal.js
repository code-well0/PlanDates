"use client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "@/utils/calendarHelpers";

export default function EventDetailsModal({
  isOpen,
  event,
  onClose,
  onEdit,
}) {
  if (!event) return null;

  const eventDate = event.date ? new Date(`${event.date}T00:00:00`) : null;
  const start = event.startTime || "All day";
  const end = event.endTime ? ` - ${event.endTime}` : "";

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
        >
          <motion.div
            className="event-details-modal"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="event-details-close" onClick={onClose} aria-label="Close">
              ✕
            </button>

            <div className="event-details-icon" style={{ color: event.color || "var(--accent-primary)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <h3 className="event-details-title">{event.title}</h3>
            <div className="event-details-category" style={{ color: event.color || "var(--accent-primary)" }}>
              {event.category || "General"}
            </div>

            <div className="event-details-list">
              <div className="event-details-row">
                <span className="event-details-label">Date</span>
                <span className="event-details-value">
                  {eventDate ? format(eventDate, "EEEE, MMMM d, yyyy") : "-"}
                </span>
              </div>
              <div className="event-details-row">
                <span className="event-details-label">Time</span>
                <span className="event-details-value">
                  {start}
                  {end}
                </span>
              </div>
              <div className="event-details-row">
                <span className="event-details-label">Location</span>
                <span className="event-details-value">{event.location || "Not specified"}</span>
              </div>
              <div className="event-details-row">
                <span className="event-details-label">Organizer</span>
                <span className="event-details-value">Jordan Diaz</span>
              </div>
              <div className="event-details-row">
                <span className="event-details-label">Notes</span>
                <span className="event-details-value">{event.notes || "No notes added."}</span>
              </div>
            </div>

            <div className="event-details-actions">
              <button className="btn-secondary" onClick={onEdit}>
                Edit Event
              </button>
              <button className="btn-primary" onClick={onClose}>
                View on Calendar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
