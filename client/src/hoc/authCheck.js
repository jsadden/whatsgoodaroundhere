import React, {Component} from 'react';
import {authenticateUser} from '../store/actions/user_actions';
import {connect} from 'react-redux';

export default function(ComposedClass, reload) {
    class AuthenticationCheck extends Component{
        isMount = false

        state={
            loading:true
        }

        componentDidMount(){
            this.isMount = true

            //check for user authentication
            this.props.dispatch(authenticateUser()).then(response => {
                let user = this.props.user.auth;

                if (this.isMount) {
                    this.setState({loading:false});
                }

                //if no user push the login page
                if(!user){
                    if (reload) {
                        this.props.history.push('/login')
                    }
                } else {

                    //push the home page
                    if (!reload && reload !== undefined) {
                        this.props.history.push('/')
                    }
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
                <ComposedClass {...this.props} user={this.props.user}/>
            )
        }

    }

    function mapStateToProps(state){
        return {
            user: state.user
        }
    }

    return connect(mapStateToProps)(AuthenticationCheck);

}
