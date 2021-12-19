import React, { Component } from 'react'

import '../componentsCSS/mainTitle.css'

//main title for the pages and shit

class MainTitle extends Component {
    render() { 


        return ( 
            <div>
                <h1 className = "title"> {this.props.title}</h1>
            </div>
         );
    }
}
 
export default MainTitle;