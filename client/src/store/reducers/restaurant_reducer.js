import {RESTAURANT_ADD, 
    RESTAURANT_GET, 
    RESTAURANT_GET_BY_ADDRESS, 
    RESTAURANT_GET_BY_CITY, 
    RESTAURANT_GET_BY_NAME, 
    RESTAURANT_GET_BY_POSTCODE, 
    RESTAURANT_GET_UNIQUE, 
    RESTAURANT_APPROVE, 
    RESTAURANT_CLEAR, 
    RESTAURANT_GET_PENDING,
    RESTAURANT_REJECT,
    RESTAURANT_APPROVE_EDITS} from '../types'

//what is to be sent in store state per type of action

export default function (state = {}, action) {
    switch (action.type) {
        case RESTAURANT_ADD:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }

        case RESTAURANT_GET_BY_NAME: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurants: action.payload.restaurants
            }

        case RESTAURANT_GET_BY_ADDRESS: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurants: action.payload.restaurants
            }

        case RESTAURANT_GET_BY_POSTCODE: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurants: action.payload.restaurants
            }

        case RESTAURANT_GET_BY_CITY: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurants: action.payload.restaurants
            }

        case RESTAURANT_GET_UNIQUE: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurant: action.payload.restaurant
            }
        
        case RESTAURANT_GET: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurant: action.payload.restaurant
            }

        case RESTAURANT_APPROVE: 
            
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }
        
       case RESTAURANT_APPROVE_EDITS: 
            
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }     

        case RESTAURANT_REJECT: 
            
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }


        case RESTAURANT_CLEAR:
            return {
                ...state,
                message: action.payload.message,
                restaurant: []    
            }

        case RESTAURANT_GET_PENDING: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                restaurant: action.payload.restaurant
            }

        default:
            return state
    }
}