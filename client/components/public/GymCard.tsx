import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect,useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import axios from '../../api/axios';
import {GymData, Review} from '../../types/type'
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
    const [reviews, setReviews] = useState<Array<Review>>([]);
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
                        id : gym.idx,
                        offset : offset.current,
                        type : "text"
                    }
                })).data
                if (text_review_data.callback === 200) {
                    max_offset.current = text_review_data.max_offset;
                    setReviews(text_review_data.reviews);
                }
            } catch (error) {
                console.log("서버와의 통신 중에서 에러가 발생했습니다.")
                console.log(error);
            }

        }
        getData();
    }, [])
    console.log(reviews);
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
            <KakaoMap id="map"></KakaoMap>
            <FacilityContainer>
                <h2>시설</h2>
                <ul>
                    {gymInfo.length !== 0 && gymInfo.map((info, i) => {
                        return <li key={i}>{info}</li>
                    })}
                </ul>
            </FacilityContainer>
            <ReviewContainer>
                <ReviewTypeTitle>사진리뷰(2)</ReviewTypeTitle>
                <ReviewTypeTitle>방문자리뷰({reviews.length})</ReviewTypeTitle>
                {/* 사진 데이터가 있는 경우 */}
                <PhotoReviewContainer>
                    <PhotoReview>
                        <Image
                            rootClassName={styles.preview}
                            preview={{visible : false}} 
                            width={'100%'} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                        onClick={() => setVisible(true)} />
                    </PhotoReview>
                    <PhotoReview>
                        <Image
                            rootClassName={styles.preview}
                            preview={{visible : false}} 
                            width={'100%'} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                        onClick={() => setVisible(true)} />
                    </PhotoReview>
                    <PhotoReview>
                        <Image
                            rootClassName={styles.preview}
                            preview={{visible : false}} 
                            width={'100%'} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                        onClick={() => setVisible(true)} />
                    </PhotoReview>
                    <PhotoReview>
                        <Image
                            preview={false}
                            rootClassName={styles.preview}
                            width={'100%'} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                        />
                    </PhotoReview>
                </PhotoReviewContainer>
                {/* 사진데이터가 없는 경우 추가해야함 */}

                {/* 리뷰 데이터가 있는 경우 */}
                <TextReviewContainer>
                    {reviews.map((review) => {
                        return <TextReview key={review.idx}>
                            <div className='review_info'>
                                <h1>{review.review_writer}</h1>
                                <div className='rate-container'>
                                    <Rate disabled defaultValue={review.review_rate} />
                                </div>
                                <p>{review.created_at.split('T')[0]}</p>
                            </div>
                            <p className='review-text'>{review.review_text}</p>
                        </TextReview>
                    } )}
                </TextReviewContainer>
            </ReviewContainer>
        </Container>
        <div style={{ display: 'none' }}>
            <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
            </Image.PreviewGroup>
        </div>
    </>
}

export default GymCard;

/**
 * 카카오 정적지도 불러오는 함수
 * @param gym_latitude 
 * @param gym_longitude 
 */
const LoadKakaoMap = (gym_latitude : string, gym_longitude : string) => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services&autoload=false`;
    document.head.appendChild(mapScript);
    const latitude = Number(gym_latitude);
    const longitude = Number(gym_longitude);
    const onLoadKakaoMap = () => {
        window.kakao.maps.load(() => {
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
        })
    }
    mapScript.addEventListener("load", onLoadKakaoMap);
}

const Container = styled.div`
    width: 80%;
    max-width: 1024px;
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
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
`

const RemovePopup = styled.button`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: unset;
    border: 0;
    position: absolute;
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
    ${(props)=> props.type === "BOULDERING" && css`
        background-color: #0077ff;
    `
    }
    ${(props)=> props.type === "TOPRUPE" && css`
        background-color: #ffae00;
    `
    }
    
`

const GymTitle = styled.h1`
    font-size: 32px;
    letter-spacing: -0.67px;
    line-height: 1.35;
    font-family: var(--fn-jua);
    `

const GymAddressContainer = styled.div`
    display: flex;
    align-items: center;
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

const ReviewContainer = styled.div`
    padding-top: 12px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 16px calc(100% - 16px);
`

const ReviewTypeTitle = styled.h2`
    font-family: var(--fn-sans);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.78px;
    color : #1a1a1a;
`

const PhotoReviewContainer = styled.div`
    display: grid;
    width: calc(100% - 12px);
    height: 100%;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 50%);
    padding-top: 12px;
`

const PhotoReview = styled.div`
    width: calc(100% - 3px);
    height: calc(100% - 3px);
    border: 1px solid rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
    &:nth-of-type(1) {
        border-top-left-radius: 12px;
    }
    &:nth-of-type(2) {
        border-top-right-radius: 12px;
    }
    &:nth-of-type(3) {
        border-bottom-left-radius: 12px;
    }
    &:nth-of-type(4) {
        border-bottom-right-radius: 12px;
    }
`

const TextReviewContainer = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(5, 20%);
    width: 100%;
    height: 100%;
    padding-top : 12px;
    overflow: hidden;
`

const TextReview = styled.div`
    width: 100%;
    height: calc(100% - 6px);
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
`
