import React, { Component } from 'react'
import {connect} from 'react-redux'
import {logoutAdmin} from '../../store/actions/admin_actions'

class AdminLogout extends Component {
    isMount = false

    state = {
        loading: true
    }

    ///////////////////////////////////////
    //logout the admin on mount
    ///////////////////////////////////////
    componentDidMount() {
        this.isMount = true

        this.props.dispatch(logoutAdmin()).then(
            response => {
                if (this.isMount && !this.props.admin.auth){
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
                    {this.props.admin.message}
                </h2>
            </div>
        )
    }

}

function mapStateToProps(storeState) {
    return {
        admin: storeState.admin
    }
}

export default connect(mapStateToProps)(AdminLogout)