import type { Run } from '../../types/run';
import RunItem from '../RunItem/RunItem';

import styles from './RunsList.module.css';

interface RunsListProps {
  runs: Run[];
  onRunOpen: (run: Run) => void;
}

function RunsList({ runs, onRunOpen }: RunsListProps) {
  return (
    <section className={styles.container} aria-label="Runs list">
      <div className={styles.header} aria-hidden="true">
        <span>RUN</span>
        <span>BRANCH</span>
        <span>STATUS</span>
        <span>DURATION</span>
        <span>CREATED</span>
        <span />
      </div>

      <ul className={styles.list}>
        {runs.map((run) => (
          <RunItem key={run.id} run={run} onOpen={onRunOpen} />
        ))}
      </ul>
    </section>
  );
}

export default RunsList;
