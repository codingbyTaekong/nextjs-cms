import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styles from '../../styles/public/gnb.module.css'
import {StoreState} from '../../redux'
function GNB() {
  const {user_id, user_nickname, access_token} = useSelector((state : StoreState) => ({
    user_id : state.UserInfo.user_id,
    user_nickname : state.UserInfo.user_nickname,
    access_token : state.UserInfo.access_token
  }), shallowEqual)
  const [logined, setLogined] = useState(false) 

  useEffect(()=> {
    if (!logined) {
      if (user_id && user_nickname && access_token) {
        setLogined(true)
      }
    }
  }, [user_id, user_nickname, access_token, logined])
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
                {logined ? <span>로그아웃</span> :<Link title='로그인' href="/signin">로그인</Link>}
              </li>
        </ul>
      </nav>
    </header>
  );
}

export default GNB;