import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../componentsCSS/headings.scss'

import TemplateWebpage from './TemplateWebpage'
import ManualBarcodeEntry from '../components/manualBarcodeEntry'
import { Container, Row, Col, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import TextbookList from '../components/textbookList'
import {word_to_condition, condition_to_word} from '../conversions'
import {Error, YesOrNo} from '../components/popupMessages'
import '../componentsCSS/buttons.scss'

class TextbookScanner extends TemplateWebpage {
    state = { 
        title : "Add Textbooks",
        valuesSet : false,
        deleteMode : false,
        currentTitle : "",
        currentCondition : 0,
        currentPrice : "",
        textbooksScanned : 0,
        textbooksDeleted : 0,

        alerts : {
            textbookScanned : false,
            studentScanned : false,
            studentScannedDel : false,
            unknownScannedDel : false, 
            deleteMode : false,
            setError : false,
            prematureScan : false,
            textbookOwned : false
        },
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyboardEvents);
    }

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyboardEvents);
    }

    handleKeyboardEvents = (event) => {
        if(event.key == "ArrowUp"){
            this.setState({
                currentCondition : this.state.currentCondition <= 0 ? this.state.currentCondition : this.state.currentCondition - 1
            })
        } else if(event.key == "ArrowDown"){
            this.setState({
                currentCondition : this.state.currentCondition >= 4 ? this.state.currentCondition : this.state.currentCondition + 1
            })
        } 
    }

    setValues = (e, keyboard = false) => {
        e.currentTarget.blur()
        e.preventDefault()
        if(e.clientX !== 0 && e.clientY !== 0){ //makes sure it's a mouse click
            if(!this.state.valuesSet){
                var price = parseFloat(this.state.currentPrice)
                if(this.state.currentTitle !== '' && !isNaN(price)){
                    this.setState({
                        currentPrice : price,
                        valuesSet : true
                    })
                } else{
                    this.setState({
                        alerts : {setError : true}
                    })
                }
            }
            else{
                this.setState({
                    textbooksScanned : 0,
                    valuesSet : false
                })
                this.props.controller.api.getAbstractTextbooks()
            }
        }
    }

    setDeletionMode = (e) => {
        e.currentTarget.blur()
        if(e.clientX !== 0 && e.clientY !== 0){
            if(!this.state.deleteMode){
                this.setState({
                    title : "Deletion Mode",
                    alerts : {deleteMode : true}
                })
            }  else{
                this.setState({
                    title : "Add Textbooks"
                })
                this.props.controller.api.getAbstractTextbooks()
            }
            this.setState({
                deleteMode : !this.state.deleteMode,
                textbooksScanned : 0,
                textbooksDeleted : 0
            })
        }
    }

    studentScanned = () => {
        if(!this.state.deleteMode){
            if(this.state.valuesSet){
                this.setState({
                    alerts : {studentScanned : true}
                })
            } else{
                this.setState({
                    alerts : {prematureScan : true}
                })
            }
        } else {
            this.setState({
                alerts : {
                    studentScannedDel : true
                }
            })
        }
    }

    textbookScanned = () => {
        if(!this.state.deleteMode){
            if(this.state.valuesSet){
                this.setState({
                    alerts : {textbookScanned : true}
                })
            } else{
                this.setState({
                    alerts : {prematureScan : true}
                })
            }
        } else {
            if(this.props.controller.state.textbookInfo.owner.id === 0){ //if textbook is assigned to anybody
                this.deleteTextbook()
            }
            else{
                this.setState({
                    alerts : {
                        textbookOwned : true
                    }
                })
            }
        }
    }

    unknownScanned = () => {
        if(!this.state.deleteMode){
            if(this.state.valuesSet){
                this.props.controller.api.addTextbook(this.props.controller.state.currentBarcode, this.state.currentTitle, this.state.currentPrice, this.state.currentCondition, this.textbookAdded)
                this.props.controller.api.getAbstractTextbooks()
                if(this.state.alerts.textbookScanned){
                    this.setState({
                        alerts : {textbookScaneed : false}
                    })
                }
            } else{
                this.setState({
                    alerts : {prematureScan : true}
                })
            }
        } else {
            this.setState({
                alerts : {
                    unknownScannedDel : true
                }
            })
        }
    }

    deleteTextbook = (check = true) => {
        this.props.controller.addNotification("Textbook Deleted!", "Textbook with barcode: " + this.props.controller.state.currentBarcode + " was deleted from database!", 3000)
        if(check){
            this.props.controller.api.deleteTextbook(this.props.controller.state.textbookInfo.number, this.textbookDeleted)
        }
        this.setState({
            alerts : {textbookOwned : false}
        })
    }

    textbookDeleted = () => {
        this.setState({
            textbooksDeleted : this.state.textbooksDeleted + 1
        })
    }

    textbookAdded = () => {
        this.props.controller.addNotification("Textbook Added!", this.state.currentTitle + " was added to the database!", 3000)
        this.setState({
            textbooksScanned : this.state.textbooksScanned + 1
        })
    }

    rowClicked = (row) => {
        this.setState({
            currentTitle : row.title,
            currentPrice : row.cost
        })
    } 

    onTitleChange = (e) => {
        this.setState({currentTitle : e.target.value})
        this.props.controller.setCurrentAbstractTextbooks(e.target.value)
        this.props.controller.setState({
            currentKeyWord : e.target.value
        })
    }


    render() { 

        const {currentAbstractTextbooks, textbookInfo} = this.props.controller.state

        const renderConditionHelp = () => {
            return (
                <Tooltip>
                    Feel free to use the arrow keys to help with selecting the condition!
                </Tooltip>
            )
        }

        const renderForm = () => {
            if(this.state.deleteMode){
                return (
                    <h1 className = "h1Style"> Scan a textbook to delete it! </h1>
                )
            } else{
                return (                          
                    <Form>
                        <Form.Row>
                            <Form.Group>
                                <Form.Label> <h2 className = "h2Style2">Textbook Title </h2> </Form.Label>
                                <Form.Control value = {this.state.currentTitle.toString()} disabled = {this.state.valuesSet} type = "text" placeholder = "Enter textbook title" onChange = {e => this.onTitleChange(e)}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                                <Form.Group>
                                    <Form.Label>  <h2 className = "h2Style2"> Condition </h2> </Form.Label>
                                    <OverlayTrigger
                                        placement = "right"
                                        overlay = {renderConditionHelp()}
                                        delay = {{show : 600, hide : 250}}
                                    >
                                        <Form.Control value = {condition_to_word(this.state.currentCondition)} as = "select" onChange = {e => this.setState({currentCondition : word_to_condition(e.target.value)})}>
                                            <option> New </option>
                                            <option> Good </option>
                                            <option> Fair </option>
                                            <option> Poor </option>
                                            <option> Destroyed </option>
                                        </Form.Control>
                                    </OverlayTrigger>
                                </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group>
                                <Form.Label> <h2 className = "h2Style2"> Price </h2> </Form.Label>
                                <Form.Control value = {this.state.currentPrice.toString()} disabled = {this.state.valuesSet} type = "text" placeholder = "Enter a price" onChange = {e => this.setState({currentPrice : e.target.value})}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row className = "mt-2">
                            {renderButton()}
                        </Form.Row>
                    </Form>
                )
            }
        }

        const renderButton = () => {
            if(!this.state.studentScannedDel && !this.state.unknownScannedDel && !this.state.alerts.deleteMode && !this.state.alerts.setError && !this.state.alerts.prematureScan && !this.state.alerts.textbookScanned){
                if(this.state.valuesSet){
                    return <button className = "custom-btn second" onClick = {e => this.setValues(e)}> Reset </button>
                } else{
                    return <button className = "custom-btn second" onClick = {e => this.setValues(e)}> Set Values </button>
                }
            }
        }

        const renderDeleteButton = () => {
            if(this.state.deleteMode){
                return <button className = "custom-btn first" onClick = {e => this.setDeletionMode(e)}> Switch to Add Mode </button>
            } else{
                return <button className = "custom-btn first" onClick = {e => this.setDeletionMode(e)}> Switch to Deletion Mode </button>
            }
        }

        const renderTextbookNums = () => {
            if(this.state.deleteMode){
                return <h2 className = "h2Style3"> Number of Textbooks Deleted: {this.state.textbooksDeleted} </h2>
            } else{
                return <h2 className = "h2Style3"> Number of Textbooks Scanned: {this.state.textbooksScanned} </h2>
            }
        }

        const renderList = () => {
            if(!this.state.deleteMode && !this.state.valuesSet){
                return <TextbookList rowEventFunc = {this.rowClicked} textbooks = {currentAbstractTextbooks} listTitle = {"Similar Textbooks"} type = {"ABSTRACT+"}/>
            }
        }

        const renderAlerts = () => {
            if(this.state.alerts.deleteMode){
                return <Error 
                    heading = "Warning!" 
                    message = {"You are now entering textbook deletion mode! Scanning a textbook will remove it from the database..."}
                    dismissFunc = {() => this.setState({alerts : {deleteMode : false}})}
                />
            } else if (this.state.alerts.studentScannedDel){
                return <Error
                    heading = "Error!"
                    message = {"This barcode belongs to the student " + this.props.controller.state.studentInfo.name + "... If you wish to delete him / her please find another means to do so."}
                    dismissFunc = {() => this.setState({alerts : {studentScannedDel : false}})}
                />
            } else if (this.state.alerts.unknownScannedDel){
                return <Error
                
                    heading = "Error!"
                    message = {"This barcode is not in the database hence you cannot delete it...."}
                    dismissFunc = {() => this.setState({alerts : {unknownScannedDel : false}})}
                />
            } else if (this.state.alerts.setError){
                return <Error 
                    heading = "Error Setting Values!"
                    message = {"Make sure that the title isn't empty and the price is a number!"}
                    dismissFunc = {() => this.setState({alerts : {setError : false}})}
                />
            } else if (this.state.alerts.prematureScan){
                return <Error 
                    heading = "Error... Please Set Values!"
                    message = {"Please set values before you start scanning in barcodes"}
                    dismissFunc = {() => this.setState({alerts : {prematureScan : false}})}
                />
            } else if (this.state.alerts.textbookScanned){
                return <Error 
                    heading = "Error... Textbook Scanned!"
                    message = {"This barcode is currently assigned to the textbook: " + this.props.controller.state.textbookInfo.title + "..."}
                    dismissFunc = {() => this.setState({alerts : {textbookScanned : false}})}
                />
            } else if (this.state.alerts.studentScanned){
                return <Error 
                    heading = "Error... Student Scanned!"
                    message = {"This barcode is currently assigned to the student: " + this.props.controller.state.studentInfo.name + "..."}
                    dismissFunc = {() => this.setState({alerts : {studentScanned : false}})}
                />
            } else if (this.state.alerts.textbookOwned){
                return <YesOrNo
                    title = "Textbook Owned By Student"
                    message = {"The textbook " + textbookInfo.title + " is currently owned by " + textbookInfo.owner.name + ". Would you like to delete it anyways?"} 
                    callBackFunc = {this.deleteTextbook}
                />
            }
        }

        return ( 
            <div>
                {this.connectionLost()}
                {renderAlerts()}
                <Container fluid>
                    {this.renderTitle("Add / Delete Textbooks")}
                    <Row className = "mt-1 ml-1">
                        <Col>
                            <Container>
                                <Row>
                                    <Col>
                                        <h2 className = "h2Style3"> Current Barcode: {this.props.controller.state.currentBarcode}</h2>
                                    </Col>
                                </Row>
                                <Row className>
                                    <Col>
                                        {renderTextbookNums()}
                                    </Col>
                                </Row>
                                <Row className = "mt-3">
                                    <Col>
                                        {renderForm()}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col className = "mt-1">
                            {renderList()}
                        </Col>
                    </Row>
                    <Row style = {{position: "absolute", bottom: "16%"}} className = "mb-3 ml-1">
                        <Col>
                            {renderDeleteButton()}
                        </Col>
                    </Row>
                    <Row style = {{position: "absolute", bottom: "9%"}} className = "mb-2 ml-1">
                        <Col>
                            <ManualBarcodeEntry barcodeFunc = {this.props.controller.scanner.barcodeScanned}/>
                        </Col>
                    </Row>
                    {this.renderBackButton()}
                </Container>
            </div>
        );
    }
}
 
export default TextbookScanner;