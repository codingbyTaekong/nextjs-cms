import { useEffect,useRef } from 'react'
import styled, { css } from 'styled-components'
import {GymData} from '../../types/type'

declare global {
    interface Window {
       kakao: any;
       myMap : any;
   }
}


interface Props {
    gym : GymData
}

interface PLACETYPE {
    type : BOULDERING | TOPROFE
}

type BOULDERING = "BOULDERING"
type TOPROFE = "TOPROFE"

const GymCard = ({gym} : Props) => {
    console.log(gym)
    const GymMap = useRef<any>();
    useEffect(()=> {
        const mapScript = document.createElement("script");
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services&autoload=false`;
        document.head.appendChild(mapScript);
        const latitude = Number(gym.gym_latitude);
        const longitude = Number(gym.gym_longitude);
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
    }, [])
    return <>
        <Container>
            <PlaceType type="BOULDERING">ad</PlaceType>
            <GymTitle>{gym.gym_name}</GymTitle>
            <GymAddressContainer>
                <GymAddress>{gym.gym_address}</GymAddress>
            </GymAddressContainer>
            <KakaoMap id="map"></KakaoMap>
        </Container>
    </>
}

export default GymCard;

const Container = styled.div`
    width: 80%;
    max-width: 1024px;
    height: 80%;
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
`

const PlaceType = styled.span<PLACETYPE>`
    padding: 6px 10px;
    font-size: var(--fn-sans);
    border-radius: 12px;
    color : #fff;
    ${(props)=> props.type === "boulderinㅎ" && css`
        background-color: aqua;
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
    margin-top: 25px;
    border: 1px solid rgba(0,0,0,0.1);
`