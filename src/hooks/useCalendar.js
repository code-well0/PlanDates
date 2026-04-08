"use client";
import { useState, useEffect, useCallback } from "react";
import {
  loadEvents,
  saveEvents,
  loadNotes,
  saveNotes,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "@/utils/calendarHelpers";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState({});
  const [mounted, setMounted] = useState(false);
  const [dragStartDate, setDragStartDate] = useState(null);

  useEffect(() => {
    setEvents(loadEvents());
    setNotes(loadNotes());
    setMounted(true);
  }, []);

  // Month navigation
  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  // Week navigation
  const nextWeek = useCallback(() => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  }, []);

  const prevWeek = useCallback(() => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  }, []);

  // Day navigation
  const nextDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, 1));
  }, []);

  const prevDay = useCallback(() => {
    setCurrentDate((prev) => subDays(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Drag selection handlers
  const handleDragStart = useCallback((date) => {
    setSelectedRange({ start: date, end: null });
    setIsSelectingRange(true);
    setDragStartDate(date);
  }, []);

  const handleDragMove = useCallback((date) => {
    if (isSelectingRange && dragStartDate) {
      setSelectedRange({ start: dragStartDate, end: date });
    }
  }, [isSelectingRange, dragStartDate]);

  const handleDragEnd = useCallback(() => {
    setIsSelectingRange(false);
    setDragStartDate(null);
  }, []);

  const handleDateClick = useCallback(
    (date) => {
      if (!isSelectingRange) {
        setSelectedRange({ start: date, end: null });
        setIsSelectingRange(true);
      } else {
        setSelectedRange((prev) => ({ ...prev, end: date }));
        setIsSelectingRange(false);
      }
    },
    [isSelectingRange]
  );

  const clearRange = useCallback(() => {
    setSelectedRange({ start: null, end: null });
    setIsSelectingRange(false);
  }, []);

  const addEvent = useCallback(
    (event) => {
      const updated = [...events, { ...event, id: Date.now().toString() }];
      setEvents(updated);
      saveEvents(updated);
    },
    [events]
  );

  const updateEvent = useCallback(
    (id, updatedEvent) => {
      const updated = events.map((e) =>
        e.id === id ? { ...e, ...updatedEvent } : e
      );
      setEvents(updated);
      saveEvents(updated);
    },
    [events]
  );

  const deleteEvent = useCallback(
    (id) => {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      saveEvents(updated);
    },
    [events]
  );

  const updateNote = useCallback(
    (key, text) => {
      const updated = { ...notes, [key]: text };
      if (!text) delete updated[key];
      setNotes(updated);
      saveNotes(updated);
    },
    [notes]
  );

   return {
     currentDate,
     setCurrentDate,
     selectedRange,
     isSelectingRange,
     events,
     notes,
     mounted,
     nextMonth,
     prevMonth,
     nextWeek,
     prevWeek,
     nextDay,
     prevDay,
     goToToday,
     handleDateClick,
     clearRange,
     addEvent,
     updateEvent,
     deleteEvent,
     updateNote,
     handleDragStart,
     handleDragMove,
     handleDragEnd,
   };
}
