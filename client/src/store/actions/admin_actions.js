import axios from 'axios'
import {ADMIN_AUTH, ADMIN_CHANGEPASS, ADMIN_LOGIN, ADMIN_LOGOUT} from '../types'

////////////////////
//actions called from front end
//see admin router for request payload definitions
//see admin reducer for what is to be sent in store state
////////////////////
export function loginAdmin({email, password}) {
    const request = axios.post('/api/admins/login', {email, password}).then(
        response => response.data
    )

    return {
        type: ADMIN_LOGIN,
        payload: request
    }
}


export function logoutAdmin() {
    const request = axios.get('/api/admins/logout').then(
        response => response.data
    )

    return {
        type: ADMIN_LOGOUT,
        payload: request
    }
}


export function changeAdminPassword({password, newPassword}) {
    const request = axios.post('/api/admins/passwordchange', {password, newPassword}).then(
        response => response.data
    )

    return {
        type: ADMIN_CHANGEPASS,
        payload: request
    }
}


export function authenticateAdmin() {
    const request = axios.get('/api/admins/auth').then(
        response => response.data
    )

    return {
        type: ADMIN_AUTH,
        payload: request
    }
}