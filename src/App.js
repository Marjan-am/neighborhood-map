import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Navbar from "./Navbar";
import escapeRegExp from 'escape-string-regexp';



class App extends Component {

  state =  {
    venues: [],
    markers: [],
    contents: [],
    query: '',
    notVisibleMarkers: [],
    originalVenues: []
  }

  componentDidMount () {
    this.getVenues();
  }

  mapLoader = () => {
    scriptLoader("https://maps.googleapis.com/maps/api/js?key=AIzaSyBTVFVjqLRQAvF8dRZwr6g-GadDHiXxkF8&callback=initMap");
    window.initMap = this.initMap
  }

    //Getting data from FourSquare by using axios

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id : "GZMVVG2WEA2M3VVKAVGXTSMKACFFZLZHMUSVYBGKUTDBTI1M",
      client_secret: "W5IKT542C1IOCMDMORI0YHDRIT2QLN2U4KT3E0ESWQ3XF3O4",
      near: "Escondido",
      query: "shops",
      limit: 8,
      v: "20181105"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          //Storing all places in state array
          venues: response.data.response.groups[0].items, 
          originalVenues: response.data.response.groups[0].items      
          },  this.mapLoader())
      // handle success
            console.log(response);
            
         }).catch(error => {
      // handle error
          alert(`Fetching data from Foursquare was not possible!`)
          console.log("Error! " + error)
        })
  }
  
  createInfoWindow = () => {
    this.infoWindow = new window.google.maps.InfoWindow();
  }

  createMap = () => {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat:  33.133648, lng: -117.073223 },
      zoom: 10
    });
  }

  createVenueContent = (v, index) => {
    const { location, name,} = v.venue;
    var contentString = '<div id="content">'+
    '</div>'+
    '<h3>'+ name +'</h3>'+
    '<div id="bodyContent">'+
    '<p><b>Address: </b>'+ location.address +'</p>'+
    '<p><b>City: </b>'+ location.city +'</p>'+
    '<p><b>Country: </b>'+ location.country +'</p>'+
    '</div>';

    return contentString;
  }

  createVenueMarker = (v, index) => {
    const marker = new window.google.maps.Marker({
      position: { lat: v.venue.location.lat, lng: v.venue.location.lng },
      animation: window.google.maps.Animation.DROP,
      title: v.venue.name,
      id: v.venue.id
    });
  
    marker.addListener('click', () => {
      this.clickHandler(index);
    });

    return marker;
  }

  initMap = () => {
    const { venues } = this.state;

    // Create map and store on the component instance variable
    this.createMap();

    // Creating the infoWindow and store the reference in instance variable
    this.createInfoWindow();

    // Markers
    const markers = venues.map((eachVenue, index) => this.createVenueMarker(eachVenue, index));

    // Contents
    const contents = venues.map((eachVenue, index) => this.createVenueContent(eachVenue, index));

    this.setState({
      markers: markers,
      contents: contents,
    });

    markers.forEach(m => m.setMap(this.map));

  }  //End of initMap

  handleBounce = (venueIndex) => {
    const { markers } = this.state;
    markers.map((m, index) => {
      if (index === venueIndex) {
        m.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function(){ m.setAnimation(null) }, 550)
      } else {
        m.setAnimation(null);
      }
    });
  }

  clickHandler = (venueIndex) => {
    const { contents, markers } = this.state;
    this.handleBounce(venueIndex);
    this.infoWindow.setContent(contents[venueIndex]);
    this.infoWindow.open(this.map, markers[venueIndex]);
    
  };

  updateQuery = query => {
    this.setState({ query })
    this.state.markers.map(marker => marker.setVisible(true))
    let filterVenues
    let notVisibleMarkers

    if (query) {
      const match = new RegExp(escapeRegExp(query), "i")
      filterVenues = this.state.venues.filter(myVenue =>
        match.test(myVenue.venue.name)
      )
      this.setState({ venues: filterVenues })
        notVisibleMarkers = this.state.markers.filter(marker =>
        filterVenues.every(myVenue => myVenue.venue.name !== marker.title)
      )

      //Hiding the markers for venues 
   
      notVisibleMarkers.forEach(marker => marker.setVisible(false))

      this.setState({ notVisibleMarkers })
    } else {
      
      this.setState({ venues: this.state.originalVenues})
      this.state.markers.forEach(marker => marker.setVisible(true))
    }
  }

  render() {
    if (this.state.hasError) {
      return <div id="Error-message" aria-label="Error message">Sorry, something went wrong!</div>
    } else {

        console.log("state ", this.state);
        const { venues } = this.state;
      
        return (
          <main className="container-fluid"> 
          <Navbar         
              updateQuery={this.updateQuery}
              venues={venues}
              filteredVenues={this.filteredVenues}
              clickHandler={this.clickHandler} />
            <div id="map" role="application" aria-label="Map" ></div>
          </main>
     );
    }
  }
}

function scriptLoader (url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script,index);
  script.onerror = function() {
    alert("Error loading map! Check the URL!");
  };
}

export default App;

