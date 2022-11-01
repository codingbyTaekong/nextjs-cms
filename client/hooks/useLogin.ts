import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {setUserInfo, ActionSetUserInfo} from '../redux/UserInfo'
export default () => {
    const router = useRouter();
    console.log(router)
    // const [isLogin, setIsLogin] = useState(false);
    // const dispatch = useDispatch();
    // const SetUserInfo = ({user_id, user_nickname, rule, access_token, refresh_token_key} :ActionSetUserInfo) => dispatch(setUserInfo({user_id, user_nickname, rule, access_token, refresh_token_key}));
    // const handler = useCallback(()=> {
    //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`).then(res=> {
    //         // 로그인 처리
    //         if (res.data.callback === 200) {
    //             const {accessToken, refreshTokenKey} = res.data.token;
    //             const {id, nickname, rule} = res.data.user
    //             axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    //             SetUserInfo({
    //                 user_id : id,
    //                 user_nickname : nickname,
    //                 rule,
    //                 access_token : accessToken,
    //                 refresh_token_key : refreshTokenKey
    //             })
    //             setIsLogin(true);
    //         }
    //     })
    // }, [])

    // return [isLogin, handler]    
}