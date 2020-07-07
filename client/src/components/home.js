import React, { Component } from 'react'
import Feed from './feed'
import Map from './map'
import SearchBar from './searchbar'
import AddItemsSection from './addItemsSection'


class Home extends Component {



    render(){
        return(
            <div>
                <div className='home-banner-overlay' style={{backgroundImage: "url('../images/food" + Math.floor(Math.random() * 10 + 1).toString() + ".jpg')"}}>
                    <div className='home-banner' >
                        We Hope You're Hungry.
                    </div>
                </div>

                <div>
                    <SearchBar></SearchBar>
                </div>
                <div className='feed-wrapper'>
                    <div>
                        <Feed></Feed>
                    </div>
                    <div>
                        <Map></Map>
                    </div>
                </div>
                <div>
                    <AddItemsSection></AddItemsSection>
                </div>
                
            </div>
        )
    }
}

export default Home