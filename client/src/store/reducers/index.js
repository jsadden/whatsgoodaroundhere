import {combineReducers} from 'redux'
import user from './user_reducer'
import restaurant from './restaurant_reducer'
import menuItem from './menuItem_reducer'
import admin from './admin_reducer'

const rootReducer = combineReducers({
    user,
    restaurant,
    menuItem,
    admin
})

export default rootReducer;