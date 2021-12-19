//page where information regarding textbooks and students can be obtained
import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../webpagesCSS/infoCSS.scss'
import '../componentsCSS/headings.scss'
import '../componentsCSS/buttons.scss'

import TemplateWebpage from './TemplateWebpage'

import ManualBarcodeEntry from '../components/manualBarcodeEntry'
import TextbookList from '../components/textbookList'
import TransactionList from '../components/transactionList'
import {StudentInfo, TextbookInfo, CourseList} from '../components/infoComponents'
import { Container, Row, Col} from 'react-bootstrap';
import StudentSearch from '../components/studentSearch'
import {Error} from '../components/popupMessages'
import download from 'downloadjs'

class Info extends TemplateWebpage {

    state = {
        width : window.innerWidth,
        height : window.innerHeight,
        textbookListMode : "WITHDRAWN",
        transactionMode : false,
        alerts : {
            unknownScanned : false
        }
    }

    componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
      componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
      
      updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        console.log(this.state)
      }

    studentScanned(){
        var studentInfo = this.props.controller.state.studentInfo
        this.props.controller.setTextbookList(studentInfo.withdrawnTextbooks, "Withdrawn Textbooks", "NORMAL")
        this.setState({
            transactionMode : false,
            textbookListMode : "WITHDRAWN"
        })
    }

    unknownScanned(){
        this.setState({
            alerts :{
                unknownScanned : true
            }
        })
    }

    switchTextbookList = (e) => {
        e.currentTarget.blur()
        var switchText = "WITHDRAWN"
        if(this.state.textbookListMode === "WITHDRAWN"){
            switchText = "NEEDED"
            this.props.controller.setTextbookList(this.props.controller.state.studentInfo.neededTextbooks, "Needed Textbooks", "ABSTRACT")
        } else{
            this.props.controller.setTextbookList(this.props.controller.state.studentInfo.withdrawnTextbooks, "Withdrawn Textbooks", "NORMAL")
        }
        this.setState({
            textbookListMode : switchText
        })
    }

    switchTransactionMode = (e) => {
        e.currentTarget.blur()
        this.setState({
            transactionMode : !this.state.transactionMode
        })
    }

    getInvoice = (e) => {
        e.currentTarget.blur()
        if(e.clientX !== 0 && e.clientY !== 0){
            this.props.controller.api.getInvoice(this.props.controller.state.studentInfo.number, this.downloadInvoice)
        }
    }

    downloadInvoice = (invoice, filename) => {
        download(invoice, filename, "application/pdf")
    }

    render() {
        

        const {textbookInfo, studentInfo, textbookList, currentScanned} = this.props.controller.state

        //refers to row 1, col 1
        const render1x1 = () => {
            if(currentScanned === "TEXTBOOK"){
                return <TextbookInfo textbookInfo = {textbookInfo}/>
            } else if (currentScanned === "STUDENT"){
                return <StudentInfo studentInfo = {studentInfo}/>
            } else{
                return <h1 className = "h1Style"> Please Scan a Student or Textbook Barcode to Begin!</h1>
            }
        }

        const render2x1 = () => {
            if(currentScanned === "STUDENT"){
                return <CourseList studentCourses = {studentInfo.courses}/>
            }
        }

        const render1x2 = () => {
            if(currentScanned === "STUDENT"){
                if(!this.state.transactionMode){
                    return <TextbookList textbooks = {textbookList.textbooks} listTitle = {textbookList.title} type = {textbookList.type}/>
                } else {
                    return <TransactionList transactions = {studentInfo.transactions} title = "Student Transactions"/>
                }
            } else if(currentScanned === "TEXTBOOK"){
                return <TransactionList isTextbook = {true} transactions = {textbookInfo.transactions} title = "Textbook Transactions"/>
            }
        }

        const render2x2 = () => {
            if(currentScanned === "STUDENT"){
                if(!this.state.transactionMode){
                    if(this.state.textbookListMode === "WITHDRAWN"){
                        return <button className = "custom-btn third" onClick = {this.switchTextbookList}> Needed Textbooks</button>
                    } else {
                        return <button className = "custom-btn third" onClick = {this.switchTextbookList}> Withdrawn Textbooks</button>
                    }
                }
            }
        }

        const render2x3 = () => {
            if(currentScanned === "STUDENT"){
                if(this.state.transactionMode){
                    return <button className = "custom-btn third" onClick = {this.switchTransactionMode}> Student Textbooks </button>
                } else {
                    return <button className = "custom-btn third" onClick = {this.switchTransactionMode}> Student Transactions </button>
                }
            }
        }

        const render2x4 = () => {
            if(currentScanned === "STUDENT"){
                return <button className = "custom-btn third" onClick = {this.getInvoice}> Print Invoice </button>
            }
        }

        const renderAlerts = () => {
            if (this.state.alerts.unknownScanned && !(currentScanned === "STUDENT" || currentScanned === "TEXTBOOK")){
                return <Error
                    heading = "UNKNOWN BARCODE"
                    message = {"The Barcode you've just Scanned: " + this.props.controller.state.currentBarcode + " is not in the Database!"}
                    dismissFunc = {() => this.setState({alerts : {unknownScanned : false}})}
                />
            }
        }


        return ( 
            <div>
                {this.connectionLost()}
                { renderAlerts() }
                <Container fluid>
                    {this.renderTitle("Textbook & Student Lookup")}
                    <Row className = "mt-3">
                        <Col>
                            <Container>
                                <Row className = "mb-3">
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
                            <Container>
                                <Row>
                                    <Col>
                                        {render1x2()}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs = "auto">
                                        {render2x2()}
                                    </Col>
                                    <Col xs = "auto">
                                        {render2x3()}
                                    </Col>
                                    <Col xs = "auto">
                                        {render2x4()}
                                    </Col>
                                </Row>
                            </Container>
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
 
export default Info;