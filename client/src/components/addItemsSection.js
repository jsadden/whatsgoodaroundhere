import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Formik} from 'formik'
import * as Yup from 'yup'

//actions from store
import {addRestaurant} from '../store/actions/restaurant_actions'
import {addMenuItem} from '../store/actions/menuItem_actions'

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


class AddItemsSection extends Component {

    state = {
        openRestaurant: false,
        openMenuItem: false,
        addRestaurantFailed: false,
        addRestaurantSucceeded: null,
        addItemFailed: false,
        addItemSucceeded: null
    }

    ///////////////////////////////////////
    //restaurant form to submit for admin review
    ///////////////////////////////////////
    renderRestaurantForm() {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: '',
                    address: '',
                    city: '',
                    postCode: '',
                    typeTags: ''
                }}
                validationSchema={restaurantSchema}

                onSubmit={(values, {resetForm}) => {
                    values.name = values.name.trim()
                    values.address = values.address.trim()
                    values.city = values.city.trim()
                    values.postCode = values.postCode.trim()
                    values.typeTags = values.typeTags.trim()

                    this.props.dispatch(addRestaurant(values)).then(response => {

                        if (!this.props.restaurant.success) {
                            this.setState({addRestaurantFailed: true})
                        } else {
                            this.setState({addRestaurantFailed: false, addRestaurantSucceeded: true})
                            resetForm()
                            setTimeout(() => {
                                this.setState({addRestaurantSucceeded: null})
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
                                type='text'
                                name='name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name || ''}
                                placeholder='Enter the restaurant name'
                                className='additems-input'
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
                                className='additems-input'
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
                                className='additems-input'
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
                                className='additems-input'
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
                                placeholder='Type of food (Chinese, Indian, etc..)'
                                className='additems-input'
                            />
                        </div>
                        {errors.typeTags && touched.typeTags ? 
                            <div className='errormessage'>
                                {errors.typeTags}
                            </div>
                        :null}


                        <button type='submit'>
                            Submit
                        </button>

                        {this.state.addRestaurantFailed ? 
                            <div className='errormessage'>
                                {this.props.restaurant.message}
                            </div>
                        :null}
                        {this.state.addRestaurantSucceeded ? 
                            <div>
                                Submitted for approval
                            </div>
                        :null}
                    </form>
                )}
            </Formik>
        )
    }

    ///////////////////////////////////////
    //menu item form to submit for admin review
    ///////////////////////////////////////
    renderItemForm() {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={{
                    name: '',
                    restaurant: '',
                    typeTags: ''
                }}
                validationSchema={itemSchema}

                onSubmit={(values, {resetForm}) => {
                    values.name = values.name.trim()
                    values.restaurant = values.restaurant.trim()
                    values.typeTags = values.typeTags.trim()

                    this.props.dispatch(addMenuItem(values)).then(response => {

                        if (!this.props.item.success) {
                            this.setState({addItemFailed: true})
                        } else {
                            this.setState({addItemFailed: false, addItemSucceeded: true})
                            resetForm()
                            setTimeout(() => {
                                this.setState({addItemSucceeded: null})
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
                                type='text'
                                name='name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name || ''}
                                placeholder='Enter the item name'
                                className='additems-input'
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
                                className='additems-input'
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
                                placeholder='Type of food (Chinese, Indian, etc..)'
                                className='additems-input'
                            />
                        </div>
                        {errors.typeTags && touched.typeTags ? 
                            <div className='errormessage'>
                                {errors.typeTags}
                            </div>
                        :null}


                        <button type='submit'>
                            Submit
                        </button>

                        {this.state.addItemFailed ? 
                            <div className='errormessage'>
                                {this.props.item.message}
                            </div>
                        :null}
                        {this.state.addItemSucceeded ? 
                            <div>
                                Submitted for approval
                            </div>
                        :null}
                    </form>
                )}
            </Formik>
        )
    }

    
    render() {
        if (this.props.user.auth) {
            return (
                <div className='additemssection-container'>
                    <h2>
                        Can't find what you're looking for?
                    </h2>
                    
                    <div className='button-item'>
                        <button onClick={() => this.setState({openRestaurant: !this.state.openRestaurant, openMenuItem: false})}>
                            Add restaurant
                        </button>
                        <button onClick={() => this.setState({openMenuItem: !this.state.openMenuItem, openRestaurant: false})}>
                            Add menu item
                        </button>
                    </div>
                    {this.state.openRestaurant ? 
                        this.renderRestaurantForm()
                    : null}

                    {this.state.openMenuItem ? 
                        this.renderItemForm()
                    : null}
                </div>
            )
        }

        return (
            <div className='additemssection-container'>
                <h2>
                    Can't find what you're looking for?
                </h2>
                    
                    <div>
                        <h3>
                            Log in to add restaurants and menu items
                        </h3>
                        <Link to={{pathname:'/login', formSelect:false}}>
                            <button>
                                Log in
                            </button>
                        </Link>
                    </div>
                    
            </div>
        )
    }
}


function mapStateToProps(storeState) {
    return {
        item: storeState.menuItem,
        restaurant: storeState.restaurant,
        user: storeState.user
    }
}


export default connect(mapStateToProps)(AddItemsSection)