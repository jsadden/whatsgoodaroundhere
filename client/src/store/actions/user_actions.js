import axios from 'axios'
import {USER_LOGIN, USER_LOGOUT, USER_CHANGEPASS, USER_REGISTER, USER_AUTH, USER_ADD_RECOMMEND, USER_DELETE_RECOMMEND} from '../types'

////////////////////
//actions called from front end
//see user router for request payload definitions
//see user reducer for what is to be sent in store state
////////////////////
export function loginUser({email, password}) {
    const request = axios.post('/api/users/login', {email, password}).then(
        response => response.data
    )

    return {
        type: USER_LOGIN,
        payload: request
    }
}


export function logoutUser() {
    const request = axios.get('/api/users/logout').then(
        response => response.data
    )

    return {
        type: USER_LOGOUT,
        payload: request
    }
}


export function changeUserPassword({password, newPassword}) {
    const request = axios.post('/api/users/passwordchange', {password, newPassword}).then(
        response => response.data
    )

    return {
        type: USER_CHANGEPASS,
        payload: request
    }
}


export function registerUser({email, password, confirmPassword, username}) {
    const request = axios.post('/api/users/register', {email, password, username}).then(
        response => response.data
    )

    return {
        type: USER_REGISTER,
        payload: request
    }
}

export function authenticateUser() {
    const request = axios.get('/api/users/auth').then(
        response => response.data
    )

    return {
        type: USER_AUTH,
        payload: request
    }
}


export function addRecommendation({recommendation}) {
    const request = axios.post('/api/users/recommended', {recommendation}).then(
        response => response.data
    )

    return {
        type: USER_ADD_RECOMMEND,
        payload: request
    }
}

export function deleteRecommendation({recommendation}) {
    const request = axios.patch('/api/users/recommended', {recommendation}).then(
        response => response.data
    )

    return {
        type: USER_DELETE_RECOMMEND,
        payload: request
    }
}