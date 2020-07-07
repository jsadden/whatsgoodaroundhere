import React, { Component } from 'react'
import {connect} from 'react-redux'
import {clearMenuItems, getPendingItems, approveMenuItem, rejectMenuItem, approveMenuItemEdits} from '../../store/actions/menuItem_actions'
import {clearRestaurants, getPendingRestaurants, approveRestaurant, rejectRestaurant, approveRestaurantEdits} from '../../store/actions/restaurant_actions'
import {changeAdminPassword} from '../../store/actions/admin_actions'
import {Formik} from 'formik'
import * as Yup from 'yup'


//validation schema for submitting a restaurant
const restaurantSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a name'),
    address: Yup.string().required('Please enter an address'),
    city: Yup.string().required('Please enter a city'),
    postCode: Yup.string().required('Please enter a post code'),
    typeTags: Yup.string()
})


//validation schema for submitting a menu item
const itemSchema = Yup.object().shape({
    name: Yup.string().required('Please enter a name'),
    restaurant: Yup.string().required('Please enter a restaurant'),
    typeTags: Yup.string()
})

//validation schema for changeing a password
const passwordChangeSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password'),
    newPassword: Yup.string().min(8, 'New password must be at least 8 characters long').required('Please enter a new password'),
})


class AdminHome extends Component {

    state = {
        loadingComplete: false,
        restaurantApproved: null,
        restaurantApprovedId: null,
        itemApproved: null,
        itemApprovedId: null,
        restaurantRejected: null,
        restaurantRejectedId: null,
        itemRejected: null,
        itemRejectedId: null,
        openRestaurantEditor: false,
        editingRestaurant: null,
        openItemEditor: false,
        editingItem: null,
        openPasswordForm: false,
        changePassSucceeded: null,
        changePassFailed: false
    }

    ///////////////////////////////////////
    //get list of recommended items on mount
    ///////////////////////////////////////
    componentDidMount() {

        this.props.dispatch(clearMenuItems())
        this.props.dispatch(clearRestaurants())

        this.props.dispatch(getPendingRestaurants())
        this.props.dispatch(getPendingItems())

        this.setState({loadingComplete: true})
    }

    ///////////////////////////////////////
    //edit restaurants before approval
    ///////////////////////////////////////
    renderRestaurantEditor(restaurant) {
        let typeTagsString = restaurant.typeTags.join(', ')

        return (
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: restaurant.name,
                    address: restaurant.address,
                    city: restaurant.city,
                    postCode: restaurant.postCode,
                    typeTags: typeTagsString
                }}
                validationSchema={restaurantSchema}

                onSubmit={(values) => {
                    values.name = values.name.trim()
                    values.address = values.address.trim()
                    values.city = values.city.trim()
                    values.postCode = values.postCode.trim()
                    values.typeTags = values.typeTags.trim()
                    values._id = restaurant._id

                    this.props.dispatch(approveRestaurantEdits(values)).then(response => {
                        
                        //if restaurant was successfully approved, close editor and update store
                        if (this.props.restaurants.success) {
                            
                            this.setState({restaurantApproved: true, restaurantApprovedId: restaurant._id})
                            setTimeout(() => {
                                this.setState({restaurantApproved: null, restaurantApprovedId: null, openRestaurantEditor: false, editingRestaurant: null})
                                this.props.dispatch(getPendingRestaurants())
                            }, 2000);

                        } else {
                            this.setState({restaurantApproved: false})
                        }
                    })
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type='text'
                                name='name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name || ''}
                                placeholder='Enter the restaurant name'
                                className='half-width-input'
                            />
                        </div>
                        {errors.name && touched.name ? 
                            <div className='errormessage'>
                                {errors.name}
                            </div>
                        :null}


                        <div>
                            <input
                                type='text'
                                name='address'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address || ''}
                                placeholder='Enter the address'
                                className='half-width-input'
                            />
                        </div>
                        {errors.address && touched.address ? 
                            <div className='errormessage'>
                                {errors.address}
                            </div>
                        :null}


                        <div>
                            <input
                                type='text'
                                name='city'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.city || ''}
                                placeholder='Enter the city'
                                className='half-width-input'
                            />
                        </div>
                        {errors.city && touched.city ? 
                            <div className='errormessage'>
                                {errors.city}
                            </div>
                        :null}


                        <div>
                            <input
                                type='text'
                                name='postCode'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.postCode || ''}
                                placeholder='Enter the postal code'
                                className='half-width-input'
                            />
                        </div>
                        {errors.postCode && touched.postCode ? 
                            <div className='errormessage'>
                                {errors.postCode}
                            </div>
                        :null}

                        <div>
                            <input
                                type='text'
                                name='typeTags'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.typeTags || ''}
                                placeholder='Enter a comma-seperated list of tags'
                                className='half-width-input'
                            />
                        </div>
                        {errors.typeTags && touched.typeTags ? 
                            <div className='errormessage'>
                                {errors.typeTags}
                            </div>
                        :null}


                        <button type='submit'>
                            Approve with edits
                        </button>

                        {this.state.restaurantApproved !== null ? 
                            <div>
                                {this.props.restaurants.message}
                            </div>
                        :null}
                        
                    </form>
                )}
            </Formik>
        )
    }

    ///////////////////////////////////////
    //edit menu items before approval
    ///////////////////////////////////////
    renderItemEditor(item) {
        let typeTagsString = item.typeTags.join(', ')

        return (
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: item.name,
                    restaurant: item.restaurant,
                    typeTags: typeTagsString
                }}
                validationSchema={itemSchema}

                onSubmit={(values) => {
                    values.name = values.name.trim()
                    values.restaurant = values.restaurant.trim()
                    values.typeTags = values.typeTags.trim()
                    values._id = item._id
                    
                    this.props.dispatch(approveMenuItemEdits(values)).then(response => {

                        //if menu item successfully approved, close editor and update
                        if (this.props.items.success) {

                            this.setState({itemApproved: true, itemApprovedId: item._id})
                            setTimeout(() => {
                                this.setState({itemApproved: null, itemApprovedId: null, openItemEditor: false, editingItem: null})
                                this.props.dispatch(getPendingItems())
                            }, 2000)

                        } else {
                            this.setState({itemApproved: true})
                        }
                    })
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type='text'
                                name='name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name || ''}
                                placeholder='Enter the item name'
                                className='half-width-input'
                            />
                        </div>
                        {errors.name && touched.name ? 
                            <div className='errormessage'>
                                {errors.name}
                            </div>
                        :null}


                        <div>
                            <input
                                type='text'
                                name='restaurant'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.restaurant || ''}
                                placeholder='Enter the restaurant'
                                className='half-width-input'
                            />
                        </div>
                        {errors.restaurant && touched.restaurant ? 
                            <div className='errormessage'>
                                {errors.restaurant}
                            </div>
                        :null}

                        <div>
                            <input
                                type='text'
                                name='typeTags'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.typeTags || ''}
                                placeholder='Enter a comma-seperated list of tags'
                                className='half-width-input'
                            />
                        </div>
                        {errors.typeTags && touched.typeTags ? 
                            <div className='errormessage'>
                                {errors.typeTags}
                            </div>
                        :null}


                        <button type='submit'>
                            Approve with edits
                        </button>

                        {this.state.itemApproved !== null ? 
                            <div>
                                {this.props.items.message}
                            </div>
                        :null}
                        
                    </form>
                )}
            </Formik>
        )
    }

    ///////////////////////////////////////
    //handle restaurant approval
    ///////////////////////////////////////
    handleRestaurantApproval(restaurant) {
        let query = {
            _id: restaurant._id
        }
        this.props.dispatch(approveRestaurant(query)).then(response => {

            //if successful, close the editor if it is open
            if (this.props.restaurants.success) {

                this.setState({restaurantApproved: true, restaurantApprovedId: restaurant._id})
                setTimeout(() => {
                    this.setState({restaurantApproved: null, restaurantApprovedId: null, editingRestaurant: null, openRestaurantEditor: false})
                    this.props.dispatch(getPendingRestaurants())
                }, 2000)

            } else {
                
                this.setState({restaurantApproved: false})

            }
        })
    }

    ///////////////////////////////////////
    //handle item approval
    ///////////////////////////////////////
    handleItemApproval(item) {
        let query = {
            _id: item._id
        }
        this.props.dispatch(approveMenuItem(query)).then(response => {

            //if successful, close the editor if it is open
            if (this.props.items.success) {

                this.setState({itemApproved: true, itemApprovedId: item._id})
                setTimeout(() => {
                    this.setState({itemApproved: null, itemApprovedId: null, editingItem: null, openItemEditor: false})
                    this.props.dispatch(getPendingItems())
                }, 2000)

            } else {
                
                this.setState({itemApproved: false})

            }
        })
    }

    ///////////////////////////////////////
    //handle restaurant rejection
    ///////////////////////////////////////
    handleRestaurantRejection(restaurant) {
        let query = {
            _id: restaurant._id
        }
        this.props.dispatch(rejectRestaurant(query)).then(response => {

            //if successful, close editor if it is open
            if (this.props.restaurants.success) {

                this.setState({restaurantRejected: true, restaurantRejectedId: restaurant._id})
                setTimeout(() => {
                    this.setState({restaurantRejected: null, restaurantRejectedId: null, editingRestaurant: null, openRestaurantEditor: false})
                    this.props.dispatch(getPendingRestaurants())
                }, 2000)

            } else {
                
                this.setState({restaurantRejected: false})

            }
        })
    }

    ///////////////////////////////////////
    //handle item rejection
    ///////////////////////////////////////
    handleItemRejection(item) {
        let query = {
            _id: item._id
        }
        this.props.dispatch(rejectMenuItem(query)).then(response => {

            //if successful, close editor if it is open
            if (this.props.items.success) {

                this.setState({itemRejected: true, itemRejectedId: item._id})
                setTimeout(() => {
                    this.setState({itemRejected: null, itemRejectedId: null, editingItem: null, openItemEditor: false})
                    this.props.dispatch(getPendingItems())
                }, 2000)

            } else {
                
                this.setState({itemRejected: false})
            }
        })
    }

    ///////////////////////////////////////
    //render list of pending restaurants
    ///////////////////////////////////////
    renderPendingRestaurants() {

        //check for non-false value in the store 
        if (this.props.restaurants) {

            //check for restaurants returned
            if (this.props.restaurants.restaurant) {

                //return a card for each restaurant with information and action buttons
                return this.props.restaurants.restaurant.map((restaurant, i) => {
                    return (
                        <div key = {i} className='feed-result-card'>
                            <div className='feed-result-card-titles'>
                                <div>
                                    NAME: {restaurant.name}
                                </div>
                                <div>
                                    ADDRESS: {restaurant.address}
                                </div>
                                <div>
                                    CITY: {restaurant.city}
                                </div>
                                <div>
                                    POSTCODE: {restaurant.postCode}
                                </div>
                                <div>
                                    TAGS: {restaurant.typeTags.map((tag,j) => {
                                                return (<div key={j}>
                                                    {tag}
                                                </div>)
                                            })}
                                </div>
                                <div>
                                    SUBMITTED BY: {restaurant.forReview.submittedBy}
                                </div>
                            </div>
                            
                            <div className='admin-buttons-container'>
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => this.handleRestaurantApproval(restaurant)} 
                                    >
                                        Approve
                                    </button>
                                </div>
                                
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => {
                                            if (this.state.editingRestaurant && restaurant._id === this.state.editingRestaurant._id) {
                                                this.setState({openRestaurantEditor: false, editingRestaurant: null})
                                            } else {
                                                this.setState({openRestaurantEditor: true, editingRestaurant: restaurant})
                                            }   
                                        }} 
                                    >
                                        Edit
                                    </button>
                                </div>
                                
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => this.handleRestaurantRejection(restaurant)} 
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                {this.state.restaurantApproved !== null && this.state.restaurantApprovedId === restaurant._id ? 
                                    <div>
                                        {this.props.restaurants.message}
                                    </div>
                                :null}
                                {this.state.restaurantRejected !== null && this.state.restaurantRejectedId === restaurant._id ? 
                                    <div>
                                        {this.props.restaurants.message}
                                    </div>
                                :null}
                            </div>
    
                        </div>
                    )
                })

            } else {
                return (
                    <h3>
                        {this.props.restaurants.message}
                    </h3>
                )
            }
        }
    }

    ///////////////////////////////////////
    //render list of pending items
    ///////////////////////////////////////
    renderPendingItems() {
        
        //check for non-false in props
        if (this.props.items) {

            //check for items array
            if (this.props.items.item) {

                //return card with item information and action buttons
                return this.props.items.item.map((item, i) => {
                    return (
                        <div key = {i} className='feed-result-card'>
                            <div className='feed-result-card-titles'>
                                <div>
                                    NAME: {item.name}
                                </div>
                                <div>
                                    RESTAURANT: {item.restaurant}
                                </div>
                                <div>
                                    TAGS: {item.typeTags.map((tag,j) => {
                                                return (<div key={j}>
                                                    {tag}
                                                </div>)
                                            })}
                                </div>
                                <div>
                                    SUBMITTED BY: {item.forReview.submittedBy}
                                </div>
                            </div>
                            
                            <div className='admin-buttons-container'>
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => this.handleItemApproval(item)} 
                                    >
                                        Approve
                                    </button>
                                </div>
                                
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => {
                                            if (this.state.editingItem && item._id === this.state.editingItem._id) {
                                                this.setState({openItemEditor: false, editingItem: null})
                                            } else {
                                                this.setState({openItemEditor: true, editingItem: item})
                                            }   
                                        }} 
                                    >
                                        Edit
                                    </button>
                                </div>
                                
                                <div className='feed-result-card-button admin-button'>
                                    <button 
                                        onClick={() => this.handleItemRejection(item)} 
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                {this.state.itemApproved !== null && this.state.itemApprovedId === item._id ? 
                                    <div>
                                        {this.props.items.message}
                                    </div>
                                :null}
                                {this.state.itemRejected !== null && this.state.itemRejectedId === item._id ? 
                                    <div>
                                        {this.props.items.message}
                                    </div>
                                :null}
                            </div>
    
                        </div>
                    )
                })

            } else {
                return (
                    <h3>
                        {this.props.items.message}
                    </h3>
                )
            }
        }
    }

    ///////////////////////////////////////
    //form for changing the user's password
    ///////////////////////////////////////
    renderPasswordForm() {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={{
                    password: '',
                    newPassword: '',
                }}
                validationSchema={passwordChangeSchema}

                onSubmit={(values, {resetForm}) => {
                    values.password = values.password.trim()
                    values.newPassword = values.newPassword.trim()

                    this.props.dispatch(changeAdminPassword(values)).then(response => {

                        if (!this.props.admin.success) {
                            this.setState({changePassFailed: true})
                        } else {
                            this.setState({changePassFailed: false, changePassSucceeded: true})
                            resetForm()
                            setTimeout(() => {
                                this.setState({changePassSucceeded: null})
                            }, 3000);
                        }
                    })
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type='password'
                                name='password'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password || ''}
                                placeholder='Enter your password'
                                className='half-width-input'
                            />
                        </div>
                        {errors.password && touched.password ? 
                            <div className='errormessage'>
                                {errors.password}
                            </div>
                        :null}


                        <div>
                            <input
                                type='password'
                                name='newPassword'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newPassword || ''}
                                placeholder='Enter the new password'
                                className='half-width-input'
                            />
                        </div>
                        {errors.newPassword && touched.newPassword ? 
                            <div className='errormessage'>
                                {errors.newPassword}
                            </div>
                        :null}


                        <button type='submit'>
                            Submit
                        </button>

                        {this.state.changePassFailed ? 
                            <div className='errormessage'>
                                {this.props.admin.message}
                            </div>
                        :null}
                        {this.state.changePassSucceeded ? 
                            <div>
                                Password changed successfully
                            </div>
                        :null}
                    </form>
                )}
            </Formik>
        )
    }


    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    render(){
        return(
            <div className='admin-container'>
                <h2 className='admin-title'>
                    Welcome, Admin
                </h2>
                <h2>
                   Restaurants pending approval:
                </h2>
                <div className='admin-restaurant-feed'>
                    {this.state.loadingComplete ?
                        this.renderPendingRestaurants()
                    : null}
                </div>
                
                {this.state.openRestaurantEditor && this.state.editingRestaurant ? 
                    this.renderRestaurantEditor(this.state.editingRestaurant)
                : null}


                <h2>
                   Menu items pending approval:
                </h2>
                <div className='admin-items-feed'>
                {this.state.loadingComplete ? 
                    this.renderPendingItems()
                : null}
                </div>

                {this.state.openItemEditor && this.state.editingItem ? 
                    this.renderItemEditor(this.state.editingItem)
                : null}

                <div className='change-password-container'>
                    <button onClick={() => this.setState({openPasswordForm: !this.state.openPasswordForm})}>
                        Change your password
                    </button>
                </div>

                {this.state.openPasswordForm ? 
                    this.renderPasswordForm()
                :null}
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return { 
        items: storeState.menuItem,
        restaurants: storeState.restaurant,
        admin: storeState.admin
     }
}

export default connect(mapStateToProps)(AdminHome)