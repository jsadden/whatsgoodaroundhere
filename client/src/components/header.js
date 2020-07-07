import React, {Component} from 'react'
import {Link, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'

class Header extends Component {

    ///////////////////////////////////////
    //dynamically show header nav buttons based on the url and authentication level
    ///////////////////////////////////////
    getNavItems = () => {

        if (this.props.admin.auth) {
            return (
                <nav>
                    <NavLink to={{pathname:'/admin/logout'}}>Admin Log out</NavLink>
                    
                    {!window.location.pathname.includes('admin/home') ? 
                        <NavLink to={{pathname:'/admin/home'}}>Admin</NavLink>
                    :
                        <NavLink to={{pathname:'/'}}>Home</NavLink> 
                    }
                </nav>
            )
        }

        if (this.props.user.auth) {
            
            return (
                <nav>
                    <NavLink to={{pathname:'/logout'}}>Log out</NavLink>

                    {this.props.user.userData && !window.location.pathname.includes('profile') ? 
                        <NavLink to={{pathname:`/profile/${this.props.user.userData.username}`}}>My Profile</NavLink>
                    : null}

                    {window.location.pathname.includes('profile') ? 
                        <NavLink to={{pathname:'/'}}>Home</NavLink>
                    : null}
                </nav>
            )
        }

        if (window.location.pathname === '/login' || window.location.pathname === '/logout') {
            return (
                <nav>
                    <NavLink to={{pathname:'/'}}>Home</NavLink>
                </nav>
            )
        }


        return (
            <nav>
                <NavLink to={{pathname:'/login', formSelect:false}}>Log in</NavLink>
                <NavLink to={{pathname:'/login', formSelect:true}}>Sign up</NavLink>
            </nav>
        )
    }

    render(){
        return(
            <header>
                <div className='row'>
                    <Link to='/' className='logo'>
                        <div className='logo-image' style={{backgroundImage: "url('../images/logo.png')"}}></div>
                        <div className='logo-text'>
                            What's good around here?
                        </div>
                    </Link>
                    {this.getNavItems()}
                </div>
                
            </header>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        admin: storeState.admin,
        user: storeState.user
    }
}

export default connect(mapStateToProps)(Header)