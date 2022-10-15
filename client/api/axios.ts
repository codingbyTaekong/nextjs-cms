import axios from "axios";
import { env } from "process";

export default axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    headers : {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `http://localhost:3001`
    },
    withCredentials : true
})