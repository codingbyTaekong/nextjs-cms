import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styles from '../../styles/public/gnb.module.css'
import {StoreState} from '../../redux'
import Image from 'next/image';
import test from "../../assets/profile/im.jpeg";
import styled from 'styled-components';

interface Props {
  // onClickNewReviewHandler : ()=> void
  visibleNewReviewButton ?: boolean
}


function GNB({visibleNewReviewButton} : Props) {
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
            
            {!logined  && 
            <li className={styles.loginButton}>
              <Link title='로그인' href="/signin">로그인</Link>
            </li>
            }
            {
              logined && 
              <>
                {/* {visibleNewReviewButton !== false && <NewReviewButton> */}
                {<NewReviewButton>
                  <button >
                    <Link href="/new-review">
                      리뷰 작성
                    </Link>
                  </button>
                </NewReviewButton>}
                <li>
                  <ProfileImg >
                    <Image src={test} objectFit="cover" />
                  </ProfileImg>
                </li>
              </>
            }
        </ul>
      </nav>
    </header>
  );
}

export default GNB;

const ProfileImg = styled.span`
  width: 45px;
  height: 45px;
  overflow: hidden;
  border-radius: 50%;
`

const NewReviewButton = styled.li`
  margin-left: auto;
  & > button {
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.1);
    background-color: unset;
  }
`