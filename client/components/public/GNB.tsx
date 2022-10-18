import Link from 'next/link';
import React from 'react';
import styles from '../../styles/public/gnb.module.css'
function GNB() {
  return (
    <header>
      <nav className={styles.nav}>
        <ul>
            <li>
                <h1 className={styles.title}>
                  <Link href="/">
                    클라이맥스
                  </Link>
                </h1>
            </li>
              <li className={styles.loginButton}>
                <Link href="/signin">로그인</Link>
              </li>
        </ul>
      </nav>
    </header>
  );
}

export default GNB;