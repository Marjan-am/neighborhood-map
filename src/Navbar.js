import React, { Component } from 'react';
import SearchBar from './SearchBar';

class Navbar extends Component {  
    
    render() {     
        const { clickHandler, searchHanlder, updateQuery} = this.props;
        return (
            <nav className="navbar-primary navbar-light bg-light">
            {/* <a className="navbar-brand">Neighborhood Map</a> */}
                <SearchBar onChange={searchHanlder} updateQuery={updateQuery}/>
              <ul className="navbar-primary-menu">
              
                  {
                    this.props.venues.map((eachVenue, index) => { 
                        return(
                            <li
                                key={index}
                                onClick={() => clickHandler(index)}
                                aria-label={eachVenue.venue.name}
                                tabIndex="0"
                                >
                                <span className="nav-label">{eachVenue.venue.name}</span>
                            </li> 
                        )
                    })
                 }
               
              </ul>
            </nav>
        );
      }
    }
    
export default Navbar;