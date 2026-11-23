import { useEffect, useState } from 'react';
import styles from './Taskbar.module.css';

const TIME_FORMAT: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

/** Visitor's local time in their locale format, updated on the minute. Hover shows the full date. */
export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    const timer = window.setTimeout(() => setNow(new Date()), msToNextMinute + 50);
    return () => window.clearTimeout(timer);
  }, [now]);

  const fullDate = now.toLocaleDateString(undefined, DATE_FORMAT);
  return (
    <div className={styles.tray}>
      <time dateTime={now.toISOString()} title={fullDate} aria-label={`${now.toLocaleTimeString(undefined, TIME_FORMAT)}, ${fullDate}`}>
        {now.toLocaleTimeString(undefined, TIME_FORMAT)}
      </time>
    </div>
  );
}
