import styled from 'styled-components'
import {GymData} from '../../types/type'


interface Props {
    gym : GymData
}

const GymCard = ({gym} : Props) => {
    console.log(gym)
    return <>
        <Container>
            <h1>{gym.gym_name}</h1>
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