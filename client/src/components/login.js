import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {connect} from 'react-redux'
import {loginUser, registerUser} from '../store/actions/user_actions'

//yup front-end validation for email and password
const loginSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Please enter an email address'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password')
})

//yup front-end validation for username, email and password
const signupSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Please enter an email address'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password'),
    passwordConfirm: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords must match'),
    username: Yup.string().required('Please enter a username').max(100, 'Username must be under 75 characters')
})



class Login extends Component {

    state = {
        authSucceeded: false,
        signupFailed: false,
        loginFailed: false,
        signup: this.props.location.formSelect ? this.props.location.formSelect : false
    }

    ///////////////////////////////////////
    //if user gets authorized, send them to home screen
    ///////////////////////////////////////
    componentDidUpdate() {
        if (this.state.authSucceeded) {
            this.props.history.push('/')
        }
    }
    
    ///////////////////////////////////////
    //show the form for logging in, set state flags for success or failure on submit
    ///////////////////////////////////////
    renderLogin() {
        return(
            <Formik
                enableReinitialize={true}
                initialValues={{
                    email: '',
                    password: '' 
                }}
                validationSchema={loginSchema}
                
                onSubmit={values => {
                    this.props.dispatch(loginUser(values)).then(response => {
                        if (!this.props.user.auth) {
                            this.setState({loginFailed: true})
                        } else {
                            this.setState({loginFailed: false, authSucceeded: true})
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
                                type='email'
                                name='email'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email || ''}
                                placeholder='Enter your email'
                                className='half-width-input'
                            />
                        </div>
                        {errors.email && touched.email ? 
                            <div className='errormessage'>
                                {errors.email}
                            </div>
                        :null}

                        
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


                        <button type='submit'>
                            Let me in
                        </button>
                        {this.state.loginFailed ? 
                            <div className='errormessage'>
                                {this.props.user.message}
                            </div>
                        :null}
                    </form>
                )}
            </Formik>
        )
    }

    ///////////////////////////////////////
    //show the form for registering, set state flags for success or failure on submit
    ///////////////////////////////////////
    renderSignup() {
        return(
            <Formik
                enableReinitialize={true}
                initialValues={{
                    email: '',
                    username: '',
                    password: '',
                    passwordConfirm: '',
                }}
                validationSchema={signupSchema}

                onSubmit={values => {
                    values.email = values.email.trim()
                    values.username = values.username.trim()

                    this.props.dispatch(registerUser(values)).then(response => {

                        if (!this.props.user.success) {
                            this.setState({signupFailed: true})
                        } else {
                            this.setState({signupFailed: false, authSucceeded: true})
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
                                type='email'
                                name='email'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email || ''}
                                placeholder='Enter your email'
                                className='half-width-input'
                            />
                        </div>
                        {errors.email && touched.email ? 
                            <div className='errormessage'>
                                {errors.email}
                            </div>
                        :null}


                        <div>
                            <input
                                type='text'
                                name='username'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username || ''}
                                placeholder='Enter a username'
                                className='half-width-input'
                            />
                        </div>
                        {errors.username && touched.username ? 
                            <div className='errormessage'>
                                {errors.username}
                            </div>
                        :null}


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
                                name='passwordConfirm'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.passwordConfirm || ''}
                                placeholder='Confirm your password'
                                className='half-width-input'
                            />
                        </div>
                        {errors.passwordConfirm && touched.passwordConfirm ? 
                            <div className='errormessage'>
                                {errors.passwordConfirm}
                            </div>
                        :null}


                        <button type='submit'>
                            REGISTER
                        </button>

                        {this.state.signupFailed ? 
                            <div className='errormessage'>
                                {this.props.user.message}
                            </div>
                        :null}
                    </form>
                )}
            </Formik>
        )
    }

    ///////////////////////////////////////
    //show either the login or register form
    ///////////////////////////////////////
    render(){

        return(
            <div className='login-container'>

                <div className='login-options button-item'>

                        <button onClick={() => (this.setState({signup: false}))}>
                            Log In
                        </button>

                        <button onClick={() => (this.setState({signup: true}))}>
                            Sign Up
                        </button>

                </div>

                <div className='login-form-container'>
                    {this.state.signup ? this.renderSignup() : this.renderLogin()}
                </div>
                
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(Login)