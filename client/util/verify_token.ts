import axios from 'axios';
import { NextRouter } from 'next/router';

export const verify_token = (router : NextRouter, token : string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify_access_toekn`).then(res=> {
        // 로그인 처리
        if (res.data.callback === 200) {
        
        }
    }).catch(err => {
        router.push('/')
    })
}