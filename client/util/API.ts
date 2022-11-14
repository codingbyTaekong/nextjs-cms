import axios from 'axios';

export default axios.create({
    baseURL : 'https://wh.jandi.com/connect-api/webhook/14743284/6a3d9a2d676faaa6afb9650edbcdd6e5',
    headers : {
        'Accept': 'application/vnd.tosslab.jandi-v2+json',
        'Content-Type': 'application/json',
    }
})
