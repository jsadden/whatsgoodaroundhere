import {MENUITEM_ADD, 
        MENUITEM_GET_ONE, 
        MENUITEM_INCREMENT, 
        MENUITEM_DECREMENT, 
        MENUITEM_GET_BY_NAME, 
        MENUITEM_GET_BY_RESTUARANT, 
        MENUITEM_GET_BY_UNIQUE, 
        MENUITEM_APPROVE, 
        MENUITEM_GET_BY_ID, 
        MENUITEM_CLEAR, 
        MENUITEM_GET_PENDING,
        MENUITEM_REJECT,
        MENUITEM_APPROVE_EDITS} from '../types'

//what is to be sent in store state per type of action

export default function(state={}, action) {
    switch (action.type) {
        case MENUITEM_ADD:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }

        case MENUITEM_INCREMENT:
            const incremented_index = state.item.findIndex(item => item._id === action.payload.item._id)

            let incrementedItemList = state.item

            if (incremented_index > -1) {
                incrementedItemList = [...state.item.slice(0,incremented_index),
                                    action.payload.item,
                                    ...state.item.slice(incremented_index+1)]
            }
            

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: incrementedItemList
            }

        case MENUITEM_DECREMENT:
            const decremented_index = state.item.findIndex(item => item._id === action.payload.item._id)

            let decrementedItemList = state.item

            if (decremented_index > -1) {
                decrementedItemList = [...state.item.slice(0,decremented_index),
                                    action.payload.item,
                                    ...state.item.slice(decremented_index+1)]
            }
            

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: decrementedItemList
            }
            

        case MENUITEM_GET_ONE:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: action.payload.item
            }

        case MENUITEM_GET_BY_RESTUARANT:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: action.payload.item
            }

        case MENUITEM_GET_BY_NAME:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: action.payload.item
            }

        case MENUITEM_GET_BY_UNIQUE:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: action.payload.item
            }


        case MENUITEM_GET_BY_ID:

            let items_by_id = []
            
            if (state.item) {
                items_by_id = [...state.item, ...action.payload.item]
            } else {
                items_by_id = action.payload.item
            }
            

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                item: items_by_id
            }

        
        case MENUITEM_APPROVE:

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }
        
        case MENUITEM_APPROVE_EDITS:

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }

        case MENUITEM_REJECT:

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }

        case MENUITEM_CLEAR:
            return {
                ...state,
                message: action.payload.message,
                item: []
            }

        case MENUITEM_GET_PENDING:
        return {
            ...state,
            success: action.payload.success,
            message: action.payload.message,
            item: action.payload.item
        }

        default:
            return state
    }
}




