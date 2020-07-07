import React from 'react'
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom'
import Home from './components/home'
import MainLayout from './hoc/mainLayout'
import Login from './components/login'
import Profile from './components/profile'
import Logout from './components/logout'

import AdminLogin from './components/admin/adminLogin'
import AdminHome from './components/admin/admin'
import AdminLogout from './components/admin/adminLogout'

import NotFound from './components/404'

import authCheck from './hoc/authCheck'
import adminAuthCheck from './hoc/adminAuthCheck'



const Routes = () => {
    return(
        <BrowserRouter>
            <MainLayout>
                <Switch>
                    <Route path='/admin/logout' component={adminAuthCheck(AdminLogout, true, true)}/>
                    <Route path='/admin/login' component={adminAuthCheck(AdminLogin, true, false)}/>
                    <Route path='/admin/home' component={adminAuthCheck(AdminHome, true, true)}/>
                    <Route path='/profile/:id' component={authCheck(Profile, true)}/>
                    <Route path='/logout' component={authCheck(Logout, true)}/>
                    <Route path='/login' component={authCheck(Login, false)}/>
                    <Route exact path='/' component={authCheck(Home)}/>
                    <Route path='/404' component={authCheck(NotFound)}/>
                    <Redirect to='/404' component={authCheck(NotFound)}/>
                </Switch>
            </MainLayout>
        </BrowserRouter>
    )
}

export default Routes