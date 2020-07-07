import React, { Component } from 'react'
import {connect} from 'react-redux'
import {incrementMenuItem, decrementMenuItem, getMenuItemsById, clearMenuItems} from '../store/actions/menuItem_actions'
import {addRecommendation, deleteRecommendation, changeUserPassword} from '../store/actions/user_actions'
import {Formik} from 'formik'
import * as Yup from 'yup'

const passwordChangeSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password'),
    newPassword: Yup.string().min(8, 'New password must be at least 8 characters long').required('Please enter a new password'),
})

class Profile extends Component {

    ///////////////////////////////////////
    //doesnt allow typed urls to access other profiles
    ///////////////////////////////////////
    constructor(props) {
        super(props)

        if (window.location.pathname !== `/profile/${this.props.user.userData.username}`) {
            this.props.history.push(`/profile/${this.props.user.userData.username}`)
        }
    }


    state = {
        changePassSucceeded: null,
        changePassFailed: false,
        openPasswordForm: false
    }
    
    ///////////////////////////////////////
    //get list of recommended items on mount
    ///////////////////////////////////////
    componentDidMount() {
        this.props.dispatch(clearMenuItems())
        
        this.props.user.recommended.map(id => {
            let query = {
                _id: id
            }
            return this.props.dispatch(getMenuItemsById(query))
        })

    }


    ///////////////////////////////////////
    //called on recommendation
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
    //called on unrecommendation
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


    ///////////////////////////////////////
    //show cards of user's past recommendations
    ///////////////////////////////////////
    renderRecommendedList() {

        this.props.items.item.map((item, i) => {
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
                    {this.props.user.recommended && this.props.user.recommended.includes(item._id) ? 
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
                    }
                </div>
            )
        })
        
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

                    this.props.dispatch(changeUserPassword(values)).then(response => {

                        if (!this.props.user.success) {
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
                                {this.props.user.message}
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



    render(){
        return(
            <div className='profile-container'>
                <h2 className='profile-title'>
                    Welcome, {this.props.user.userData.username}
                </h2>

                <h2>
                    Your recommendations:
                </h2>   
                <div className='profile-recommend-feed'>
                    
                    {this.props.items.item && this.props.items.item !== undefined ?
                        
                        this.props.items.item.sort(function(a,b){return b.name - a.name}).map((item, i) => {
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
                                    {this.props.user.recommended && this.props.user.recommended.includes(item._id) ? 
                                        
                                        <div className='feed-result-card-button'>
                                            <button 
                                                onClick={() => this.handleUnrecommend(item)} 
                                                className='feed-result-card-button'>
                                                I Take it Back
                                            </button>
                                        </div>
                                    :
                                        <div className='feed-result-card-button'>
                                            <button 
                                                onClick={() => this.handleRecommend(item)} 
                                                className='feed-result-card-button'>
                                                This is Good
                                            </button>
                                        </div>
                                    }
                                </div>
                            )
                        })
                :null}
                </div>

                <div className='change-password-container'>
                    <button 
                        onClick={() => this.setState({openPasswordForm: !this.state.openPasswordForm})}
                    >
                        Change your password
                    </button>    
                
                    {this.state.openPasswordForm ? 
                        this.renderPasswordForm()
                    :null}
                </div>

            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return { 
        items: storeState.menuItem,
        user: storeState.user
     }
}

export default connect(mapStateToProps)(Profile)