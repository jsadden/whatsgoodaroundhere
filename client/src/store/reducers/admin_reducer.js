import {ADMIN_AUTH, ADMIN_CHANGEPASS, ADMIN_LOGIN, ADMIN_LOGOUT} from '../types'

//what is to be sent in store state per type of action

export default function(state = {}, action) {
    switch (action.type) {
        case ADMIN_LOGIN:
            return {
                ...state,
                auth: action.payload.auth,
                message: action.payload.message,
                adminData: action.payload.adminData
            }
        case ADMIN_LOGOUT:
            return {
                ...state,
                auth: action.payload.auth,
                message: action.payload.message,
                adminData: false
            }
        case ADMIN_CHANGEPASS:
            return {
                ...state,
                message: action.payload.message,
                success: action.payload.success
            }
        case ADMIN_AUTH:
            return {
                ...state,
                auth: action.payload.auth ? action.payload.auth : false,
                adminData: action.payload.adminData ? action.payload.adminData: false
            }
        default:
            return state
    }
}



