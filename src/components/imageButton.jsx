import React, { Component } from 'react'

import distribution_icon from "../icons/distribution.png"
import "../componentsCSS/icons.scss"

class ImageButton extends Component {
    state = {  }

    imgClicked = () => {
        console.log("IMG CLICKED")
    }

    render() { 
        return ( 
            <div>
                <img src = {distribution_icon} className = "icon" onClick = {this.imgClicked}>   
                </img>
            </div>
        );
    }
}
 
export default ImageButton;