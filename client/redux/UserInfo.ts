import {UserInfoTypes} from './type'


export interface USERINFO {
    user_id : string
    user_nickname : string
    rule : number
    access_token : string,
}

const initialState = {
    user_id : '',
    user_nickname : '',
    rule : 0,
    access_token : '',
}

export interface ActionSetUserInfo {
    user_id : string
    user_nickname : string
    rule : number
    access_token : string,
}

/**
 * 로그인 처리 리덕스 액션함수입니다.
 * @param param0 
 * @returns 
 */
export const setUserInfo = ({user_id, user_nickname, rule, access_token} : ActionSetUserInfo) => ({
    type: UserInfoTypes.SET_USER_INFO,
    user_id,
    user_nickname,
    rule,
    access_token,
})


type Actions =
    | ReturnType<typeof setUserInfo>




export default function UserInfo(state : USERINFO = initialState, action : Actions) {
    switch (action.type) {
        case UserInfoTypes.SET_USER_INFO:
            return {
                ...state,
                user_id : action.user_id,
                user_nickname : action.user_nickname,
                rule : action.rule,
                access_token : action.access_token,
            }
        default:
            return state
    }
}