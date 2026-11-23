// PLACEHOLDER: certification, project and credits content come from placeholder data files.
import portrait from '../../assets/self-portrait-site-png.png';
import { ABOUT } from '../../content/about.ts';
import { CREDITS } from '../../content/credits.ts';
import { EXPERIENCE, type Role } from '../../content/experience.ts';
import { PLACEHOLDER_WINDOWS } from '../../content/placeholderWindows.ts';
import { UI } from '../../content/ui.ts';
import type { WindowId } from '../../wm/windowIds.ts';
import styles from './WindowBody.module.css';

export default function WindowBody({ id }: { id: WindowId }) {
  switch (id) {
    case 'portrait':
      return <img className={styles.portrait} src={portrait} width={320} height={320} alt={UI.portraitAlt} draggable={false} />;
    case 'experience':
      return <Experience />;
    case 'about':
      return <About />;
    case 'credits':
      return <Credits />;
    default:
      return <Placeholder text={PLACEHOLDER_WINDOWS[id] ?? ''} />;
  }
}

function RoleBlock({ role }: { role: Role }) {
  return (
    <>
      <h3 className={styles.role}>{role.title}</h3>
      <p className={styles.dates}>{role.dates}</p>
      <p className={styles.meta}>{role.location}</p>
      {role.paragraphs.length > 1 ? (
        <ul>
          {role.paragraphs.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        role.paragraphs.map((p) => <p key={p}>{p}</p>)
      )}
      {role.skills && <p className={styles.meta}>{role.skills}</p>}
    </>
  );
}

function Experience() {
  return (
    <div className={styles.text}>
      {EXPERIENCE.intro.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {EXPERIENCE.jobs.map((job) => (
        <section key={job.company}>
          <h2 className={styles.company}>{job.company}</h2>
          {job.details.map((d) => (
            <p key={d} className={styles.meta}>
              {d}
            </p>
          ))}
          {job.roles.map((role) => (
            <RoleBlock key={role.title} role={role} />
          ))}
        </section>
      ))}
      <section>
        <h2 className={styles.company}>{EXPERIENCE.educationHeading}</h2>
        {EXPERIENCE.education.map((school) => (
          <div key={school.name}>
            <h3 className={styles.role}>{school.name}</h3>
            <p className={styles.dates}>{school.degree}</p>
            {school.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {school.skills && <p className={styles.meta}>{school.skills}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}

function About() {
  return (
    <div className={styles.text}>
      <h2 className={styles.name}>{ABOUT.name}</h2>
      <p>{ABOUT.role}</p>
      <p>{ABOUT.skills}</p>
      <p>{ABOUT.summary}</p>
    </div>
  );
}

function Credits() {
  return (
    <div className={styles.text}>
      <span className={styles.tag}>{UI.placeholder}</span>
      <dl className={styles.credits}>
        {CREDITS.map((c) => (
          <div key={c.label}>
            <dt>{c.label}</dt>
            <dd>{c.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className={styles.text}>
      <div className={styles.phBox}>
        <span className={styles.tag}>{UI.placeholder}</span>
        <p>{text}</p>
      </div>
    </div>
  );
}
