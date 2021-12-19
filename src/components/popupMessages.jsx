import React, { Component } from 'react'
import {Alert, Modal, Button, Dropdown, Container, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {condition_to_word} from '../conversions'
import {Link} from "react-router-dom"
import {TextbookInfo} from "./infoComponents"

import '../componentsCSS/headings.scss'
import '../componentsCSS/tables.scss'
import '../componentsCSS/buttons.scss'


class Error extends Component {
    render() { 
        return (  
            <Alert variant = "danger" onClose = {this.props.dismissFunc} dismissible>
                <Alert.Heading>
                    {this.props.heading}
                </Alert.Heading>
                <p>
                    {this.props.message}
                </p>
            </Alert>
        );
    }
}

class YesOrNo extends Component {

    state = {
        show : true
    }

    nope = () => {
        this.setState({
            show : false
        })
        this.props.callBackFunc(false)
    }

    yeah = () => {
        this.setState({
            show : false
        })
        this.props.callBackFunc(true)
    }

    render(){
        return (
            <div>
                <Modal
                    show = {this.state.show}
                    onHide = {this.props.handleClose}
                    backdrop = "static"
                    keyboard = {false}
                >
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.message}
                    </Modal.Body>

                    <Modal.Footer>
                        <button className = "custom-btn first" onClick = {this.nope}>
                            Nope
                        </button>
                        <button className = "custom-btn second" onClick = {this.yeah}>
                            Yeah
                        </button>
                    </Modal.Footer>
                    
                </Modal>
            </div>
        );
    }
}

//redirects to login page
class ConnectionWindow extends Component {
    state = {
        show : true
    }

    onClick = () => {
        this.setState({
            show : false
        })
        this.props.controller.setState({
            connectionLost : false
        })
    }

    render(){
        return(
            <div>
                <Modal
                    show = {this.state.show}
                    backdrop = "static"
                    keyboard = {false}
                    onHide = {this.props.onHide}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Connection Error!
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        The connection with the server has been lost! This is likely due to not using the program for prolonged periods of time. Click to go back to the login page.
                    </Modal.Body>

                    <Modal.Footer>
                        <Link to = {"/"}>
                            <Button className = "text-center" variant = "primary" onClick = {this.onClick}>
                                OK!
                            </Button>
                        </Link>
                    </Modal.Footer>
                    
                </Modal>
            </div>
        )
    }
}

class ConditionWindow extends Component {

    constructor(props){
        super(props)
        this.state = {
            show : true,
            condition : this.props.condition
        }
        this.conditionOptions = [{condition : 0, text : "New"}, {condition : 1, text : "Good"}, {condition : 2, text : "Fair"}, {condition : 3, text : "Poor"}, {condition : 4, text : "Destroyed"}, {condition : 5, text : "Lost"}]
        while(this.conditionOptions[0].condition < this.props.condition){
            this.conditionOptions.splice(0, 1)
        }        
    }

    confirm = () => {
        this.setState({
            show : false
        })
        this.props.callBackFunc(this.state.condition)
        this.componentWillUnmount()
    }

    cancel = () => {
        this.setState({
            show : false
        })
        this.componentWillUnmount()
    }

    selected = (eventkey, event) => {
        console.log(event, eventkey)
        this.setState({
            condition : parseInt(eventkey)
        })
    }

    handleKeyboardEvents = (event) => {
        if(event.key == "ArrowUp"){
            this.setState({
                condition : this.state.condition <= this.props.condition ? this.state.condition : this.state.condition - 1
            })
        } else if(event.key == "ArrowDown"){
            this.setState({
                condition : this.state.condition >= 4 ? this.state.condition : this.state.condition + 1
            })
        } else if(event.key == "Enter"){
            this.confirm()
        } 
    }

    componentDidMount = () => {
        console.log("POPUP MESSAGES")
        console.log(this.props)
        document.addEventListener("keydown", this.handleKeyboardEvents);
    }

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyboardEvents);
    }

    

    render() { 

        const renderHelp = (props) => {
            return (
                <Tooltip {...props}>
                    Keyboard shortcuts are available! 'Down' and 'Up' arrow keys changes the condition and 'Enter' returns the textbook.
                </Tooltip>
            )
        }

        return ( 
            <div>
                <Modal
                    show = {this.state.show}
                    onHide = {this.props.handleClose}
                    backdrop = "static"
                >
                    <Modal.Header style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Modal.Title>
                            <h2 className = "h2StyleBold text-center"> Returning Textbook </h2>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col className = "text-center">
                                    <TextbookInfo highlightName = {this.props.highlightName} noTitle = {true} title = "" textbookInfo = {this.props.textbookInfo}/>
                                </Col>
                            </Row>
                            <Row className = "mt-3">
                                <Col>
                                    <h2 className = "h2StyleBold text-center"> What is the current condition of this textbook? </h2>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <OverlayTrigger
                                        placement = "top"
                                        overlay = {renderHelp()}
                                        delay = {{hide : 250, show : 1000}}
                                    > 
                                        <Dropdown className = "text-center">  
                                            <Dropdown.Toggle variant = "success" id = "dropdown-basic">
                                                {condition_to_word(this.state.condition)}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {this.conditionOptions.map((condition, index)=>(
                                                    <Dropdown.Item key = {index} eventKey = {condition.condition} onSelect = {this.selected}> {condition.text} </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        </Container>

                    </Modal.Body>

                    <Modal.Footer>
                        <button className = "custom-btn first" onClick = {this.cancel}>
                            Cancel
                        </button>
                        <button className = "custom-btn second" onClick = {this.confirm}>
                            Return Textbook!
                        </button>

                    </Modal.Footer>
                    
                </Modal>
            </div>
         );
    }
}


export {Error, YesOrNo, ConditionWindow, ConnectionWindow};