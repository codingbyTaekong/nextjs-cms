import { combineReducers } from 'redux';
import UserInfo, {USERINFO} from './UserInfo';
// import OtherUsers, {Users} from './OtherUsers';
// import BabylonSettings, { SETTINGS } from './BabylonSettings';


interface StoreState {
    UserInfo : USERINFO,
}

export type {StoreState};

const rootReducer = combineReducers({
    UserInfo,
})

export default rootReducer;