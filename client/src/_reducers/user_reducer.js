import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER,
    LOGOUT
} from "../_actions/types";

function user_reducer(state = {}, action){

    switch(action.type) {

        case LOGIN_USER : 
            return { ...state, loginSuccess : action.payload} //...state는 아무것도 없는 상태
            break;
        
        case REGISTER_USER : 
            return { ...state, register : action.payload}
            break;

        case AUTH_USER : 
            return { ...state, userData : action.payload}
            break;

        case LOGOUT : 
            return { ...state, userData : action.payload}
            break;

        default :
            return state;
    }
}

export default user_reducer