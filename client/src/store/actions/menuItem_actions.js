import axios from 'axios'
import {MENUITEM_ADD, 
        MENUITEM_INCREMENT,
        MENUITEM_GET_ONE, 
        MENUITEM_GET_BY_NAME, 
        MENUITEM_GET_BY_RESTUARANT, 
        MENUITEM_GET_BY_UNIQUE, 
        MENUITEM_DECREMENT, 
        MENUITEM_APPROVE, 
        MENUITEM_GET_BY_ID, 
        MENUITEM_CLEAR, 
        MENUITEM_GET_PENDING,
        MENUITEM_REJECT,
        MENUITEM_APPROVE_EDITS} from '../types'

////////////////////
//actions called from front end
//see menuItem router for request payload definitions
//see menuItem reducer for what is to be sent in store state
////////////////////

export function addMenuItem({name, restaurant, typeTags}) {
    const recommendations = 0
    const uniqueIdentifier = name + ' ' + restaurant
    let myTags = typeTags.split(',')
    myTags = myTags.map(tag => tag.trim())

    const request = axios.post('/api/menuItems/item', {name, restaurant, recommendations, typeTags: myTags, uniqueIdentifier}).then(
        response => response.data
    )

    return {
        type: MENUITEM_ADD,
        payload: request
    }
}

export function incrementMenuItem({name, restaurant}) {
    const request = axios.patch('/api/menuItems/item', {name, restaurant, increment: 1}).then(
        response => response.data
    )

    return {
        type: MENUITEM_INCREMENT,
        payload: request
    }
}

export function decrementMenuItem({name, restaurant}) {
    const request = axios.patch('/api/menuItems/item', {name, restaurant, increment: -1}).then(
        response => response.data
    )

    return {
        type: MENUITEM_DECREMENT,
        payload: request
    }
}


export function getMenuItem({name, restaurant}) {
    const request = axios.get('/api/menuItems/item', {params: {name, restaurant}}).then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_ONE,
        payload: request
    }
}


export function getMenuItemsByRestaurant({restaurant}) {
    const request = axios.get('/api/menuItems/getByRestaurant', {params: {restaurant}}).then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_BY_RESTUARANT,
        payload: request
    }
}

export function getMenuItemsByName({name}) {
    const request = axios.get('/api/menuItems/getByName', {params: {name}}).then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_BY_NAME,
        payload: request
    }
}


export function getMenuItems({name, restaurant, typeTags}) {
    const request = axios.get('/api/menuItems/getByUnique', {params: {name, restaurant, typeTags}}).then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_BY_UNIQUE,
        payload: request
    }
}

export function approveMenuItem({_id}) {
    
    const request = axios.post('/api/menuItems/approveItem', {_id}).then(
        response => response.data
    )

    return {
        type: MENUITEM_APPROVE,
        payload: request
    }
}

export function approveMenuItemEdits({name, restaurant, typeTags, _id}) {
    
    const recommendations = 0
    const uniqueIdentifier = name + ' ' + restaurant
    let myTags = typeTags.split(',')
    myTags = myTags.map(tag => tag.trim())

    const request = axios.patch('/api/menuItems/approveItem', {name, restaurant, recommendations, typeTags: myTags, uniqueIdentifier, _id}).then(
        response => response.data
    )

    return {
        type: MENUITEM_APPROVE_EDITS,
        payload: request
    }
}

export function rejectMenuItem({_id}) {
    
    const request = axios.post('/api/menuItems/rejectItem', {_id}).then(
        response => response.data
    )

    return {
        type: MENUITEM_REJECT,
        payload: request
    }
}

export function getMenuItemsById({_id}) {
    
    const request = axios.get('/api/menuItems/getById', {params: {_id}}).then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_BY_ID,
        payload: request
    }
}

export function clearMenuItems() {
    
    const request = {
        message: 'Menu items cleared from store',
    }
    
    return {
        type: MENUITEM_CLEAR,
        payload: request
    }
}

export function getPendingItems() {

    const request = axios.get('/api/menuItems/getPendingItems').then(
        response => response.data
    )

    return {
        type: MENUITEM_GET_PENDING,
        payload: request
    }
}