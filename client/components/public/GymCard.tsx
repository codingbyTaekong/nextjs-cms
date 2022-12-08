import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect,useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import axios from '../../api/axios';
import {GymData, Review as _Review} from '../../types/type'
import { Image, Rate } from 'antd'
import styles from "../../styles/public/gymcard.module.css";


declare global {
    interface Window {
       kakao: any;
       myMap : any;
   }
}


interface Props {
    gym : GymData
    onRemove : () => void
}

interface PLACETYPE {
    type : BOULDERING | TOPROFE
}

type BOULDERING = "BOULDERING"
type TOPROFE = "TOPROFE"

const GymCard = ({gym, onRemove} : Props) => {
    const [visible, setVisible] = useState(false);
    const offset = useRef(0);
    const max_offset = useRef(0);
    const [gymInfo, setGymInfo] = useState<Array<string>>([]);
    const ScrollContainerRef = useRef<HTMLDivElement>(null);
    // const [reviews, setReviews] = useState<Array<Review>>([]);
    useEffect(()=> {
        LoadKakaoMap(gym.gym_latitude, gym.gym_longitude);
        if (gym.gym_info !== '' && gym.gym_info !== null) {
            const infoArray = gym.gym_info.split(',');
            setGymInfo(infoArray);
        }
        const getData = async () => {
            try {
                const text_review_data = await (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gym/get_gym_text_reviews`, {
                    params : {
                        id : gym.place_id,
                        offset : offset.current,
                        type : "text"
                    }
                })).data
                if (text_review_data.callback === 200) {
                    console.log(text_review_data)
                    max_offset.current = text_review_data.max_offset;
                    // setReviews(text_review_data.reviews);
                }
            } catch (error) {
                console.log("서버와의 통신 중에서 에러가 발생했습니다.")
                console.log(error);
            }

        }
        // getData();
    }, [])
    return <>
        <Container>
            <RemovePopup onClick={onRemove}>
                <FontAwesomeIcon icon={faXmark} />
            </RemovePopup>
            {gym.gym_type === "볼더링" && <PlaceType type="BOULDERING">{gym.gym_type}</PlaceType>}
            <GymTitle>{gym.gym_name}</GymTitle>
            <GymAddressContainer>
                <GymAddress>{gym.gym_address}</GymAddress>
            </GymAddressContainer>
            <ScrollContainer ref={ScrollContainerRef}>
                <KakaoMap id="map"></KakaoMap>
                <FacilityContainer>
                    <h2>시설</h2>
                    <ul>
                        {gymInfo.length !== 0 && gymInfo.map((info, i) => {
                            return <li key={i}>{info}</li>
                        })}
                        {gymInfo.length === 0 &&
                            <li>등록된 정보가 없습니다</li>
                        }
                    </ul>
                </FacilityContainer>
                <ReviewWrapper>
                    <ReviewTypeTitle>방문자리뷰({gym.reviews.length})</ReviewTypeTitle>
                    <ReviewContainer>
                        {gym.reviews.map((review) => {
                            return <Review key={review.idx}>
                                <div className='review_info'>
                                    <h1>{review.review_writer}</h1>
                                    <div className='rate-container'>
                                        <Rate disabled defaultValue={review.review_rate} />
                                    </div>
                                    <p>{review.created_at.split('T')[0]}</p>
                                </div>
                                <div className='img-container'>
                                    <div className='img-slider'>
                                        {review.review_imgs.split(', ').map((img, i, arr) => {
                                            return (
                                                <div className={arr.length === 1 ? 'img cover' :'img'}  style={{backgroundImage : `url(${img})`}}></div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <p className='review-text'>{review.review_text}</p>
                            </Review>
                        } )}
                    </ReviewContainer>
                </ReviewWrapper>
            </ScrollContainer>
        </Container>
    </>
}

export default GymCard;

/**
 * 카카오 정적지도 불러오는 함수
 * @param gym_latitude 
 * @param gym_longitude 
 */
const LoadKakaoMap = (gym_latitude : string, gym_longitude : string) => {
    // const mapScript = document.createElement("script");
    // mapScript.async = true;
    // mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services&autoload=false`;
    // document.head.appendChild(mapScript);
    const latitude = Number(gym_latitude);
    const longitude = Number(gym_longitude);
    // const onLoadKakaoMap = () => {
    //     window.kakao.maps.load(() => {
            const markerImg = new window.kakao.maps.MarkerImage("https://t1.daumcdn.net/mapjsapi/images/2x/marker.png", new window.kakao.maps.Size(29, 42))
            const marker = {
                position : new window.kakao.maps.LatLng(latitude, longitude),
                image : markerImg
            }
            // https://t1.daumcdn.net/mapjsapi/images/2x/marker.png
            const container = document.getElementById('map');
            const options = {
                center : new window.kakao.maps.LatLng(latitude, longitude),
                level : 3,
                marker
            }
            const map = new window.kakao.maps.StaticMap(container, options)
        // })
    // }
    // mapScript.addEventListener("load", onLoadKakaoMap);
}

const Container = styled.div`
    width: 90%;
    max-height: 938px;
    max-width: 768px;
    height: 90%;
    border-radius: 18px;
    border : 1px solid rgba(0,0,0,0.1);
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    background-color: #fff;
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 110px 32px 48px 32px;
    overflow-y: auto;
`


const RemovePopup = styled.button`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: unset;
    border: 0;
    position: fixed;
    top: 15px;
    right : 15px;
    font-size : 24px;
    color : rgba(0,0,0,0.5);
    cursor: pointer;
    &:hover {
        color : rgb(0,0,0);
    }
`


const PlaceType = styled.span<PLACETYPE>`
    width: fit-content;
    padding: 4px 8px;
    font-size: var(--fn-sans);
    border-radius: 8px;
    font-size: 14px;
    color : #fff;
    background-color: ${props => props.type === "BOULDERING" ? '#0077ff' : ''};
    background-color: ${props => props.type === "TOPRUPE" ? '#ffae00' : ''};    
`

const GymTitle = styled.h1`
    font-size: 32px;
    letter-spacing: -0.67px;
    line-height: 1.35;
    font-family: var(--fn-jua);
    position: fixed;
    top : 48px;
`

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
`

const GymAddressContainer = styled.div`
    display: flex;
    align-items: center;
    position : fixed;
    top : 85px;
    `

const GymAddress = styled.address`
    font-family: var(--fn-sans);
    font-weight: 400;
    font-size: 18px;
`

const KakaoMap = styled.div`
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    height: 150px;
    min-height: 150px;
    margin-top: 25px;
    border: 1px solid rgba(0,0,0,0.1);
`

const FacilityContainer = styled.div`
    padding-top: 15px;
    & > h2 {
        font-family: var(--fn-sans);
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.78px;
        color : #1a1a1a;
    }
    & > ul {
        display: flex;
        padding-top: 12px;
    }
    & > ul > li {
        border-radius: 8px;
        border : 1px solid rgba(0,0,0,0.1);
        padding: 4px 6px;
        font-family: var(--fn-sans);
        font-weight: 400;
        font-size: 14px;
    }
    & > ul > li:not(:last-of-type) {
        margin-right: 12px;
    }
`

const ReviewWrapper = styled.div`
    padding-top: 12px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const ReviewTypeTitle = styled.h2`
    font-family: var(--fn-sans);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.78px;
    color : #1a1a1a;
`

const ReviewContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-top : 12px;
    /* overflow-y: auto; */
`

const Review = styled.div`
    width: 100%;
    /* height: calc(100% - 6px); */
    border-radius: 12px;
    border : 1px solid rgba(0,0,0,0.1);
    padding : 3% 3.2%;
    overflow: hidden;
    text-overflow: ellipsis;
    & > div.review_info {
        display: flex;
        align-items: flex-end;
    }
    & div.review_info > h1 {
        font-size: 14px;
        font-family: var(--fn-sans);
        font-weight: 500;
    }
    & div.review_info > .rate-container {
        display: flex;
        font-size: 14px;
        margin-left: 8px;
    }
    & div.review_info > .rate-container .ant-rate-star:not(:last-child) {
        margin-right: 2px;
    }
    & div.review_info > p {
        font-size: 12px;
        color : rgba(0,0,0,0.5);
        margin-left: auto;
    }
    & > .review-text {
        font-size: 15px;
        font-family: var(--fn-sans);
        margin-top: 12px;
        text-overflow: ellipsis; 
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
    }
    & div.review_info .ant-rate {
        font-size : 14px;
    }
    & .img-container {
        overflow: hidden;
        /* width: 210px; */
        width: 100%;
        padding: 3% 0;
    }
    & .img-slider {
        touch-action: pan-y;
    }
    & .img-slider > .img {
        width: 210px;
        height: 168px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border-radius: 6px;
        box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    }
    & .img-slider > .img.cover {
        width: 100%;
    }
`
