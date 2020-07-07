import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {connect} from 'react-redux'
import {loginAdmin} from '../../store/actions/admin_actions'

//yup front-end validation for email and password
const loginSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Please enter an email address'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password')
})

class AdminLogin extends Component {

    state = {
        authSucceeded: false,
        loginFailed: false,
    }

    ///////////////////////////////////////
    //if admin gets authorized, send them to admin home screen
    ///////////////////////////////////////
    componentDidUpdate() {
        if (this.state.authSucceeded) {
            this.props.history.push('/admin/home')
        }
    }


    ///////////////////////////////////////
    //show the login form
    ///////////////////////////////////////
    render(){

        return(
            <div className='login-container'>

                <h2 className='admin-login-title'>
                    Log In
                </h2>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        email: '',
                        password: '' 
                    }}
                    validationSchema={loginSchema}
                    
                    onSubmit={values => {
                        this.props.dispatch(loginAdmin(values)).then(response => {
                            if (!this.props.admin.auth) {
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
                                LOG IN
                            </button>
                            {this.state.loginFailed ? 
                                <div className='errormessage'>
                                    {this.props.admin.message}
                                </div>
                            :null}
                        </form>
                    )}
                </Formik>
            
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        admin: storeState.admin
    }
}

export default connect(mapStateToProps)(AdminLogin)
