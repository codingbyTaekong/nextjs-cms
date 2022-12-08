import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Head from 'next/head'
import type { NextPage } from 'next'
import GNB from '../components/public/GNB';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { verify_token } from '../util/verify_token';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { StoreState } from '../redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faCheck, faXmark } from '@fortawesome/pro-solid-svg-icons';
import ReviewForm from '../components/public/ReviewForm';
import { KakaoMapData } from '../types/type';
import axios from '../api/axios';
import Alert from '../components/alert/Alert';
declare global {
    interface window {
        kakao: any;
        daum: any;
    }
}
// http://place.map.kakao.com/

interface alertProps {
    text : string
    type : "error" | "warning" | "success" | null
    actived : boolean
}

const NewReview: NextPage = () => {
    // 카카오 지도 검색 관련
    const kakaoMap = useRef<any>(null);
    const ps = useRef<any>(null);
    const infowindow = useRef<any>(null);
    const [activeSearch, setActiveSearch] = useState(false);
    const [searchedValue, setSearchedValue] = useState('');
    const [searchResult, setSearchResult] = useState<Array<KakaoMapData>>([]);
    const [clickedGym, setClickedGym] = useState<KakaoMapData | null>(null);
    const [markers, setMarkers] = useState<Array<any>>([]);


    const [isActiveConfirm, setIsActiveConfirm] = useState(false);

    const [isActiveReviewForm, setIsActiveReviewForm] = useState(false);

    const router = useRouter();
    const { access_token } = useSelector((state: StoreState) => ({
        access_token: state.UserInfo.access_token
    }
    ))

    // 얼럿 창 관리
    const [alertStat, setAlertStat] = useState<alertProps>({
        actived : false,
        text : '',
        type : null
    })


    const resetAlertHandler = () => {
        setAlertStat({
          actived : false,
          text : '',
          type : null
        })
    }

    /** 최초 진입 생애주기 */
    useEffect(() => {
        if (access_token) {
            verify_token(router, access_token);
        }
        // const container = mapContainer;
        const container = document.getElementById('map');
        const options = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 8,
        }
        const map = new window.kakao.maps.Map(container, options);
        // map.setZoomable(false)
        infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        kakaoMap.current = map;
        ps.current = new window.kakao.maps.services.Places()
    }, [])

    /** 인풋 체인지 핸들러 */
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedValue(e.target.value);
    }

    /** 마커 생성 함수 */
    const displayMarker = (place: KakaoMapData) => {

        // 마커를 생성하고 지도에 표시합니다
        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x)
        });
        return marker
        // setMarkers([...markers, marker])
        // 마커에 클릭이벤트를 등록합니다
        // window.kakao.maps.event.addListener(marker, 'click', function() {
        //     // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        //     infowindow.current.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        //     infowindow.current.open(kakaoMap.current, marker);
        // });
    }

    /** 체육관 클릭 이벤트 핸들러 */
    const onClickGym = (data: KakaoMapData) => {
        setClickedGym(data);
    }
    /** 검색버튼 클릭 이벤트 핸들러 */
    const onClickSearchButtonHandler = () => {
        setActiveSearch(true)
        // setTimeout(()=> {
        //     setActiveSearch(false)
        // },100)
    }

    /** 검색 버튼 클릭시 생애주기 */
    useEffect(() => {
        if (activeSearch) {
            if (markers.length !== 0) {
                markers.map(marker => {
                    marker.setMap(null)
                });
                setMarkers([]);
            }
            if (searchedValue !== '') {
                console.log(searchedValue)
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gym/get_gym`, {
                    params : {
                        name : searchedValue
                    }
                }).then(res => {
                    if (res.data.context.length > 0) {
                        ps.current.keywordSearch(searchedValue, (data: KakaoMapData[], status: "ZERO_RESULT" | "OK") => {
                            if (data.length !== 0 && status === "OK") {
        
                                const gyms = data.filter(obj => obj.category_name.indexOf('스포츠') !== -1 ? true : false);
                                if (gyms.length !== 0) {
                                    const markers = [];
                                    const bounds = new window.kakao.maps.LatLngBounds();
        
                                    for (let i = 0; i < gyms.length; i++) {
                                        const marker = displayMarker(gyms[i]);
                                        markers.push(marker)
                                        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
                                    }
        
                                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                                    kakaoMap.current.setBounds(bounds);
                                    setSearchResult(gyms)
                                    setMarkers(markers)
                                    setSearchedValue('');
                                    setActiveSearch(false);
                                }
                            }
                        })
                    } else {
                        window.alert("데이터 없음")
                    }
                }).catch(err => {
                    if (err.response.status === 403) {
                        window.alert("데이터 없음")
                    } else {
                        window.alert("관리자에게 문의")
                    }
                    setSearchedValue('');
                    setActiveSearch(false);
                    setMarkers([])
                    setSearchResult([])
                })
            }
        }
    }, [activeSearch, searchedValue, markers])


    /**마커 세팅 */
    useEffect(() => {
        if (markers.length !== 0) {
            markers.map(marker => marker.setMap(kakaoMap.current));
        }
    }, [markers])

    /** 카드 클릭 생애주기 */
    useEffect(() => {
        if (clickedGym !== null && !isActiveReviewForm) {
            const moveLatLon = new window.kakao.maps.LatLng(clickedGym.y, clickedGym.x);
            kakaoMap.current.setCenter(moveLatLon);
            var marker = new window.kakao.maps.Marker({
                map: kakaoMap.current,
                position: new window.kakao.maps.LatLng(clickedGym.y, clickedGym.x)

            });
            infowindow.current.setContent('<div style="padding:5px;font-size:12px;">' + clickedGym.place_name + '</div>');
            infowindow.current.open(kakaoMap.current, marker);
            // setTimeout(()=> {
            //     kakaoMap.current.setLevel(3);
            //     // 마커를 생성하고 지도에 표시합니다

            // }, 100)
            if (isActiveConfirm) {
                setIsActiveConfirm(false)
                setTimeout(() => {
                    setIsActiveConfirm(true)
                }, 100)
            } else {
                setIsActiveConfirm(true)
            }

        }
    }, [clickedGym, isActiveConfirm, isActiveReviewForm])


    // 리뷰 타입
    const [reviewType, setReviewType] = useState(1);

    /** 리뷰 타입 핸들러 */
    const onChangeTypeHandler = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setReviewType(e.target.value);
    };


    
    /**
     * 체육관 저장 핸들러
     */
    const onClickCheckBoxHandler = () => {
        setIsActiveReviewForm(true);
        setIsActiveConfirm(false)
    }
    /** 리뷰 취소 핸들러 */
    const onRemoveFormHandler = () => {
        setIsActiveReviewForm(false);
        setClickedGym(null);
        if (markers.length !== 0) {
            markers.map(marker => {
                marker.setMap(null)
            });
            setMarkers([]);
        }
        setSearchResult([])
        setSearchedValue('')
    }

    return (
        <>
            <Head>
                <title>리뷰 작성 : 투어리스트</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <GNB visibleNewReviewButton={false}></GNB>
            <Container>
                <Title>방문한 곳</Title>
                <Radio.Group value={reviewType} onChange={onChangeTypeHandler}>
                    <Radio value={1}>볼더링</Radio>
                    <Radio value={2} disabled>리드/탑루프</Radio>
                    <Radio value={3} disabled>스피드</Radio>
                    <Radio value={4} disabled>자연암벽</Radio>
                </Radio.Group>
                <MapGrid>
                    <SearchGymContainer>
                        <InputContainer>
                            <input type="text" name="" id="" placeholder='방문한 체육관을 검색해보세요' value={searchedValue} onChange={onChangeInput} />
                            <button onClick={onClickSearchButtonHandler}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </InputContainer>
                        <GymContainer>
                            {
                                searchResult.length !== 0 && searchResult.map((data) => {
                                    return (
                                        <Gym key={data.id} active={clickedGym?.id === data.id ? true : false} onClick={() => onClickGym(data)}>
                                            <h1>{data.place_name}</h1>
                                            <address>{data.address_name}</address>
                                        </Gym>
                                    )
                                })
                            }
                        </GymContainer>
                    </SearchGymContainer>
                    <KakaoMap id='map'></KakaoMap>
                    {isActiveConfirm && <Confirm>
                        이곳이 맞나요?
                        <OkButton onClick={onClickCheckBoxHandler}>
                            <FontAwesomeIcon icon={faCheck} />
                        </OkButton>
                        <NoButton onClick={()=>setIsActiveConfirm(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </NoButton>
                    </Confirm>}
                </MapGrid>
            </Container>
            {isActiveReviewForm && <ReviewForm data={clickedGym}  onRemove={onRemoveFormHandler} alertAction={setAlertStat}/>}
            {alertStat.actived && <Alert text={alertStat.text} type={alertStat.type} handler={resetAlertHandler} />}
        </>
    );
}

export default NewReview;

const ConfirmFadeIn = keyframes`
    100% {
        transform: translateY(0%);
        opacity: 1;
    }
`

const Confirm = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 10px;
    right: 10px;
    color : #000;
    z-index: 8;
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
    transform: translateY(120%);
    opacity: 0;
    animation: ${ConfirmFadeIn} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
`
const OkButton = styled.button`
    width: 30px;
    height: 30px;
    background-color: unset;
    color : #0349aa;
    border: 0;
    margin-left: 20px;
    cursor: pointer;
`
const NoButton = styled.button`
    width: 30px;
    height: 30px;
    background-color: unset;
    color : #b20e08;
    border: 0;
    cursor: pointer;
`


const Container = styled.div`
    width: 90%;
    background-color: #fff;
    padding: 100px 0 0;
    display: flex;
    flex-direction: column;
    max-width: 1070px;
    margin: 0 auto;
`

const MapGrid = styled.div`
    display: grid;
    width: 100%;
    height: 500px;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 100%;
    border-radius: 18px;
    border : 1px solid rgba(0,0,0,0.1);
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
    position: relative;
`

const KakaoMap = styled.div`
    width: 100%;
    height: 100%;
    margin-left: 10px;
    overflow: hidden;
`

const Title = styled.h1`
    font-size: var(--fn-sans);
    font-size: 18px;
    letter-spacing: -0.78px;
    font-weight: 700;
    padding-bottom: 0.75rem;
`
const SearchGymContainer = styled.div`
    width: 100%;
    /* height: 100%; */
    padding: 5% 0 5% 4%;
    /* overflow: hidden; */
`

const InputContainer = styled.div`
    width: 100%;
    height: 45px;
    padding-right: 4%;
    position: relative;
    & > input {
        width: 100%;
        height: 100%;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 8px;
        background-color: unset;
        padding-left: 12px;
        font-family: var(--fn-sans);
        letter-spacing: -0.56px;
    }
    & > button {
        margin-right: 4%;
        position: absolute;
        top : 0;
        right: 0;
        width: 45px;
        height: 100%;
        background-color: unset;
        border: 0;
        cursor: pointer;
    }
`

const GymContainer = styled.div`
    margin-top: 5%;
    padding-right: 4%;
    width: 100%;
    height: calc(100% - 45px);
    overflow-y: auto;
`

interface GYM {
    active: boolean
}

const Gym = styled.div<GYM>`
    padding: 12px 15px;
    border-radius: 8px;
    border : 1px solid rgba(0,0,0,0.1);
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 15px;
    cursor: pointer;
    & > h1 {
        font-family: var(--fn-sans);
        font-weight: 500;
        font-size: 16px;
    }
    & > address {
        font-family: var(--fn-sans);
        font-weight: 400;
        font-size: 16px;
        letter-spacing: -0.67px;
        padding-top: 6px;
    }
    ${(props) => props.active && css`
        border : 1px solid #0b8cdd;
        & > h1 {
            color : #0b8cdd;
        }
    `}
    /* &:not(:last-of-type) {
    } */
    
`