import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

//wraps each page with header and footer
const MainLayout = (props) => {
    return(
        <>
            <Header/>
                <div className='main-content'>
                    {props.children}
                </div>
            <Footer/>
        </>
    )
}

export default MainLayout