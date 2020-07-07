import React, { Component } from 'react'
import {connect} from 'react-redux'

//actions from store
import {incrementMenuItem, decrementMenuItem} from '../store/actions/menuItem_actions'
import {addRecommendation, deleteRecommendation} from '../store/actions/user_actions'


class Feed extends Component {

    ///////////////////////////////////////
    //called when a user recommends an item -- increments number in database
    ///////////////////////////////////////
    handleRecommend(item) {
        const itemQuery = {
            name: item.name,
            restaurant: item.restaurant
        }
        this.props.dispatch(addRecommendation({recommendation: item._id})).then(response => {
                if (this.props.user.success) {
                    this.props.dispatch(incrementMenuItem(itemQuery))
                }
        })
    }

    ///////////////////////////////////////
    //called when a user unrecommends an item -- decrement number in database
    ///////////////////////////////////////
    handleUnrecommend(item) {
        const itemQuery = {
            name: item.name,
            restaurant: item.restaurant
        }
        this.props.dispatch(deleteRecommendation({recommendation: item._id})).then(response => {
                if (this.props.user.success) {
                    this.props.dispatch(decrementMenuItem(itemQuery))
                }
        })
    }

    render(){
        return(
            <div className='feed-container'>
                <h2 className='feed-title'>
                    Here's what we found:
                </h2>
                

                {this.props.items.item && this.props.items.item !== undefined ?
                    
                    //show the menu item cards sorted by recommendations
                    this.props.items.item.sort(function(a,b){return b.recommendations - a.recommendations}).map((item, i) => {
                        return (
                            <div key = {i} className='feed-result-card'>
                                <div className='feed-result-card-titles'>
                                    <div className='feed-result-card-item'>
                                        {item.name}
                                    </div>
                                    <div>
                                        {item.restaurant}
                                    </div>
                                    <div>
                                        Recommendations: {item.recommendations}
                                    </div>
                                </div>
                                {this.props.user.auth ? 
                                    this.props.user.recommended && this.props.user.recommended.includes(item._id) ? 
                                        <div className='feed-result-card-button'>
                                            <button 
                                                onClick={() => this.handleUnrecommend(item)} 
                                            >
                                                I Take it Back
                                            </button>
                                        </div>
                                        
                                    :
                                        <div className='feed-result-card-button'>
                                            <button 
                                                onClick={() => this.handleRecommend(item)} 
                                            >
                                                This is Good
                                            </button>
                                        </div>
                                :null}

                            </div>
                        )
                    })
                
               :null}
                
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        user: storeState.user,
        items : storeState.menuItem
    }
}

export default connect(mapStateToProps)(Feed)