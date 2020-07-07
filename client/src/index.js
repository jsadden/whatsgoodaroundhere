import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import promiseMiddleware from 'redux-promise'
import reducers from './store/reducers'
import {composeWithDevTools} from 'redux-devtools-extension'

const createStoreWithMiddleware = createStore(reducers, composeWithDevTools(applyMiddleware(promiseMiddleware)))

ReactDOM.render(
    <Provider store={createStoreWithMiddleware}>
        <Routes/>
    </Provider>
, document.getElementById('root'));

