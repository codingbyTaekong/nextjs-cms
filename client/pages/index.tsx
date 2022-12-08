import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/public/index.page.module.css'
import GNB from '../components/public/GNB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Rate } from 'antd';
import { GetServerSideProps } from 'next'
import axios from '../api/axios';
import GymCard from '../components/public/GymCard';
import {GymData} from '../types/type'
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import {setUserInfo, ActionSetUserInfo} from '../redux/UserInfo'
// import API from '../util/API'
interface Props {
    recent_gyms : Array<GymData>
}

interface ActiveGym {
    clicked : boolean,
    data : GymData
}

const Home : NextPage<Props> = ({recent_gyms}) => {
    console.log(recent_gyms)
    // 드래그 관련 state
    const dispatch = useDispatch();
    const SetUserInfo = ({user_id, user_nickname, rule, access_token} :ActionSetUserInfo) => dispatch(setUserInfo({user_id, user_nickname, rule, access_token}));
    
    const [isDrag, setIsDrag] = useState(false);
    const [startX, setStartX] = useState(0);
    const [movedX, setMovedX] = useState(0);
    const recentContainerRef = useRef<HTMLUListElement>(null);



    // 상세보기 관련 state
    const [isActiveGym, setIsActiveGym] = useState<ActiveGym | null>(null);
    /**
     * 카드 클릭 이벤트 핸들러
     * @param e 
     * @param gym  
     */
    const clickCardHandler = (e: React.MouseEvent<HTMLLIElement>, gym : GymData) => {
        e.preventDefault();
        setIsActiveGym({
            ...isActiveGym,
            clicked : true,
            data : gym
        })
    }
    
    /**
     * 카드 닫기 핸들러
     */
    const removeCardHandler = () => {
        setIsActiveGym(null)
    }

    /**
     * 드래그가 시작 했을 때 핸들러
     * @param e 
     */
    const mouseDonwScrollHandler = (e : React.MouseEvent<HTMLUListElement>) => {
        if (recentContainerRef.current && recentContainerRef.current.scrollWidth >= 1070) {
            e.preventDefault();
            setIsDrag(true);
            setStartX(e.pageX);
        }
    }
    /**
     * 드래그 중일 때 핸들러
     * @param e 
     */
    const mouseMoveScrollHandler = (e : React.MouseEvent<HTMLUListElement>) => {
        if (isDrag) {
            setMovedX(e.pageX - startX)
        }
    }
    /**
     * 드래그 취소 이벤트 핸들러
     * @param e 
     */
    const mouseUpScrollHandler = (e : React.MouseEvent<HTMLUListElement>) => {
        if (isDrag) {
            setStartX(0);
            setIsDrag(false);
        }
    }
    /**
     * 드래그 생애주기
     */
    useEffect(()=> {
        if (isDrag) {
            // console.log("실제로 움직인 좌표", movedX);
            if (recentContainerRef.current) {
                const sum = recentContainerRef.current.scrollLeft + movedX / 50 * -1
                // console.log("계산한 결과 : ",sum)
                recentContainerRef.current.scrollLeft = sum
            }
        }
    }, [isDrag, movedX])

    useEffect(()=> {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`).then(res=> {
            // 로그인 처리
            if (res.data.callback === 200) {
                const accessToken = res.data.token;
                const {id, nickname, rule} = res.data.user
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                SetUserInfo({
                    user_id : id,
                    user_nickname : nickname,
                    rule,
                    access_token : accessToken,
                })
            }
        })
    },[])


    // 리뷰작성 페이지
    // const [isActiveReviewPage, setIsActiveReviewPage] = useState(false);

    // const onClickNewReviewHandler = useCallback(()=> {
    //     setIsActiveReviewPage(!isActiveReviewPage);
    // }, [isActiveReviewPage])
    return (
        <>
            <Head>
                <title>투어리스트</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <GNB></GNB>
            <main className={styles.main}>
                <section className={styles.visualSectionContainer}>
                    <h1 className={styles.visualTitle}>Climber를 위한 공간.&nbsp;&nbsp;<b>클라이맥스</b></h1>
                    {/* <h1 className={styles.visualTitle}>Tourlist를 위한 공간.&nbsp;&nbsp;<b>가상전시관</b></h1> */}
                    <div className={styles.searchContainer}>
                        <input type="text" name="" placeholder='클라이밍장을 검색해보세요'/>
                        {/* <input type="text" name="" placeholder='전시관을 검색해보세요'/> */}
                        <button>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </section>
                <section className={styles.recentClimbGymListContainer}>
                    {/* <h1>최근 뜨고 있는 전시관</h1> */}
                    <h1>따끈따끈한 리뷰</h1>
                    <ul className={styles.recentClimbGymList} 
                        ref={recentContainerRef} 
                        onMouseDown={mouseDonwScrollHandler} 
                        onMouseMove={mouseMoveScrollHandler} 
                        onMouseUp={mouseUpScrollHandler}
                        onMouseLeave={mouseUpScrollHandler}>

                        {recent_gyms.map((gym, i) => {
                            // console.log(new Date(gym.reviews[0].created_at))
                            // const recent_date = new Date(gym.reviews[0].created_at).getTime();
                            // const now = new Date().getTime();
                            // console.log(now - recent_date);
                            // const elapsedMSec = now - recent_date
                            // // 초
                            // const elapsedSec = elapsedMSec / 1000;
                            // // 분
                            // const elapsedMin = elapsedMSec / 1000 / 60;
                            // // 시
                            // const elapsedHour = elapsedMSec / 1000 / 60 / 60;
                            // // 날짜
                            // const elapsedDay = elapsedMSec / 1000 / 60 / 60 / 24;
                            // console.log(
                            //     `
                            //         초 : ${elapsedSec}
                            //         분 : ${elapsedMin}
                            //         시 : ${elapsedHour}
                            //         일 : ${elapsedDay}
                            //     `
                            // )
                            return (
                                <li key={i} className={styles.recentCard} onClick={(e) => clickCardHandler(e, gym)}>
                                    <h1>{gym.gym_name}</h1>
                                    <p>{gym.gym_address}</p>
                                    <div className={styles.reviewContainer}>
                                        <h2>최근 후기</h2>
                                        <ul>
                                            {gym.reviews.map((review, j)=>{
                                                return <li key={j}>{review.review_text}</li>
                                            })}
                                        </ul>
                                        <div className={styles.rateContainer}>
                                            <Rate disabled defaultValue={Number(gym.average_rate)} />
                                            <p>
                                                <span className={styles.totalRate}>{gym.average_rate}&nbsp;</span>
                                                <span className={styles.maxRate}>/5</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                        {recent_gyms.length < 5 && <>
                            <li className={styles.emptysetCard}>
                                <h3>최근 올라온 리뷰가 없어요🥺</h3>
                                <div className={styles.circle}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span className={styles.pleaseReview}></span>
                            </li>
                        </>}
                    </ul>
                </section>
                {isActiveGym?.clicked && <GymCard gym={isActiveGym.data} onRemove={removeCardHandler} />}
            </main>
        </>

    )
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const recent_gyms = await (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gym/recent_reviews`)).data.context;
    return {
        props : {
            recent_gyms
        }
    }
}

export default Home
