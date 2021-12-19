//this is used for both textbook distribution and return as they have similar functionality
import './Background.css' //unfortunately all webpages have to important this to change the background color
import TemplateWebpage from './TemplateWebpage'
import '../componentsCSS/headings.scss'

import '../webpagesCSS/infoCSS.scss'
import TextbookList from '../components/textbookList'
import {StudentInfo, CourseList} from '../components/infoComponents'
import ManualBarcodeEntry from '../components/manualBarcodeEntry'
import {Error, YesOrNo, ConditionWindow} from '../components/popupMessages'
import { Container, Row, Col} from 'react-bootstrap';
import StudentSearch from '../components/studentSearch'


//will have to take in props to determine if it's return or distribution mode

class TextbookDistribution extends TemplateWebpage {

    constructor(props){
        super(props)
        this.mode = props.mode

        var title = "Textbook Return"
        //default set to distribution
        if(this.mode === 'D'){
            title = "Textbook Distribution"
        } 

        this.state = {
            title : title,
            mode : this.mode,
            studentScanned : false,
            textbookScanned : false,
            alerts : {
                textbookOwned : false,
                textbookNotOwned : false,
                unknownScanned : false,
                notNeeded : false,
                notOwner : false,
                conditionWindow : false
            }
        }

    }

    studentScanned(){
        var studentInfo = this.props.controller.state.studentInfo
        if(this.state.mode === 'D'){
            this.props.controller.setTextbookList(studentInfo.neededTextbooks, "Student Needed Textbooks", "ABSTRACT")
        } else{
            this.props.controller.setTextbookList(studentInfo.withdrawnTextbooks, "Withdrawn Textbooks", "WITHDRAWN")
        }
        this.setState({
            studentScanned : true,
            textbookScanned : false
        })
    }

    //where textbooks are actually assigned and shit
    textbookScanned(){
        this.setState({
            textbookScanned : true
        })

        if(this.state.studentScanned){
            var textbookInfo = this.props.controller.state.textbookInfo
            var studentInfo = this.props.controller.state.studentInfo

            //distribution
            if(this.state.mode === 'D'){

                //check if textbook is a placeholder
                var placeholder = false
                for (var i = 0; i < textbookInfo.placeholders.length; i++){
                    if(studentInfo.neededIds.includes(textbookInfo.placeholders[i])){
                        placeholder = true
                        break
                    }
                }
                console.log("IS PLACEHOLDER: ", placeholder)

                //if textbook is currently owned by someone
                if(textbookInfo.owner.id !== 0){
                    this.setState({
                        alerts : {
                            textbookOwned : true
                        }
                    })
                } else if(placeholder){
                    this.assignTextbook()
                }         
                else if (!studentInfo.neededIds.includes(textbookInfo.abstract_textbook_id)){
                    console.log("TESTING!")
                    this.setState({
                        alerts : {
                            notNeeded : true
                        }
                    })
                } else{
                    this.assignTextbook()
                }
            }
            //return
            else { 
                if(textbookInfo.owner.id === 0){
                    this.setState({
                        alerts : {
                            textbookNotOwned : true
                        }
                    })
                }
                // else if (textbookInfo.owner.id !== studentInfo.number){
                //     this.setState({
                //         alerts : {
                //             notOwner : true
                //         }
                //     })
                // } 
                else{
                    this.setState({ //weird shit going on with mounting and crap
                        alerts : {
                            notOwner : textbookInfo.owner.id !== studentInfo.number
                        }
                    })
                    this.launchConditionWindow()
                }

            }
        } else if (this.state.mode == 'R'){
            var textbookInfo = this.props.controller.state.textbookInfo
            console.log(textbookInfo)
            if(textbookInfo.owner.id != 0){
                console.log("YE")
                this.launchConditionWindow()
            } else{
                console.log("NO")
                this.setState({alerts : {
                    textbookNotOwned : true
                }})
            }
        }
    }

    launchConditionWindow = (check = true) => {
        this.setState({
            alerts : {
                notOwner : this.state.alerts.notOwner,
                conditionWindow : true
            }
        })
    }

    //note that assign and check for the following two functions is for callback from the yesOrNo component
    returnTextbook = (condition, check = true) => {
        this.setState({
            alerts : {
                conditionWindow : false
            }
        })
        if(check){
            var textbookInfo = this.props.controller.state.textbookInfo
            this.props.controller.addNotification("Returning Textbook!", textbookInfo.title + " returned from " + textbookInfo.owner.name + ".", 4000)
            this.props.controller.api.returnTextbook(textbookInfo.owner.id, textbookInfo.number, condition)
        }
    }

    assignTextbook = (assign = true) => {
        this.setState({
            alerts : {
                 notNeeded : false
            }
        })
        if (assign){
            var studentInfo = this.props.controller.state.studentInfo
            var textbookInfo = this.props.controller.state.textbookInfo
            this.props.controller.addNotification("Assigning Textbook!", textbookInfo.title + " assigned to " + studentInfo.name + ".", 4000)
            this.props.controller.api.assignTextbook(studentInfo.number, textbookInfo.number, textbookInfo.condition)
        }
    }

    unknownScanned = () => {
        this.setState({
            alerts : {unknownScanned : true}
        })
    }

    render() { 

        const {textbookInfo, studentInfo, textbookList} = this.props.controller.state

        const render1x1 = () => {
            if (this.state.studentScanned){
                return <StudentInfo studentInfo = {studentInfo}/>
            } else {
                if(this.state.mode == 'D'){
                    return <h1 className = "h1Style"> Please Scan a Student's Barcode to Begin!</h1>
                } else{
                    return <h1 className = "h1Style"> Please Scan a Student's Barcode to Begin! </h1>
                }
            }
        }

        const render2x1 = () => {
            if (this.state.studentScanned){
                return <CourseList studentCourses = {studentInfo.courses}/>
            }
        }

        const render1x2 = () => {
            if (this.state.studentScanned){
                return <TextbookList removeTextbookFunc = {this.props.controller.scanner.barcodeScanned} textbooks = {textbookList.textbooks} listTitle = {textbookList.title} type = {textbookList.type}/>
            }
        }

        const renderAlerts = () => {
            if (!this.state.studentScanned && this.state.textbookScanned) { //if textbook is scanned before student
                if(this.state.mode == 'D'){
                    return <Error heading = "ERROR" message = "Please Scan a Student's ID First!" dismissFunc = {() => this.setState({textbookScanned : false})}/>
                } 
                
            } 
            if(this.state.alerts.textbookOwned){
                return <Error 
                    heading = "ERROR" 
                    message = {"This Textbook is Already Owned by " + textbookInfo.owner.name + ". Please Return this Textbook Before Assigning to Others!"}
                    dismissFunc = {() => this.setState({alerts : {textbookOwned : false}})}
                />
            } else if (this.state.alerts.unknownScanned){
                return <Error
                    heading = "UNKNOWN BARCODE"
                    message = {"The Barcode you've just Scanned: " + this.props.controller.state.currentBarcode + " is not in the Database!"}
                    dismissFunc = {() => this.setState({alerts : {unknownScanned : false}})}
                />
            } else if (this.state.alerts.notNeeded){
                return <YesOrNo
                    title = "Textbook Not Needed by Student"
                    message = {studentInfo.name + " does not need the textbook: " + textbookInfo.title + ". Would you still like to assign it to him?"}
                    callBackFunc = {this.assignTextbook}
                />
            } else if (this.state.alerts.textbookNotOwned) {
                return <Error 
                    heading = "ERROR"
                    message = {"This textbook currently is not taken out by any student."}
                    dismissFunc = {() => this.setState({alerts : {textbookNotOwned : false}})}
                /> 
            } else if (this.state.alerts.conditionWindow){
                return <ConditionWindow highlightName = {this.state.alerts.notOwner} textbookInfo = {textbookInfo} textbookTitle = {textbookInfo.title} condition = {textbookInfo.condition} callBackFunc = {this.returnTextbook}/>
            }
            // else if (this.state.alerts.notOwner) {
            //     return <YesOrNo
            //         title = "Textbook Not Owned by Student"
            //         message = {studentInfo.name + " does not own the textbook: " + textbookInfo.title + ". Would you still like to return it from its respective owner (" + textbookInfo.owner.name + ")?"} 
            //         callBackFunc = {this.launchConditionWindow}
            //     />

            // } 
        }

        return ( 
            <div >
                {this.connectionLost()}
                { renderAlerts() }
                <Container fluid>
                    {this.renderTitle(this.state.title)}
                    <Row className = "mt-3">
                        <Col>
                            <Container>
                                <Row className = "mb-4">
                                    <Col>
                                        {render1x1()}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {render2x1()}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            {render1x2()}
                        </Col>
                    </Row>
                    <Row style = {{position: "absolute", bottom: "9%"}} className = "mb-2 ml-1">
                        <Col xs = "auto">
                            <ManualBarcodeEntry barcodeFunc = {this.props.controller.scanner.barcodeScanned}/>
                        </Col>
                        <Col>
                            <StudentSearch studentList = {this.props.controller.state.studentList} callBackFunc = {this.props.controller.scanner.barcodeScanned}/>
                        </Col>
                    </Row>
                    {this.renderBackButton()}
                </Container>
            </div>
        );
    }
    
}
 
export default TextbookDistribution;