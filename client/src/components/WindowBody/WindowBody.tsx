import portrait from '../../assets/self-portrait-site-png.png';
import { UI } from '../../content/ui.ts';
import type { WindowId } from '../../wm/windowIds.ts';
import styles from './WindowBody.module.css';

export default function WindowBody({ id }: { id: WindowId }) {
  if (id === 'portrait') {
    return <img className={styles.portrait} src={portrait} width={320} height={320} alt={UI.portraitAlt} draggable={false} />;
  }
  return null;
}
