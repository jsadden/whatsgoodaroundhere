import React, { Component } from 'react'
import {connect} from 'react-redux'
import {logoutUser} from '../store/actions/user_actions'
import {Link} from 'react-router-dom'

class Logout extends Component {
    isMount = false

    state = {
        loading: true
    }

    ///////////////////////////////////////
    //logout user on mount
    ///////////////////////////////////////
    componentDidMount() {
        this.isMount = true

        this.props.dispatch(logoutUser()).then(
            response => {
                if (this.isMount && !this.props.user.auth){
                    this.setState({loading: false})
                }
            }
        )
    }

    componentWillUnmount() {
        this.isMount = false
    }
    

    render() {

        if (this.state.loading) {
            return(
                <div className='loader-container'>
                    <div className='loader'>
                        Loading...
                    </div>
                </div>
            )
        }

        return(
            <div className='logout-container'>
                <h2 className='logout-message'>
                    {this.props.user.message}
                    
                </h2>
                <h2>
                    Bon appetit!
                </h2>

                <div className='logout-login'>
                    <h3>
                        Didn't want to be here?
                    </h3>
                    <Link to={{pathname:'/login', formSelect:false}}>
                        <button>
                            Log back in
                        </button>
                    </Link>
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

export default connect(mapStateToProps)(Logout)