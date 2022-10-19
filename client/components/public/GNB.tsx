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
                  <Link title="로고" href="/">
                    로고
                  </Link>
                </h1>
            </li>
              <li className={styles.loginButton}>
                <Link title='로그인' href="/signin">로그인</Link>
              </li>
        </ul>
      </nav>
    </header>
  );
}

export default GNB;