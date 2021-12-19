import { Component } from 'react'
import {ConnectionWindow} from '../components/popupMessages'
import {Col, Row} from 'react-bootstrap';
import LinkButton from '../components/linkButton'
import MainTitle from '../components/mainTitle'

// all webpages will inherit this class 
// simplifies the code and ensures all webpages work with the barcode scanner

class TemplateWebpage extends Component {

    constructor(props){
        super(props)
        this.props.controller.clearState()
        console.log("YE", this)
        if (this.props != null) {
            this.props.controller.setCurrentPage(this)
        } else{
            console.log("FAILED")
        }
        
    }

    textbookScanned(){
        console.log("TEXTBOOK SCANNED!")
    }

    studentScanned(){
        console.log("STUDENT SCANNED!")
    }

    unknownScanned(number){
        console.log("UNKNOWN SCANNED")
    }

    windowSizeChange = () => {
        
    }

    connectionLost = () => {
        if(this.props.controller.state.connectionLost || !this.props.controller.state.loginInfo.loggedIn){
            return <ConnectionWindow controller = {this.props.controller} onHide = {() => this.props.controller.setState({userSchoolCode : "", userType : "", connectionLost : false})}/>
        }
    }

    renderBackButton = () => {
        return (
            <div>
                <Row style = {{position: "absolute", bottom: "2%"}} className = "mt-3 ml-1">
                    <Col>
                        <LinkButton styling = "back-btn back-button" text = "BACK" link = "/menu"/>
                    </Col>
                </Row>
            </div>
        )
    }

    renderTitle = (title) => {
        return (
            <div>
                <Row className = "mt-2">
                    <Col className = "text-center">
                        <MainTitle title = {title}/>
                    </Col>
                </Row>
            </div>
        )
    }
}
 
export default TemplateWebpage;