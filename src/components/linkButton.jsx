import React, { Component } from 'react'
import {Button} from 'react-bootstrap';
import {Link} from "react-router-dom"
import '../componentsCSS/buttons.scss'


//should be wrapped between "Router" within the html

class LinkButton extends Component {

    //props attributes
    //text --> button text
    //link --> where the button goes

    render() { 

        const renderButton = () =>{
            if(this.props.styling){
                return (
                    <button className = {this.props.styling}>
                        {this.props.text} 
                    </button>
                ) 
            } else{
                return (
                    <Button>
                        {this.props.text}
                    </Button>
                )
            }
        }

        return ( 
            <div>
                <Link style = {{textDecoration : 'none'}} to = {this.props.link}>
                    {renderButton()}
                </Link>
            </div> 
        );
    }
}
 
export default LinkButton;