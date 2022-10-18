import React from 'react';
import styles from '../../styles/public/gnb.module.css'
function GNB() {
  return (
    <header>
      <nav className={styles.nav}>
        <ul>
            <li>
                <h1 className={styles.title}>로고</h1>
            </li>
        </ul>
      </nav>
    </header>
  );
}

export default GNB;