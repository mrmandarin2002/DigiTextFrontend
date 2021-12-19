//page where information regarding textbooks and students can be obtained
import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../webpagesCSS/infoCSS.scss'
import '../componentsCSS/headings.scss'

import TemplateWebpage from './TemplateWebpage'

import ManualBarcodeEntry from '../components/manualBarcodeEntry'
import {StudentInfo} from '../components/infoComponents'
import StudentSearch from '../components/studentSearch'
import { Container, Row, Col, Button, ButtonGroup, Form, Spinner} from 'react-bootstrap';
import {Error} from '../components/popupMessages'
import download from 'downloadjs'

class Printer extends TemplateWebpage {
    state = {
        studentScanned : false,
        currentNumberOfSheets : "",
        currentMode : "INVOICE",
        barcodesReady : false,
        loadingInvoices : false,
        alerts : {
            notNumber : false
        },
        balanceLowerBound : -1,
    }

    setToBarcode = () => {
        this.setState({
            studentScanned : false,
            currentMode : "BARCODE"
        })
    }

    setToInvoice = () => {
        this.setState({
            currentMode : "INVOICE"
        })
    }
    
    generateBarcodes = (e) => {
        e.currentTarget.blur()
        e.preventDefault();
        if(!isNaN(this.state.currentNumberOfSheets) && this.state.currentNumberOfSheets){
            this.props.controller.api.getBarcodes(parseInt(this.state.currentNumberOfSheets), this.barcodesReady)
        } else{
            this.setState({
                alerts : {
                    notNumber : true
                }
            })
        }
    }

    barcodesReady = (barcodes, filename) => {
        this.setState({
            barcodes : barcodes,
            barcodesReady : true
        })
        this.downloadBarcodes(filename)
    }

    downloadBarcodes = (filename) => {
        console.log("filename")
        download(this.state.barcodes, filename, "application/pdf")
    }

    getInvoice = (e) => {
        e.currentTarget.blur()
        e.preventDefault();
        this.props.controller.api.getInvoice(this.props.controller.state.studentInfo.number, this.downloadInvoice)
    }

    getAllInvoices = (e) => {
        e.currentTarget.blur()
        e.preventDefault();
        this.props.controller.api.getInvoicesBound(this.downloadInvoice, -1)
        this.setState({
            loadingInvoices : true,
            studentScanned : false
        })
    }

    getAllNeeded = (e) => {
        e.currentTarget.blur()
        e.preventDefault()
        this.props.controller.api.getAllNeeded()
        this.setState({
            loadingInvoices : true,
            studentScanned : false
        })
    }

    getInvoicesBound = (e) => {
        e.currentTarget.blur()
        e.preventDefault();
        if(!isNaN(this.state.balanceLowerBound)){
            this.props.controller.api.getInvoicesBound(this.downloadInvoice, this.state.balanceLowerBound)
            this.setState({
                loadingInvoices : true,
                studentScanned : false
            })
        }
    }

    studentScanned = () => {
        this.setState({
            studentScanned : true
        })
    }

    downloadInvoice = (invoice, filename) => {
        console.log(filename)
        download(invoice, filename, "application/pdf")
        this.setState({
            loadingInvoices : false
        })
    }

    render() { 

        const {studentInfo} = this.props.controller.state

        const renderAlerts = () => {
            if(this.state.alerts.notNumber){
                return <Error                   
                    heading = "ERROR! Not a Number!"
                    message = {"Please make sure you enter a number as a value!"}
                    dismissFunc = {() => this.setState({alerts : {notNumber : false}})}
                />
            }
        }

        const render1x1 = () => {
            if(this.state.currentMode == "BARCODE"){
                return(
                    <Col className = "text-center">
                        <Form>
                            <Form.Group>
                                <Form.Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Col xs = "auto">
                                        <Form.Label> <h2 className = "h2Style2"> Barcode Sheets to Print </h2> </Form.Label>
                                        <Form.Control 
                                            type = "text" 
                                            placeholder = "Enter number of sheets"
                                            onChange = {e => this.setState({currentNumberOfSheets : e.target.value})}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row className = "mt-3" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <button className = "text-center custom-btn second" onClick = {this.generateBarcodes}> Download Barcodes </button>
                                </Form.Row>
                            </Form.Group>
                        </Form>
                    </Col>
                )
            } else if (this.state.currentMode == "INVOICE"){
                if(this.state.studentScanned){
                    return (
                            <Col className = "text-center">
                                <StudentInfo studentInfo = {studentInfo}/>
                            </Col>
                    )
                } else if (!this.state.loadingInvoices){
                    // return (
                    //     <Col className = "text-center">
                    //         <h2 className = "h2Style2"> Please Scan / Search for a Student </h2>
                    //     </Col>
                    // )  
                }
            }
        }

        const render1x2 = () => {
            if(this.state.studentScanned){
                return (
                    <Col className = "text-center">
                        <button className = "text-center custom-btn second" onClick = {this.getInvoice}> Download Student Invoice </button>
                    </Col>
                )
            }
        }
 
        const renderManualEntry = () => {
            if(this.state.currentMode == "INVOICE" && !this.state.loadingInvoices){
                return (
                    <div>
                        <Row style = {{position: "absolute", bottom: "11%"}} className = "ml-1">
                            <Col xs = "auto">
                                <ManualBarcodeEntry barcodeFunc = {this.props.controller.scanner.barcodeScanned}/>
                            </Col>
                            <Col>
                                <StudentSearch studentList = {this.props.controller.state.studentList} callBackFunc = {this.props.controller.scanner.barcodeScanned}/>
                            </Col>
                        </Row>
                    </div>
                )
            }
        }

        const renderAllInvoicesButton = () => {
            if(this.state.currentMode == "INVOICE"){
                if(this.state.loadingInvoices){
                    return (
                        <div>
                            <Row className = "mt-3">
                                <Col className = 'text-center'>
                                    <Spinner animation = "border" role = "status"></Spinner>
                                </Col>
                            </Row>
                            <Row className = "mt-2">
                                <Col className = 'text-center'>
                                    <h2 className = "h2Style3"> Please be patient, processing all the invoices takes a while! (~30 seconds) </h2>
                                </Col>
                            </Row>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <Row className = "mt-4">
                                <Col className = 'text-center'>
                                    <button className = "text-center custom-btn second" onClick = {this.getAllInvoices}> Download All Invoices </button>
                                </Col>
                            </Row>
                            {/* <Row className = "mt-4">
                                <Col className = 'text-center'>
                                    <button className = "text-center custom-btn second" onClick = {}> Download All Needed </button>
                                </Col>
                            </Row> */}
                            <Row className = "mt-4">
                                <Col className = 'text-center'>
                                    <Form>
                                        <Form.Group>
                                            <Form.Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                <Col xs = "auto">
                                                    <Form.Label> <h2 className = "h2Style2"> Invoice Sort </h2> </Form.Label>
                                                    <Form.Control 
                                                        type = "text" 
                                                        placeholder = "Balance Owed"
                                                        onChange = {e => this.setState({balanceLowerBound : e.target.value.toString()})}
                                                    />
                                                </Col>
                                            </Form.Row>
                                            <Form.Row className = "mt-3" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                <button className = "text-center custom-btn second" onClick = {this.getInvoicesBound}> Download Invoices </button>
                                            </Form.Row>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            }
        }

        return (
            <div>
                {this.connectionLost()}
                {renderAlerts()}
                <Container fluid>
                    {this.renderTitle("Printer")}
                    <Row className = "mt-3">
                        <Col className = "text-center">
                            <ButtonGroup>
                                <Button onClick = {this.setToBarcode} variant = {this.state.currentMode == "BARCODE" ? "primary" : "secondary"}> Barcode Printer </Button>
                                <Button onClick = {this.setToInvoice} variant = {this.state.currentMode == "INVOICE" ? "primary" : "secondary"}> Invoice Printer </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    {renderAllInvoicesButton()}
                    <Row className = "mt-3">
                        {render1x1()}
                    </Row>
                    <Row className = "mt-2">
                        {render1x2()}
                    </Row>
                    {renderManualEntry()}
                    {this.renderBackButton()}
                </Container>
            </div>
        );
    }
}
 
export default Printer;