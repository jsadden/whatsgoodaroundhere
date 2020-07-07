import React, {Component} from 'react';
import {authenticateAdmin} from '../store/actions/admin_actions';
import {authenticateUser} from '../store/actions/user_actions'
import {connect} from 'react-redux';

export default function(ComposedClass, reloadUser, reloadAdmin) {
    class AdminAuthenticationCheck extends Component{
        isMount = false

        state={
            loading:true
        }

        componentDidMount(){
            this.isMount = true
            
            //first, check if a user is logged in
            this.props.dispatch(authenticateUser()).then(response => {
                let user = this.props.user.auth;

                if (this.isMount) {
                    this.setState({loading:false});
                }
                
                //if no user push a 404
                if(!user){
                    if (reloadUser) {
                        this.props.history.push('/404')
                    }
                } else {

                    //if user, but reload is false, push a 404
                    if (!reloadUser && reloadUser !== undefined) {
                        this.props.history.push('/404')
                    }

                    //if logged in user is not me, push a 404
                    if (this.props.user.userData.username !== 'Jim') {
                        this.props.history.push('/404')
                    }

                    //then, check for logged in admin
                    this.props.dispatch(authenticateAdmin()).then(response => {
                        let admin = this.props.admin.auth;
        
                        if (this.isMount) {
                            this.setState({loading:false});
                        }
                        
                        //if not logged in, push the login page
                        if(!admin){
                            if (reloadAdmin) {
                                this.props.history.push('/admin/login')
                            }
                        } else {

                            if (!reloadAdmin && reloadAdmin !== undefined) {
                                this.props.history.push('/admin/home')
                            }
                        }
                        
                    })
                }
                
            })

            
        }

        componentWillUnmount() {
            this.isMount = false
        }

        render(){
            if(this.state.loading){
                return(
                    <div className='loader-container'>
                        <div className='loader'>
                            Loading...
                        </div>
                    </div>
                )
            }
            

            return (
                <ComposedClass {...this.props} admin={this.props.admin}/>
            )
        }

    }

    function mapStateToProps(state){
        return {
            user: state.user,
            admin: state.admin
        }
    }

    return connect(mapStateToProps)(AdminAuthenticationCheck);

}
