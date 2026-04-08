import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Notebook, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Calendar.css';

/* ─── Types ──────────────────────────────────────────────────────────── */

interface CalendarProps {
  initialDate?: Date;
}

interface Selection {
  start: Date | null;
  end: Date | null;
}

interface MonthTheme {
  accent: string;
  image: string;
}

/* ─── Month Themes ───────────────────────────────────────────────────── */
/* Mix of local generated images + reliable Unsplash URLs */

const MONTH_THEMES: Record<number, MonthTheme> = {
  0: {
    accent: '#1976D2',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1200&q=80',
  },
  1: {
    accent: '#D81B60',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  2: {
    accent: '#43A047',
    image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=1200&q=80',
  },
  3: {
    accent: '#F06292',
    image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1200&q=80',
  },
  4: {
    accent: '#2E7D32',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80',
  },
  5: {
    accent: '#00897B',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  6: {
    accent: '#558B2F',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80',
  },
  7: {
    accent: '#FB8C00',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
  },
  8: {
    accent: '#6D4C41',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1200&q=80',
  },
  9: {
    accent: '#C62828',
    image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=1200&q=80',
  },
  10: {
    accent: '#546E7A',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  },
  11: {
    accent: '#3949AB',
    image: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&w=1200&q=80',
  },
};

/* ─── Holidays ───────────────────────────────────────────────────────── */

const HOLIDAYS: Record<string, string> = {
  '01-01': "New Year's Day",
  '01-26': 'Republic Day',
  '02-14': "Valentine's Day",
  '03-08': "International Women's Day",
  '04-14': 'Dr. Ambedkar Jayanti',
  '05-01': 'Labour Day',
  '06-21': 'World Yoga Day',
  '07-04': 'Independence Day (US)',
  '08-15': 'Independence Day (IN)',
  '09-05': "Teachers' Day",
  '10-02': 'Gandhi Jayanti',
  '10-31': 'Halloween',
  '11-26': 'Thanksgiving',
  '12-25': 'Christmas Day',
};

const getHoliday = (day: Date): string | null => {
  const key = format(day, 'MM-dd');
  return HOLIDAYS[key] ?? null;
};

/* ─── Flip Animation Variants ─────────────────────────────────────── */

const flipVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? -110 : 110,
    opacity: 0,
    y: dir > 0 ? 120 : -120,
    scale: 0.92,
    z: -300,
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    y: 0,
    scale: 1,
    z: 0,
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? 110 : -110,
    opacity: 0,
    y: dir > 0 ? -120 : 120,
    scale: 0.92,
    z: -300,
  }),
};

/* ─── Calendar Component ─────────────────────────────────────────────── */

const Calendar: React.FC<CalendarProps> = ({ initialDate = new Date() }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selection, setSelection] = useState<Selection>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(0);

  const theme = useMemo(() => MONTH_THEMES[currentDate.getMonth()], [currentDate]);

  // localStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem('calendar_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        /* ignore corrupt data */
      }
    }
  }, []);

  const saveNotes = useCallback(
    (updated: Record<string, string>) => {
      setNotes(updated);
      localStorage.setItem('calendar_notes', JSON.stringify(updated));
    },
    []
  );

  const goNext = () => {
    setDirection(1);
    setCurrentDate((d) => addMonths(d, 1));
  };
  const goPrev = () => {
    setDirection(-1);
    setCurrentDate((d) => subMonths(d, 1));
  };

  const handleDateClick = (day: Date) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: day, end: null });
    } else {
      setSelection(
        day < selection.start
          ? { start: day, end: selection.start }
          : { ...selection, end: day }
      );
    }
  };

  const getDayClasses = (day: Date): string => {
    const c: string[] = ['cal-day'];
    if (!isSameMonth(day, currentDate)) c.push('muted');
    const dow = day.getDay();
    if (dow === 0 || dow === 6) c.push('weekend');
    if (isToday(day)) c.push('today');

    if (selection.start && isSameDay(day, selection.start)) c.push('selected', 'range-start');
    if (selection.end && isSameDay(day, selection.end)) c.push('selected', 'range-end');

    const inRange =
      selection.start &&
      selection.end &&
      isWithinInterval(day, { start: selection.start, end: selection.end });
    const inHover =
      selection.start &&
      !selection.end &&
      hoverDate &&
      isWithinInterval(day, {
        start: selection.start < hoverDate ? selection.start : hoverDate,
        end: selection.start < hoverDate ? hoverDate : selection.start,
      });
    if (inRange || inHover) c.push('in-range');
    if (getHoliday(day)) c.push('holiday');
    return c.join(' ');
  };

  const days = useMemo(() => {
    const s = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const e = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: s, end: e });
  }, [currentDate]);

  const noteKey = useMemo(() => {
    if (selection.start && selection.end)
      return `r_${format(selection.start, 'yyyy-MM-dd')}_${format(selection.end, 'yyyy-MM-dd')}`;
    if (selection.start) return `d_${format(selection.start, 'yyyy-MM-dd')}`;
    return `m_${format(currentDate, 'yyyy-MM')}`;
  }, [selection, currentDate]);

  const noteLabel = useMemo(() => {
    if (selection.start && selection.end)
      return `${format(selection.start, 'MMM d')} – ${format(selection.end, 'MMM d')}`;
    if (selection.start) return format(selection.start, 'MMMM d');
    return 'Notes';
  }, [selection]);

  const hoveredHoliday = useMemo(
    () => (hoverDate ? getHoliday(hoverDate) : null),
    [hoverDate]
  );

  /* ─── Render ──────────────────────────────────────────────────────── */

  return (
    <div className="wall">
      {/* SVG Hook / Nail */}
      <div className="hook-container">
        <svg viewBox="0 0 40 55" fill="none" className="hook-svg">
          <circle cx="20" cy="6" r="5" fill="#b0b0b0" stroke="#999" strokeWidth="1" />
          <circle cx="20" cy="6" r="3" fill="#ccc" />
          <line x1="20" y1="11" x2="20" y2="24" stroke="#999" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 24 Q20 42 12 44 Q4 46 4 38 Q4 34 8 34" stroke="#888" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Calendar Card */}
      <div className="calendar-card">
        {/* Spiral Wire Binding */}
        <div className="spiral-bar">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="spiral-loop" />
          ))}
        </div>

        {/* Animated Page Content */}
        <div className="page-perspective">
          {/* Physical "Stacked Paper" backing layers */}
          <div className="page-stack page-stack-bottom" />
          <div className="page-stack page-stack-middle" />
          <div className="page-stack page-stack-top" />
          
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={format(currentDate, 'yyyy-MM')}
              className="page"
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 1.2 }}
              style={{ '--accent': theme.accent } as React.CSSProperties}
            >
              {/* ── Hero Image ─────────────────────────────────── */}
              <div className="hero">
                <img
                  src={theme.image}
                  alt={format(currentDate, 'MMMM yyyy')}
                  className="hero-img"
                />
                {/* Jagged Chevron overlay - perfectly matched to reference shape */}
                <svg className="hero-wave" viewBox="0 0 600 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`chevronGrad-${currentDate.getMonth()}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 160 L0 80 L180 120 L300 70 L480 120 L600 80 L600 160 Z"
                    fill={`url(#chevronGrad-${currentDate.getMonth()})`}
                  />
                </svg>
                <div className="hero-text">
                  <span className="hero-year">{format(currentDate, 'yyyy')}</span>
                  <h2 className="hero-month">{format(currentDate, 'MMMM').toUpperCase()}</h2>
                </div>

                {/* Nav Arrows */}
                <button className="arrow arrow-left" onClick={goPrev} aria-label="Previous">
                  <ChevronLeft size={20} />
                </button>
                <button className="arrow arrow-right" onClick={goNext} aria-label="Next">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* ── Body: Notes + Grid ─────────────────────────── */}
              <div className="body">
                {/* Notes Section */}
                <aside className="notes-panel">
                  <div className="notes-title">
                    <span>{noteLabel}</span>
                    <Notebook size={14} />
                  </div>
                  <textarea
                    className="notes-area"
                    placeholder="Write your notes here..."
                    value={notes[noteKey] ?? ''}
                    onChange={(e) => saveNotes({ ...notes, [noteKey]: e.target.value })}
                  />
                  {hoveredHoliday && (
                    <motion.div
                      className="holiday-badge"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Info size={12} />
                      <span>{hoveredHoliday}</span>
                    </motion.div>
                  )}
                </aside>

                {/* Calendar Grid */}
                <main className="grid-panel">
                  <div className="weekday-row">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                      <div
                        key={d}
                        className={`weekday-cell ${d === 'SAT' || d === 'SUN' ? 'accent' : ''}`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="day-grid">
                    {days.map((day, i) => (
                      <div
                        key={i}
                        className={getDayClasses(day)}
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={() => setHoverDate(day)}
                        onMouseLeave={() => setHoverDate(null)}
                        title={getHoliday(day) ?? undefined}
                      >
                        <span className="day-text">{format(day, 'd')}</span>
                        {getHoliday(day) && <span className="holiday-dot" />}
                      </div>
                    ))}
                  </div>
                </main>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="cal-credit">
        Interactive Wall Calendar Concept • Built with React + Vite
      </footer>
    </div>
  );
};

export default Calendar;
