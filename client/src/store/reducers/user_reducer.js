import {USER_LOGIN, USER_LOGOUT, USER_CHANGEPASS, USER_REGISTER, USER_AUTH, USER_ADD_RECOMMEND, USER_DELETE_RECOMMEND} from '../types'

//what is to be sent in store state per type of action

export default function(state = {}, action) {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                auth: action.payload.auth,
                message: action.payload.message,
                userData: action.payload.userData
            }
        case USER_LOGOUT:
            return {
                ...state,
                auth: action.payload.auth,
                message: action.payload.message,
                userData: false
            }
        case USER_CHANGEPASS:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }
        case USER_REGISTER:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }
        case USER_AUTH:
            return {
                ...state,
                auth: action.payload.auth ? action.payload.auth : false,
                userData: action.payload.userData ? action.payload.userData: false,
                recommended: action.payload.recommended
            }
        case USER_ADD_RECOMMEND:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                recommended: action.payload.user.recommended
            }
        case USER_DELETE_RECOMMEND:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                recommended: action.payload.user.recommended
            }

        default:
            return state
    }
}