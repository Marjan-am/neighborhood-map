import React, { Component } from 'react';
import './App.css';
import axios from "axios";

class App extends Component {

state =  {
  venues: []
}
  componentDidMount() {
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
      near: "Sydney",
      query: "food",
      v: "20182507"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          //Storing all places in state array

          venues: response.data.response.groups[0].items
        },  this.mapLoader())
      // handle success
        console.log(response);
     }).catch(error => {
      // handle error
      console.log(error);
    })
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

    var infowindow = new window.google.maps.InfoWindow({
      content: contentString
    });
  
    //Creating markers
    this.state.venues.map(eachVenue => {
      var marker = new window.google.maps.Marker({
        position: {lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng},
        map: map,
        title: eachVenue.venue.name
      })
      //Info window
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      })
    })
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    );
  }
}

function scriptLoader (url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script,index);
}

export default App;
