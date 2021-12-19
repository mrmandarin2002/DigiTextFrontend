import React, { Component } from 'react'

import '../componentsCSS/buttons.scss'

import {Form, Col, OverlayTrigger, Tooltip} from 'react-bootstrap';

//the way autoFocus works right now is pretty disgusting but it'll do for now

class ManualBarcodeEntry extends Component {
    state = { 
        entryMode : false,
        formVal : "",
        focused : false
    }

    changeState = () => {
        this.setState({
            entryMode : !this.state.entryMode
        })
    }

    submit = () => {
        if(this.state.formVal){
            this.props.barcodeFunc(this.state.formVal)
        }
        this.setState({
            focused : false
        })
        this.changeState()
    }

    setFocus = (c) => {
        if(this.state.focused === false && c != null){
            c.focus()
            this.setState({
                focused : true
            })
        }
    }

    

    render() { 

        const renderHelp = (props) => {
            return (
                <Tooltip {...props}>
                    Click to allow keyboard entry of a barcode.
                </Tooltip>
            )
        }

        const render1x1 = () => {
            if(this.state.entryMode){
                return (
                    <Form>
                        <Form.Row>
                            <Col xs = "auto">
                            <Form.Group>
                                <Form.Control 
                                    ref = {c => (this.setFocus(c))}
                                    type = "text" 
                                    placeholder = "Enter Barcode"
                                    onChange = {e => this.setState({formVal : e.target.value})}
                                    onKeyPress = {event => {
                                        if(event.key === "Enter"){
                                            this.submit()
                                        }
                                    }}
                                />
                            </Form.Group>
                            </Col>
                            <Col>
                                <button className = "custom-btn second" onClick = {this.submit}> Submit </button>
                            </Col>
                        </Form.Row>
                    </Form>
                )
            } else{
                return(
                    <div>
                        <OverlayTrigger
                            placement = "top"
                            overlay = {renderHelp()}
                        >
                            <button className = "custom-btn second" onClick = {this.changeState}> Manual Barcode Entry </button>
                        </OverlayTrigger>
                    </div>
                ) 
            }
        }

        return ( 
            <div>
                {render1x1()}
            </div>
        );
    }
}
 
export default ManualBarcodeEntry;