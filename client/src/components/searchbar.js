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
        searchType: '',
        uniqueRestaurants: []
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
    handleRestaurantQueryChange(sentByItemField) {

        //city must be entered
        if (this.state.searchcity !== '') {

            //build a query for the restaurants -- note that name expects an array
            const query = {
                name: [this.state.searchrestaurant.trim()],
                city: this.state.searchcity.trim(),
                address: this.state.searchaddress.trim(),

            }
            
            //get matching restaurants based on query
            this.props.dispatch(getRestaurants(query)).then(response => {

                //if there are restaurants found
                if (this.props.restaurant.success && this.props.restaurant.restaurant) {
                    
                    //get the unique restaurant name values
                    let uniqueRestaurants = [...new Set(this.props.restaurant.restaurant.map(restaurant => restaurant.name))]

                    //build item query using form values and the uniquely returned restaurants
                    const itemQuery = {
                        name: this.state.searchItem.trim(),
                        restaurant: uniqueRestaurants,
                        typeTags: this.state.searchType.trim()
                    }
                    
                    //get menu items
                    this.props.dispatch(getMenuItems(itemQuery)).then(response => {

                        //this is for when item or tag changes -- restaurants must be filtered to reflect on the map
                        //if this is not here -- the map can have restaurants not found in the item list
                        if (sentByItemField) {

                            //if items were returned
                            if ( this.props.items.success && this.props.items.item){ 

                                //get unique restaurants based on returned items
                                let uniqueRestaurants = [...new Set(this.props.items.item.map(item => item.restaurant))]
                                
                                //build restaurant query
                                const query = {
                                    name: uniqueRestaurants,
                                    city: this.state.searchcity.trim(),
                                    address: this.state.searchaddress.trim()
                                }

                                //get restaurants again, but filtered
                                this.props.dispatch(getRestaurants(query))

                            }
                        }
                    })
                } else {
                    this.props.dispatch(clearMenuItems())
                }
            })
            
            
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
                        onChange={event => this.setState({searchcity: event.target.value}, () => {this.handleRestaurantQueryChange(false)})}
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
                        onChange={event => this.setState({searchType: event.target.value}, () => {this.handleRestaurantQueryChange(true)})}
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
                        onChange={event => this.setState({searchItem: event.target.value}, () => {this.handleRestaurantQueryChange(true)})}
                    />
                </div>

                <div>
                    <input
                        type='text'
                        name='restaurant'
                        placeholder='Enter a restaurant'
                        className='half-width-input'
                        onChange={event => this.setState({searchrestaurant: event.target.value}, () => {this.handleRestaurantQueryChange(false)})}
                    />
                </div>
                

                <div>
                    <input
                        type='text'
                        name='address'
                        placeholder='Enter an address'
                        className='half-width-input'
                        onChange={event => this.setState({searchaddress: event.target.value}, () => {this.handleRestaurantQueryChange(false)})}
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