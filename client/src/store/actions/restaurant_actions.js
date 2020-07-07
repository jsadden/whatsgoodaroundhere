import axios from 'axios'
import {RESTAURANT_ADD, 
        RESTAURANT_GET, 
        RESTAURANT_GET_BY_NAME, 
        RESTAURANT_GET_BY_ADDRESS, 
        RESTAURANT_GET_BY_CITY, 
        RESTAURANT_GET_BY_POSTCODE, 
        RESTAURANT_GET_UNIQUE, 
        RESTAURANT_APPROVE, 
        RESTAURANT_CLEAR, 
        RESTAURANT_GET_PENDING,
        RESTAURANT_REJECT,
        RESTAURANT_APPROVE_EDITS} from '../types'

////////////////////
//actions called from front end
//see restaurant router for request payload definitions
//see restaurant reducer for what is to be sent in store state
////////////////////

export function addRestaurant({name, address, city, postCode, typeTags}) {
    const uniqueIdentifier = name + ' ' + address + ' ' + city
    let myTags = typeTags.split(',')
    myTags = myTags.map(tag => tag.trim())

    const request = axios.post('/api/restaurants/addRestaurant', {name, address, city, postCode, typeTags: myTags, uniqueIdentifier}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_ADD,
        payload: request
    }
}



export function getRestaurantsByName({name}) {

    const request = axios.get('/api/restaurants/getByName', {params: { name }}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_BY_NAME,
        payload: request
    }
}


export function getRestaurantsByAddress({address}) {
    const request = axios.get('/api/restaurants/getByAddress', {params: {address}}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_BY_ADDRESS,
        payload: request
    }
}


export function getRestaurantsByPostCode({postCode}) {
    const request = axios.get('/api/restaurants/getByPostCode', {params: {postCode}}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_BY_POSTCODE,
        payload: request
    }
}


export function getRestaurantsByCity({city}) {
    const request = axios.get('/api/restaurants/getByCity', {params: {city}}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_BY_CITY,
        payload: request
    }
}



export function getRestaurant({name, address, city}) {
    const request = axios.get('/api/restaurants/getUnique', {params: {name, address, city}}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_UNIQUE,
        payload: request
    }
}

export function getRestaurants({name, address, city, typeTags}) {
    const request = axios.get('/api/restaurants/getRestaurants', {params: {name, address, city, typeTags}}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET,
        payload: request
    }
}


export function approveRestaurant({_id}) {
    
    const request = axios.post('/api/restaurants/approveRestaurant', {_id}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_APPROVE,
        payload: request
    }
}

export function approveRestaurantEdits({name, address, city, postCode, typeTags, _id}) {

    const uniqueIdentifier = name + ' ' + address + ' ' + city
    let myTags = typeTags.split(',')
    myTags = myTags.map(tag => tag.trim())

    const request = axios.patch('/api/restaurants/approveRestaurant', {name, address, city, postCode, typeTags: myTags, uniqueIdentifier, _id}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_APPROVE_EDITS,
        payload: request
    }
}

export function rejectRestaurant({_id}) {
    
    const request = axios.post('/api/restaurants/rejectRestaurant', {_id}).then(
        response => response.data
    )

    return {
        type: RESTAURANT_REJECT,
        payload: request
    }
}

export function clearRestaurants() {
    
    const request = {
        message: 'Restaurants cleared from store',
    }
    
    return {
        type: RESTAURANT_CLEAR,
        payload: request
    }
}



export function getPendingRestaurants() {

    const request = axios.get('/api/restaurants/getPendingRestaurants').then(
        response => response.data
    )

    return {
        type: RESTAURANT_GET_PENDING,
        payload: request
    }
}