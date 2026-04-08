"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  isSameMonth,
  isSameDay,
  isToday,
  getCalendarDays,
  getWeekDays,
  isInRange,
  isRangeStart,
  isRangeEnd,
  getEventsForDate,
  getHolidays,
  timeToDecimal,
  WEEKDAYS,
  MONTH_IMAGES,
  MONTH_QUOTES,
  TIME_SLOTS,
  startOfWeek,
} from "@/utils/calendarHelpers";

const WEEKDAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* ========== SHARED HEADER ========== */
function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onGoToToday,
  view,
  onViewChange,
  notesOpen,
  onOpenNotes,
  isDarkMode,
  onToggleTheme,
}) {
  // Dynamic title based on view
  let titleText;
  if (view === "Day") {
    titleText = format(currentDate, "EEEE, MMMM d");
  } else if (view === "Week") {
    const weekStart = startOfWeek(currentDate);
    const weekDays = getWeekDays(currentDate);
    const weekEnd = weekDays[6];
    const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
    titleText = sameMonth
      ? `${format(weekStart, "MMMM d")} – ${format(weekEnd, "d")}`
      : `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`;
  } else {
    titleText = format(currentDate, "MMMM");
  }
  const mobileDateLabel = format(currentDate, "MMMM yyyy");

  return (
    <div className="calendar-header">
      <div className="calendar-title-area">
        <div className="calendar-mobile-top-row">
          <h1 className="calendar-mobile-brand">PlanDates</h1>
          <div className="header-actions header-actions-mobile">
            <button
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀" : "☾"}
            </button>
            <button
              className="nav-btn"
              onClick={onPrev}
              id="nav-prev-mobile"
              aria-label={`Previous ${view.toLowerCase()}`}
            >
              ‹
            </button>
            <button
              className="nav-btn"
              onClick={onNext}
              id="nav-next-mobile"
              aria-label={`Next ${view.toLowerCase()}`}
            >
              ›
            </button>
          </div>
        </div>
        <div className="calendar-mobile-month-row">{mobileDateLabel}</div>
        <h1 className="calendar-month-title">{titleText}</h1>
        <span className="calendar-year">{format(currentDate, "yyyy")}</span>
      </div>

      <div className="view-toggles">
        {["Month", "Week", "Day"].map((v) => (
          <button
            key={v}
            className={`view-btn ${view === v ? "active" : ""}`}
            onClick={() => onViewChange(v)}
            id={`view-${v.toLowerCase()}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="header-actions">
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "☀" : "☾"}        
        </button>
        <button
          className="nav-btn"
          onClick={onPrev}
          id="nav-prev"
          aria-label={`Previous ${view.toLowerCase()}`}
        >
          ‹
        </button>
        <button
          className="nav-btn"
          onClick={onNext}
          id="nav-next"
          aria-label={`Next ${view.toLowerCase()}`}
        >
          ›
        </button>
        <button className="today-btn" onClick={onGoToToday} id="nav-today">
          Today
        </button>
        {!notesOpen && (
          <button
            className="theme-toggle-btn"
            onClick={onOpenNotes}
            aria-label="Open notes panel"
            id="nav-notes"
            title="Open Notes"
          >
            ✎
          </button>
        )}
      </div>
    </div>
  );
}

/* ========== HERO SECTION ========== */
function HeroSection({ currentDate, direction }) {
  const monthIndex = currentDate.getMonth();
  const imgSrc = MONTH_IMAGES[monthIndex];
  const quote = MONTH_QUOTES[monthIndex];

  return (
    <div className="hero-section">
      <AnimatePresence mode="sync">
        <motion.img
          key={format(currentDate, "yyyy-MM")}
          src={imgSrc}
          alt={`${format(currentDate, "MMMM")} scenery`}
          className="hero-image"
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      <div className="hero-overlay">
        <motion.p
          key={quote}
          className="hero-quote"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          "{quote}"
        </motion.p>
      </div>
      <div className="hero-month-badge">
        {format(currentDate, "MMMM yyyy")}
      </div>
    </div>
  );
}

/* ========== MONTH VIEW — Calendar Day ========== */
function CalendarDay({
  day,
  currentDate,
  selectedRange,
  events,
  holidays,
  onDateClick,
  onAddEvent,
  onEventClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  index,
}) {
  const inCurrentMonth = isSameMonth(day, currentDate);
  const dateStr = format(day, "yyyy-MM-dd");
  const dayEvents = getEventsForDate(events, day);
  const holiday = holidays[dateStr];
  const hasEvents = dayEvents.length > 0;
  const dayOfWeek = day.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isTodayDate = isToday(day);

  const classes = [
    "calendar-day",
    !inCurrentMonth && "other-month",
    isTodayDate && "today",
    isWeekend && inCurrentMonth && "weekend",
    isInRange(day, selectedRange.start, selectedRange.end) && "in-range",
    isRangeStart(day, selectedRange.start, selectedRange.end) && "range-start",
    isRangeEnd(day, selectedRange.start, selectedRange.end) && "range-end",
    hasEvents && "has-events",
  ]
    .filter(Boolean)
    .join(" ");

  const row = Math.floor(index / 7);
  const col = index % 7;
  const staggerDelay = row * 0.03 + col * 0.02;
  const dateData = format(day, "yyyy-MM-dd");

  const handleTouchMove = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    const hoveredElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetCell = hoveredElement?.closest?.("[data-date]");
    const targetDate = targetCell?.dataset?.date;
    if (targetDate) {
      onDragMove(new Date(`${targetDate}T00:00:00`));
    }
  };

  return (
    <motion.div
      className={classes}
      data-date={dateData}
      onClick={(e) => {
        // If date has events, open event details. Otherwise allow range selection.
        e.stopPropagation();
        if (dayEvents.length > 0) {
          onEventClick(dayEvents[0]);
          return;
        }
        onDateClick(day);
      }}
      onMouseDown={(e) => {
        // Only start dragging on left mouse button
        if (e.button === 0) {
          e.preventDefault();
          onDragStart(day);
        }
      }}
      onMouseOver={(e) => {
        // Only trigger drag move if mouse is down (dragging)
        if (e.buttons === 1) {
          onDragMove(day);
        }
      }}
      onMouseUp={onDragEnd}
      onTouchStart={() => onDragStart(day)}
      onTouchMove={handleTouchMove}
      onTouchEnd={onDragEnd}
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: staggerDelay,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
    >
      {isTodayDate && <div className="today-glow-ring" />}
      <div className="day-number-wrap">
        {isTodayDate ? (
          <span className="day-number-today">
            {format(day, "d")}
            <span className="today-pulse" />
          </span>
        ) : (
          <span className="day-number">{format(day, "d")}</span>
        )}
        {isWeekend && inCurrentMonth && !isTodayDate && (
          <span className="weekend-dot" />
        )}
      </div>

      {holiday && (
        <div className="holiday-badge">
          <span className="holiday-icon">✦</span>
          <span className="holiday-text">{holiday}</span>
        </div>
      )}

      <div className="day-events">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className="day-event-chip"
            style={{
              "--chip-color": event.color || "var(--accent-primary)",
              "--chip-bg": event.bgColor || "var(--accent-tag-bg)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            <span className="event-chip-dot" />
            <span className="event-chip-text">{event.title}</span>
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="day-more-events">+{dayEvents.length - 2} more</div>
        )}
      </div>

      <button
        className="day-add-btn"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onAddEvent(day);
        }}
        aria-label="Add event"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v10M1 6h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}

/* ========== MONTH VIEW ========== */
function MonthView({
  currentDate,
  selectedRange,
  events,
  onDateClick,
  onAddEvent,
  onEventClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  direction,
}) {
  const calendarDays = getCalendarDays(currentDate);
  const year = currentDate.getFullYear();
  const holidays = getHolidays(year);
  const today = new Date();
  const showTodayWeekday = isSameMonth(today, currentDate);
  const todayWeekdayIndex = today.getDay();

  return (
    <>
      <div className="weekday-headers">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`weekday-header ${i === 0 || i === 6 ? "weekend-header" : ""} ${
              showTodayWeekday && i === todayWeekdayIndex ? "today-weekday" : ""
            }`}
          >
            <span className="weekday-short">{day}</span>
            <span className="weekday-full">{WEEKDAY_FULL[i]}</span>
          </div>
        ))}
      </div>

      <div className="calendar-grid-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentDate, "yyyy-MM")}
            className="calendar-grid"
            onMouseLeave={onDragEnd}
            onMouseUp={onDragEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {calendarDays.map((day, i) => (
              <CalendarDay
                key={format(day, "yyyy-MM-dd")}
                day={day}
                currentDate={currentDate}
                selectedRange={selectedRange}
                events={events}
                holidays={holidays}
                onDateClick={onDateClick}
                onAddEvent={onAddEvent}
                onEventClick={onEventClick}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

/* ========== WEEK VIEW ========== */
function WeekView({
  currentDate,
  events,
  onAddEvent,
  onEventClick,
  onGoToDate,
}) {
  const weekDays = getWeekDays(currentDate);
  const holidays = getHolidays(currentDate.getFullYear());

  return (
    <div className="week-view-container">
      {/* Week day headers */}
      <div className="week-header-row">
        <div className="week-time-gutter-header" />
        {weekDays.map((day) => {
          const isTodayDate = isToday(day);
          const dateStr = format(day, "yyyy-MM-dd");
          const holiday = holidays[dateStr];
          return (
            <motion.div
              key={dateStr}
              className={`week-day-header ${isTodayDate ? "today" : ""}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: day.getDay() * 0.04 }}
              onClick={() => onGoToDate(day)}
            >
              <span className="week-day-name">{format(day, "EEE")}</span>
              <span
                className={`week-day-num ${isTodayDate ? "today-num" : ""}`}
              >
                {format(day, "d")}
              </span>
              {holiday && (
                <span className="week-day-holiday">{holiday}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="week-time-grid">
        {/* Time column */}
        <div className="week-time-gutter">
          {TIME_SLOTS.map((slot) => (
            <div key={slot.hour} className="week-time-label">
              {slot.shortLabel}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = getEventsForDate(events, day);
          const isTodayDate = isToday(day);

          return (
            <div
              key={dateStr}
              className={`week-day-column ${isTodayDate ? "today-column" : ""}`}
            >
              {/* Hour grid lines */}
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.hour}
                  className="week-hour-cell"
                  onClick={() => onAddEvent(day)}
                />
              ))}

              {/* Current time indicator */}
              {isTodayDate && <CurrentTimeIndicator />}

              {/* Events positioned on the grid */}
              {dayEvents.map((event) => {
                const startDecimal = timeToDecimal(event.startTime);
                const endDecimal = timeToDecimal(event.endTime);

                if (startDecimal === null) {
                  // All-day event — show at top
                  return (
                    <motion.div
                      key={event.id}
                      className="week-event-block all-day"
                      style={{
                        "--evt-color": event.color || "var(--accent-primary)",
                        "--evt-bg": event.bgColor || "var(--accent-tag-bg)",
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <span className="week-event-title">{event.title}</span>
                    </motion.div>
                  );
                }

                // Positioned event
                const topOffset = ((startDecimal - 6) / 17) * 100;
                const duration = endDecimal
                  ? ((endDecimal - startDecimal) / 17) * 100
                  : (1 / 17) * 100;

                return (
                  <motion.div
                    key={event.id}
                    className="week-event-block"
                    style={{
                      top: `${topOffset}%`,
                      height: `${Math.max(duration, (0.5 / 17) * 100)}%`,
                      "--evt-color": event.color || "var(--accent-primary)",
                      "--evt-bg": event.bgColor || "var(--accent-tag-bg)",
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                  >
                    <span className="week-event-time">
                      {event.startTime}
                      {event.endTime ? ` – ${event.endTime}` : ""}
                    </span>
                    <span className="week-event-title">{event.title}</span>
                    {event.location && (
                      <span className="week-event-location">
                        📍 {event.location}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========== DAY VIEW ========== */
function DayView({ currentDate, events, onAddEvent, onEventClick }) {
  const dayEvents = getEventsForDate(events, currentDate);
  const holidays = getHolidays(currentDate.getFullYear());
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const holiday = holidays[dateStr];
  const isTodayDate = isToday(currentDate);

  return (
    <div className="day-view-container">
      {/* Day info header */}
      <div className={`day-view-info ${isTodayDate ? "today" : ""}`}>
        <div className="day-view-date-big">
          <span className="day-view-weekday">
            {format(currentDate, "EEEE")}
          </span>
          <span
            className={`day-view-num ${isTodayDate ? "today-highlight" : ""}`}
          >
            {format(currentDate, "d")}
          </span>
          <span className="day-view-monthyear">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>
        {holiday && <div className="day-view-holiday">✦ {holiday}</div>}
        <div className="day-view-event-count">
          {dayEvents.length === 0
            ? "No events scheduled"
            : `${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Time grid */}
      <div className="day-time-grid">
        <div className="day-time-gutter">
          {TIME_SLOTS.map((slot) => (
            <div key={slot.hour} className="day-time-label">
              {slot.label}
            </div>
          ))}
        </div>

        <div className="day-events-column">
          {/* Hour cells */}
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.hour}
              className="day-hour-cell"
              onClick={() => onAddEvent(currentDate)}
            />
          ))}

          {/* Current time indicator */}
          {isTodayDate && <CurrentTimeIndicator />}

          {/* Events */}
          {dayEvents.map((event) => {
            const startDecimal = timeToDecimal(event.startTime);
            const endDecimal = timeToDecimal(event.endTime);

            if (startDecimal === null) {
              return (
                <motion.div
                  key={event.id}
                  className="day-event-block all-day"
                  style={{
                    "--evt-color": event.color || "var(--accent-primary)",
                    "--evt-bg": event.bgColor || "var(--accent-tag-bg)",
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="day-event-header">
                    <span className="day-event-dot" />
                    <span className="day-event-title">{event.title}</span>
                  </div>
                  <span className="day-event-meta">All day</span>
                </motion.div>
              );
            }

            const topOffset = ((startDecimal - 6) / 17) * 100;
            const duration = endDecimal
              ? ((endDecimal - startDecimal) / 17) * 100
              : (1 / 17) * 100;

            return (
              <motion.div
                key={event.id}
                className="day-event-block"
                style={{
                  top: `${topOffset}%`,
                  height: `${Math.max(duration, (0.5 / 17) * 100)}%`,
                  "--evt-color": event.color || "var(--accent-primary)",
                  "--evt-bg": event.bgColor || "var(--accent-tag-bg)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => onEventClick(event)}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
              >
                <div className="day-event-header">
                  <span className="day-event-dot" />
                  <span className="day-event-title">{event.title}</span>
                </div>
                <span className="day-event-meta">
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </span>
                {event.location && (
                  <span className="day-event-location">📍 {event.location}</span>
                )}
                {event.notes && (
                  <span className="day-event-notes">{event.notes}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========== CURRENT TIME INDICATOR ========== */
function CurrentTimeIndicator() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const decimal = hours + minutes / 60;

  if (decimal < 6 || decimal > 23) return null;

  const topPercent = ((decimal - 6) / 17) * 100;

  return (
    <div className="current-time-line" style={{ top: `${topPercent}%` }}>
      <div className="current-time-dot" />
      <div className="current-time-bar" />
    </div>
  );
}

/* ========== MAIN EXPORT ========== */
export default function CalendarGrid({
  currentDate,
  selectedRange,
  events,
  onDateClick,
  onAddEvent,
  onEventClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  onPrev,
  onNext,
  onGoToToday,
  onGoToDate,
  view,
  onViewChange,
  notesOpen,
  onOpenNotes,
  isDarkMode,
  onToggleTheme,
  direction,
}) {
  return (
    <div className="main-content">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={onPrev}
        onNext={onNext}
        onGoToToday={onGoToToday}
        view={view}
        onViewChange={onViewChange}
        notesOpen={notesOpen}
        onOpenNotes={onOpenNotes}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <HeroSection currentDate={currentDate} direction={direction} />

      <AnimatePresence mode="wait">
        {view === "Month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            style={{ display: "contents" }}
          >
            <MonthView
              currentDate={currentDate}
              selectedRange={selectedRange}
              events={events}
              onDateClick={onDateClick}
              onAddEvent={onAddEvent}
              onEventClick={onEventClick}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              direction={direction}
            />
          </motion.div>
        )}

        {view === "Week" && (
          <motion.div
            key="week"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <WeekView
              currentDate={currentDate}
              events={events}
              onAddEvent={onAddEvent}
              onEventClick={onEventClick}
              onGoToDate={onGoToDate}
            />
          </motion.div>
        )}

        {view === "Day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <DayView
              currentDate={currentDate}
              events={events}
              onAddEvent={onAddEvent}
              onEventClick={onEventClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
