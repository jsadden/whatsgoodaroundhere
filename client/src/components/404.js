import React, { Component } from 'react'

class NotFound extends Component {
    
    ///////////////////////////////////////
    //404 page
    ///////////////////////////////////////
    render(){
        return(
            <div className='not-found-container'>
                <h1 className='not-found-message'>
                   404
                </h1>
                <h2>
                    We don't know what you were looking for!
                </h2>
            </div>
        )
    }
}


export default NotFound