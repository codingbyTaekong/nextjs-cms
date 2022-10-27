import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components"
// import '../css/kakaoOverlay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';
// import * as Hangul from 'hangul-js';
import axios from 'axios';
import type { NextPage } from "next";
import Head from 'next/head';
import Script from 'next/script';

declare global {
    interface Window {
        kakao: any;
        myMap : any;
    }
}

interface cafeData {
    idx : number,
    location: string
    name : string
    address: string
    phone: string | null
    time: string | null
    holiday : string | null
    break_time: string | null
    last_order: string | null
    introduce: string
    sns_url: string | null
    shop_url: string | null
    pay: string | null
    hashtag: string | null
    img_thumb1: string | null
    img_thumb2: string | null
    img_thumb3: string | null
    img_thumb4: string | null
    img_thumb5: string | null
    reservation: string | null
    photozone: string | null,
    delivery: string | null,
    packaging: string | null,
    wifi: string | null
    coupon: string | null
    smoking: string | null
    groupseat: string | null
    parking: string | null
    pet: string | null
    kidszone: string | null
    rooftop: string | null
    facilities_info: string | null
    parking_able: string | null
    parking_disable: string | null
    pet_info: string | null
    pet_img1: string | null
    pet_img2: string | null
    pet_img3: string | null
    pet_img4: string | null
    pet_img5: string | null
    position: string | null
    vr: string | null
    menu: string | null
    etc: string | null
}

interface gymData {
    idx : number
    gym_name : string
    gym_address : string
    gym_latitude : string
    gym_longitude : string
    gym_info : string
    created_at : string
    updated_at : string
}


const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position : relative;
    @media (max-width : 600px) {
        margin-left: 0;
        padding-top: 30px;
    }
`
interface overlayData {
    name: string,
    latlng: any,
    address: string
}

const Wrapper = styled.div`
    width: 340px;
    height: calc(var(--vh, 1vh) * 100);
    position: fixed;
    z-index: 2;
    top: 0;
    left: 100px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 24px 23px;
    @media (max-width:600px) {
        padding-left: 0;
        width: 100%;
        height: calc((var(--vh, 1vh) * 100) - 35px);
        left: 0;
        transition: all 0.25s;
        & {
            transform: translateY(calc(100% - 55px));
        }
        &.active {
            transform: translateY(86.5px);
        }
    }
`
const SearchWrapper = styled.div`
    width: 293px;
    margin: 0 auto;
    margin-top: 84px;
    @media (max-width:600px) {
        width: 85%;
        margin-top: 23px;
    }
`
const SearchInput = styled.input`
    width: 100%;
    height: 42px;
    border-radius: 21px;
    font-family: var(--fn-sans);
    font-size: 18px;
    letter-spacing: -1.26px;
    color : #2a2a2a;
    background-color: rgba(0,0,0,0.05);
    padding-left: 20px;
    padding-right: 18px;
    &:focus {
        outline: none;
        border: 1px solid var(--bs-color-red);
    }

`

const BackgroundButton = styled.button`
    background-color: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 17.7px;
    color : #656565;
`

const CardWrapper = styled.div`
    width: 100%;
    margin-top: 35px;
    padding-right: 23px;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    @media (max-width:600px) {
        margin-left: 4%;
    }
`

const Card = styled.div`
    width: 100%;
    height: 100px;
    padding: 22px 20px;
    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:not(:last-of-type) {
        margin-bottom: 4%;
    }
    & > h2 {
        font-size: 20px;
        letter-spacing: -1.4px;
        color: #333;
        font-family: var(--fn-sans);
        font-weight: 700;
    }
    & > p {
        font-family: var(--fn-sans);
        font-weight: 400;
        letter-spacing: -1.12px;
        font-size: 16px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &:hover {
        border: 1px solid var(--bs-color-red);
    }

`

const MobileTitle = styled.h1`
    display: none;
    @media (max-width: 600px) {
        width: 100%;
        height: 51.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        z-index: 2;
        font-family: var(--fn-Omni-50);
        font-size: 20px;
        letter-spacing: -1.24px;
        color: #000;
        position: fixed;
        top: 35px;
        left: 0;
    }
`

const Map: NextPage = () => {
    const [displayOverlay, setDisplayOverlay] = useState(false);
    const [loadMap, setLoadMap] = useState(false);
    const [visibleInfo, setVisibleInfo] = useState(false);
    const [visibleVr, setVisibleVr] = useState(false);
    const targetData = useRef<gymData | null>(null);
    const [activedInput, setActivedInput] = useState(false);
    const [gymList, setGymList] = useState<Array<gymData>>([])
    const [searchResultList, setSearchResultList] = useState<Array<cafeData>>([]);
    const [inputValue, setInputValue] = useState('');

    // 이미지 클릭시 팝업 업데이트
    const [visibleSlider, setVisibleSlider] = useState(false);

    const overlayData = useRef<overlayData>({
        name: '',
        latlng: null,
        address: ""
    })
    const [overlayArray, setOverlayArray] = useState<Array<any>>([]);
    const myMap = useRef<any>();
    const startMouseDownPoz = useRef(0);
    const endMouseDownPoz = useRef(0);

    //슬라이더 핸들러
    const ClickImgHandler = () => {
        setVisibleSlider(true);
    }

    // 팝업 삭제
    const onClickRemoveInfo = () => {
        setVisibleInfo(false)
    }
    // vr모드 삭제
    const onClickRemoveVr = () => {
        setVisibleVr(false);
    }
    // vr모드 활성화
    const onClickActiveVr = () => {
        setVisibleVr(true);
    }

    // 모바일 드레그 이벤트
    const drageStartHandler = (e:React.TouchEvent<HTMLDivElement>) => {
        startMouseDownPoz.current = e.changedTouches[0].clientY
    }
    // 모바일 드레그 이벤트
    const drageMoveHandler = (e:React.TouchEvent<HTMLDivElement>) => {
        endMouseDownPoz.current = e.changedTouches[0].clientY;
    }
    // 모바일 드레그 이벤트
    const drageEndHandler = (e:React.TouchEvent<HTMLDivElement>) => {
        if (startMouseDownPoz.current !== 0 && endMouseDownPoz.current !==0) {
            if (startMouseDownPoz.current > endMouseDownPoz.current) {
                if (!activedInput) {
                    setActivedInput(true);
                }
            } else {
                if (activedInput) {
                    setActivedInput(false);
                }
            }
            startMouseDownPoz.current = 0;
            endMouseDownPoz.current = 0;
        }
    }
    const inputHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    // 카카오 지도 로딩
    useEffect(() => {
        const getData = async () => {
            const res  = await (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gym/get_gym`)).data;
            // const list : Array<cafeData> = [];
            if (res.callback === 200) {
                const data : Array<gymData> = res.context;
                setGymList(data);
                // console.log(res.context);
                // setCafeList(result);
                // setSearchResultList(result);
            } else {
                console.log("데이터를 불러오는 데 실패했습니다");
            }
            setLoadMap(true)
        }
        const mapScript = document.createElement("script");
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services&autoload=false`;
        document.head.appendChild(mapScript);
        const latitude = 37.88155492414019;
        const longitude = 127.73164686091975;
        const onLoadKakaoMap =  () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(latitude, longitude),
                    level: 6
                };
                const map = new window.kakao.maps.Map(container, options);
                myMap.current = map;
                window.myMap = map;
                // getData();



                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch('서울 동대문구 장한로2길 63 호정빌딩 2F', function(result : any, status : any) {

                    // 정상적으로 검색이 완료됐으면 
                     if (status === window.kakao.maps.services.Status.OK) {
                
                        var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        const lat = result[0].y
                        const lng = result[0].x
                        console.log("lat : ", lat, "lng : ", lng);
                        // 결과값으로 받은 위치를 마커로 표시합니다
                        var marker = new window.kakao.maps.Marker({
                            map: map,
                            position: coords
                        });
                
                        // 인포윈도우로 장소에 대한 설명을 표시합니다
                        var infowindow = new window.kakao.maps.InfoWindow({
                            content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
                        });
                        infowindow.open(map, marker);
                
                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                    } 
                });  
            });
        };
        mapScript.addEventListener("load", onLoadKakaoMap);

        return () => {
            mapScript.removeEventListener("load", onLoadKakaoMap);
        }
    }, []);


    // 카카오지도 마커 찍기
    useEffect(() => {
        if (loadMap) {
            gymList.map(gym=> {
                const position = new window.kakao.maps.LatLng(gym.gym_latitude, gym.gym_longitude);
                const marker = new window.kakao.maps.Marker({
                    map: myMap.current,
                    position,
                    title: gym.gym_name,
                    clickable: true
                })
                marker.setMap(myMap.current);
                window.kakao.maps.event.addListener(marker, 'click', (e: any) => {
                    // 처음 눌렀을 때
                    if (!displayOverlay) {
                        setDisplayOverlay(true);
                        targetData.current = gym;
                        overlayData.current = {
                            name : gym.gym_name,
                            latlng : position,
                            address : gym.gym_address
                        }
                        myMap.current?.panTo(position)
                        setTimeout(() => {
                            myMap.current?.setLevel(4);
                        }, 500)

                    } else {
                        // 같은 걸 눌렀을 때
                        if (overlayData.current.name === gym.gym_name) {
                            targetData.current = null;
                            setDisplayOverlay(false);
                            overlayData.current = {
                                name: '',
                                latlng: null,
                                address: ""
                            };
                            myMap.current?.setLevel(6);
                        } else {
                            // 다른 걸 눌렀을 때
                            targetData.current = gym;
                            setDisplayOverlay(false);
                            overlayData.current = {
                                name : gym.gym_name,
                                latlng : position,
                                address : gym.gym_address
                            }
                            myMap.current?.panTo(position)
                            setTimeout(() => {
                                myMap.current?.setLevel(4);
                            }, 500)
                            setDisplayOverlay(true);
                        }
                    }
                })
            })
            // cafeList.map(obj => {
            //     const lat = obj.position?.split(',')[0];
            //     const lng = obj.position?.split(',')[1];
            //     const position = new window.kakao.maps.LatLng(Number(lat), Number(lng))
            //     const marker = new window.kakao.maps.Marker({
            //         map: myMap.current,
            //         position,
            //         title: obj.name,
            //         clickable: true
            //     })
            //     marker.setMap(myMap.current);

            // })
        }
    }, [loadMap, displayOverlay])

    //마커 클릭시 오버레이 생성 
    useEffect(() => {
        if (!displayOverlay) {
            if (overlayArray.length > 0) {
                overlayArray[0].setMap(null);
                setOverlayArray([]);
            }
        } else {
            const customOverlay = new window.kakao.maps.CustomOverlay({
                position: overlayData.current.latlng,
                content: `
                <div class="kakaoOverlayContainer">
                    <div class="overlayBox">
                        <h3>${overlayData.current.name}</h3>
                        <p>${overlayData.current.address}</p>
                        <button class="viewGymInfo">매장정보</button>
                        <div class="overlayTail"></div>
                    </div>
                </div>`,
                // <button class="viewGymInner">매장 내부 보기</button>
                xAnchor: 0.5,
                yAnchor: 1.6
            })
            customOverlay.key = overlayData.current.name;
            customOverlay.setMap(myMap.current);
            setOverlayArray(overlayArray.concat([customOverlay]));
            document.querySelector('.viewCafeInfo')?.addEventListener('click', (e) => {
                setVisibleInfo(true);
            })
            // document.querySelector('.viewCafeInner')?.addEventListener('click', (e) => {
            //     if (targetData.current && targetData.current){
            //         setVisibleVr(true);
            //     } else {
            //         window.alert("준비중입니다.");
            //     }
            // })
        }
    }, [displayOverlay])


    // 검색기능
    // useEffect(() => {
    //     if (inputValue !== '' && inputValue.length >= 2) {
    //         const lastText = inputValue[inputValue.length -1];
    //         const getData = async () => {
    //             const result : Array<cafeData> = await (await axios.post(`${process.env.REACT_APP_API_URL}/cafe_list`, { search_text: inputValue,})).data.list
    //             setSearchResultList(result);
    //         }
    //         // if (inputValue.length >=2 && Hangul.disassemble(lastText).length >= 2) {
    //         //     getData()
    //         // }
    //     }
    //     if (inputValue === '') {
    //         setSearchResultList(cafeList);
    //     }
    // }, [inputValue])

    // 카드 클릭 핸들러
    // const clickCardHandler = (obj : gymData) => {
    //     if (obj.name !== overlayData.current.name) {
    //         const lat = obj.position?.split(',')[0];
    //         const lng = obj.position?.split(',')[1];
    //         const position = new window.kakao.maps.LatLng(Number(lat), Number(lng));
    //         if (targetData.current) {
    //             targetData.current = null;
    //             setDisplayOverlay(false);
    //             overlayData.current = {
    //                 name: '',
    //                 latlng: null,
    //                 address: ""
    //             };
    //         }
    //         myMap.current?.panTo(position)
    //         setTimeout(() => {
    //             myMap.current?.setLevel(4);
    //             targetData.current = obj;
    //             overlayData.current = {
    //                 name : obj.name,
    //                 latlng : position,
    //                 address : obj.address
    //             }
    //             setDisplayOverlay(true);
    //         }, 500)
    //     } else {
    //         targetData.current = null;
    //         setDisplayOverlay(false);
    //         overlayData.current = {
    //             name: '',
    //             latlng: null,
    //             address: ""
    //         };
    //         myMap.current?.setLevel(6);
    //     }
    // }

    return (
        <>
        <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <Script src='https://developers.kakao.com/sdk/js/kakao.min.js'></Script>
        </Head>
{/* <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script> */}

            {/* <MobileTitle>카페투어</MobileTitle> */}
            {/* <Wrapper className={activedInput ? 'active' : ''}  onTouchStart={drageStartHandler} onTouchMove={drageMoveHandler} onTouchEnd={drageEndHandler}>
                <SearchWrapper >
                    <div style={{ position: "relative" }}>
                        <SearchInput type="text"  onChange={inputHandler} value={inputValue}/>
                        <BackgroundButton>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </BackgroundButton>
                    </div>
                </SearchWrapper>
                <CardWrapper>
                    {
                        searchResultList.map((obj, index)=> {
                            return (
                                <Card key={index} onClick={()=> clickCardHandler(obj)}>
                                    <h2>{obj.name}</h2>
                                    <p>{obj.address}</p>
                                </Card>
                            )
                        })
                    }
                </CardWrapper>
            </Wrapper> */}
            <MapContainer id="map"></MapContainer>
            {/* {visibleInfo && targetData.current !== null && <CafeInfo visible={visibleInfo} data={targetData.current} onClick={onClickRemoveInfo} onClickSlider={ClickImgHandler} onClickVr={onClickActiveVr} />} */}
        </>
    )
}

export default Map;