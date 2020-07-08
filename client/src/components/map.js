import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import {connect} from 'react-redux'


const readyToGo = true

class Map extends Component {
    map = null;

    constructor(props) {
        super(props)
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    }

    ///////////////////////////////////////
    //init map on mount
    ///////////////////////////////////////
    componentDidMount() {
        if (readyToGo) {
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [-79.380521, 43.655392], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });
        }
        
    }

    ///////////////////////////////////////
    //create markers
    ///////////////////////////////////////
    createCustomMarker(features) {
        this.map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': features
                }
            },
            'layout': {
                'icon-image': '{icon}-15',
                'icon-size': 1,
                "text-field": "{restaurantName}",
                "text-font": ['Open Sans Semibold', "Arial Unicode MS Bold"],
                "text-offset": [0,0.9],
                "text-anchor": "top"
            }
        });
    }

    ///////////////////////////////////////
    //show markers on the map
    ///////////////////////////////////////
    renderMarkers() {

        //remove old markers
        if (this.map) {
            if (this.map.getLayer("points")) {
                this.map.removeLayer("points");
            }
    
            if (this.map.getSource("points")) {
                this.map.removeSource("points");
            }
        
        
            //bounds init
            const bounds = new mapboxgl.LngLatBounds()

            //compile array object of features to be passed to marker creator
            const markerFeatures = this.props.restaurants.restaurant.map((item, i) => {
                
                //extend bounds to include location
                bounds.extend([item.location.coordinates[1], item.location.coordinates[0]])

                return {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [item.location.coordinates[1], item.location.coordinates[0]]
                    },
                    "properties": {
                        "restaurantName": item.name,
                        "icon": "restaurant"
                    }
                }
            })

            
            //add new markers
            this.createCustomMarker(markerFeatures)

            //zoom map to bounds
            this.map.fitBounds(bounds, {padding: {top: 75, bottom:75, left: 75, right: 75}})
        }
    }


    render(){

        if (!readyToGo) {
            return (
                <div className='map-container'>
                    <h2>
                        There should be a map here
                    </h2>
                </div>
            )
        }
        return(
            <div className='map-container'>
                <div id='map' style={{width:"100%", height: "100%"}}>
                    {this.props.restaurants.restaurant ?
                        this.renderMarkers()
                    :null}
                </div>
            </div>
        
        )
    }
}

function mapStateToProps(storeState) {
    return {
        restaurants: storeState.restaurant
    }
}

export default connect(mapStateToProps)(Map)