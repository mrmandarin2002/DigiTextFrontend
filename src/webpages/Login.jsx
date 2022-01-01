import React from 'react'
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import '../componentsCSS/headings.scss'
import '../webpagesCSS/login.scss'
import MainTitle from '../components/mainTitle'
import {Error} from '../components/popupMessages'
import TemplateWebpage from './TemplateWebpage'

import '../componentsCSS/buttons.scss'

class Login extends TemplateWebpage {

    state = {
        username : "",
        password : "",
    }

    submitForm = (e) => {
        e.preventDefault(); // stack overflow to the rescue once again....
        if(this.state.username){
            this.props.controller.setState({loginInfo : {username : this.state.username}})
            this.props.controller.api.login(this.state.username, this.state.password)
        }
    }

    render() { 
        const renderAlerts = () => {
            if(this.props.controller.state.loginInfo.loginFailed){
                if(!this.state.username && !this.state.password){
                    this.props.controller.setState({loginInfo : {loginFailed : false}})
                } else{
                    return <Error                   
                        heading = "Login Failed!"
                        message = {"Make sure your credentials are correct!"}
                        dismissFunc = {() => this.props.controller.setState({loginInfo : {loginFailed : false}})}
                    />
                }
            }
        }


        return ( 
            <div>
                {renderAlerts()}
                <Container>
                    {this.renderTitle("DigiText Log In")}
                    <Row className = "mt-4">
                        <Col>
                            <Form>
                                <Form.Row className="text-center" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Col xs = "auto">
                                        <Form.Group>
                                            <Form.Label className = "lf--label"> Username </Form.Label>
                                            <Form.Control className = "lf--input" type = "text" placeholder = "Enter Username" onChange = {e => this.setState({username : e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Row className="text-center" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}> 
                                    <Col xs = "auto">
                                        <Form.Group>
                                            <Form.Label className = "lf--label"> Password </Form.Label>
                                            <Form.Control 
                                                className = "lf--input"
                                                type = "password" 
                                                placeholder = "Enter Password" 
                                                onChange = {e => this.setState({password : e.target.value})}
                                                onKeyPress = {event => {
                                                    if(event.key === "Enter"){
                                                        this.submitForm(event)
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Row className="mt-2" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Col xs = "auto">
                                        <button className = "lf--submit" onClick = {(e) => {this.submitForm(e)}}>
                                            Log In
                                        </button>
                                    </Col>
                                </Form.Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
 
export default Login;