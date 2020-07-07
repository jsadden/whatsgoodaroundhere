import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getRestaurants,} from '../store/actions/restaurant_actions'
import {getMenuItems, clearMenuItems} from '../store/actions/menuItem_actions'


class SearchBar extends Component {

    state = { 
        searchcity: '',
        searchrestaurant: '',
        searchaddress: '',
        searchItem: '',
        searchType: ''
    }
    
    ///////////////////////////////////////
    //clear items from store on mount
    ///////////////////////////////////////
    componentDidMount() {
        this.props.dispatch(clearMenuItems())
    }

    ///////////////////////////////////////
    //search the database based on the values entered in the form
    ///////////////////////////////////////
    handleQueryChange() {

        if (this.state.searchcity !== '') {
            const query = {
                name: this.state.searchrestaurant.trim(),
                city: this.state.searchcity.trim(),
                address: this.state.searchaddress.trim(),
                typeTags: this.state.searchType.trim()
            }
            const itemQuery = {
                name: this.state.searchItem.trim(),
                restaurant: this.state.searchrestaurant.trim(),
                typeTags: this.state.searchType.trim()
            }
            this.props.dispatch(getRestaurants(query))
            this.props.dispatch(getMenuItems(itemQuery))
            
        }
    }

    render() {
        return (
            <div className='searchbar-container'>
                <h2>
                    Where are you?
                </h2>
                <div>
                    <input
                        type='text'
                        name='city'
                        placeholder='Enter a city (we need this first)'
                        className='half-width-input'
                        onChange={event => this.setState({searchcity: event.target.value}, () => {this.handleQueryChange()})}
                    />
                </div>
                

                <h2>
                    What are you craving?
                </h2>
                <div>
                    <input
                        type='text'
                        name='type'
                        placeholder='Indian, Chinese, etc..'
                        className='half-width-input'
                        onChange={event => this.setState({searchType: event.target.value}, () => {this.handleQueryChange()})}
                    />
                </div>
                


                <h2>
                    Any specifics?
                </h2>
                    
                <div>
                    <input
                        type='text'
                        name='item'
                        placeholder='Enter a dish'
                        className='half-width-input'
                        onChange={event => this.setState({searchItem: event.target.value}, () => {this.handleQueryChange()})}
                    />
                </div>

                <div>
                    <input
                        type='text'
                        name='restaurant'
                        placeholder='Enter a restaurant'
                        className='half-width-input'
                        onChange={event => this.setState({searchrestaurant: event.target.value}, () => {this.handleQueryChange()})}
                    />
                </div>
                

                <div>
                    <input
                        type='text'
                        name='address'
                        placeholder='Enter an address'
                        className='half-width-input'
                        onChange={event => this.setState({searchaddress: event.target.value}, () => {this.handleQueryChange()})}
                    />
                </div>
                    

            </div>
        )
    }
}

function mapStateToProps(storeState) {
    
    return {
        items: storeState.menuItem,
        restaurant: storeState.restaurant
    }
}

export default connect(mapStateToProps)(SearchBar)