import React, { Component } from 'react'
import { Toast } from 'react-bootstrap';


class Notification extends Component {
    state = { 
        show : true
     }

    onClose = () => {
        this.setState({
            show : false
        })
        this.props.onClose(this.props.key)
    }

    render() { 
        return ( 
            <div>
                <Toast show = {this.state.show} onClose = {this.onClose} delay = {this.props.delay ? this.props.delay : 2000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto"> {this.props.title} </strong>
                        <small> Just now... </small>
                    </Toast.Header>
                    <Toast.Body>
                        {this.props.message}
                    </Toast.Body>
                </Toast>
            </div>
        );
    }
}
 
export default Notification;