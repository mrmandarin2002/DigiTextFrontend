//page where information regarding textbooks and students can be obtained
import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../webpagesCSS/infoCSS.scss'
import '../componentsCSS/headings.scss'
import TemplateWebpage from './TemplateWebpage'


import EditableTextbookList from '../components/editableTextbookList'
import { Container, Row, Col, Form} from 'react-bootstrap';

class TextbookManagement extends TemplateWebpage {
    state = { 
        currentTextbook : "",
        currentMode : "EDIT",
        tempList : [],
        badTextbook : null
    }

    setToEdit = () => {
        this.setState({
            currentMode : "EDIT"
        })
    }

    componentDidMount = () => {
        this.props.controller.api.getAbstractTextbooks()
        this.props.controller.setCurrentAbstractTextbooks(this.state.currentTextbook)
    }


    onTextbookChange = (e) => {
        this.setState({
            currentTextbook : e.target.value,
        })
        this.props.controller.setCurrentAbstractTextbooks(e.target.value)
        this.props.controller.setState({
            currentKeyWord : e.target.value
        })
    }

    deleteTextbook = (row) => {
        this.props.controller.addNotification("Deleting Textbook", row.title + " deleted from the database!", 5000)
        this.props.controller.api.deleteAbstractTextbook(row.id, this.deleteDone)
    }

    deleteDone = () => {
        this.props.controller.api.getAbstractTextbooks()
        this.props.controller.setCurrentAbstractTextbooks(this.state.currentTextbook)
    }

    mergeTextbook = (row) => {
        console.log(row)
        console.log(this.state.badTextbok)
        if(this.state.currentMode == "EDIT"){
            this.setState({
                currentMode : "MERGE",
                tempList : this.props.controller.state.currentAbstractTextbooks,
                badTextbook : row
            })
        } else{
            this.props.controller.addNotification("Merging Textbook", "Replacing " + this.state.badTextbook.title + " with " + row.title, 5000)
            this.props.controller.api.mergeTextbooks(this.mergeDone, this.state.badTextbook.id, row.id)
        }
    }

    mergeDone = () => {
        this.props.controller.api.getAbstractTextbooks()
        this.props.controller.setCurrentAbstractTextbooks(this.state.currentTextbook)
        this.setState({
            currentMode : "EDIT",
            badTextbook : null
        })
    }

    cancelMerge = () => {
        console.log("YAY")
        this.setState({
            currentMode : "EDIT",
            badTextbook : null
        })
    }

    handleMainRowClick = (row) => {
        this.setState({
            badTextbook : row
        })
    }

    render() { 

        const {currentAbstractTextbooks} = this.props.controller.state

        const renderAlerts = () => {
            
        }

        const renderMainForm = () => {
            if(this.state.currentMode == "EDIT"){
                return (
                    <Row className = "text-center">
                        <Col>
                            <Form>
                                <Form.Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <Form.Group>
                                        <Form.Label> Textbook Search </Form.Label>
                                        <Form.Control value = {this.state.currentTextbook.toString()} readOnly = {this.state.currentMode == "EDIT" ? false : true} onChange = {this.onTextbookChange} type = "text" placeholder = "Enter Textbook Name"/>
                                    </Form.Group>
                                </Form.Row>
                            </Form>
                        </Col>
                    </Row>
                )
            } else{
                return (
                    <Row className = "mt-4 mb-4">
                        <Col>
                            <h2 className = "h2Style2">Selected Textbook: {this.state.badTextbook.title}</h2>
                        </Col>
                    </Row>
                )
            }
        }

        const renderMainList = () => {

            return (
                <Container>
                    {renderMainForm()}
                    <Row>
                        <Col>
                            <EditableTextbookList 
                                cancelMergeFunc = {this.cancelMerge}
                                cancelMergeEnabled = {this.state.currentMode == "EDIT" ? false : true}
                                mergeEnabled = {this.state.currentMode == "EDIT" ? true : false}
                                mergeFunc = {this.mergeTextbook}
                                deleteFunc = {this.deleteTextbook}
                                deleteEnabled = {this.state.currentMode == "EDIT" ? true : false} 
                                sizePerPage = {6} 
                                removalConfirmation = {true}
                                textbooks = {this.state.currentMode == "EDIT" ? currentAbstractTextbooks : this.state.tempList} 
                                handleRowClick = {this.handleMainRowClick}
                                type = {"ABSTRACT+"}
                                exportCSV = {true}//{this.state.currentMode == "EDIT" ? true : false}
                            />
                        </Col>
                    </Row>
                </Container>
            )
        }

        const renderMerge = () => {
            if(this.state.currentMode === "MERGE"){
                return(
                    <Col>
                        <Container>
                            <Row className="text-center">
                                <Col>
                                    <Form>
                                        <Form.Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                            <Form.Group>
                                                <Form.Label> Textbook Search </Form.Label>
                                                <Form.Control value = {this.state.currentTextbook.toString()} onChange = {this.onTextbookChange} type = "text" placeholder = "Enter Textbook Name"/>
                                            </Form.Group>
                                        </Form.Row>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <EditableTextbookList 
                                        mergeEnabled = {true}
                                        mergeFunc = {this.mergeTextbook}
                                        sizePerPage = {7} 
                                        textbooks = {currentAbstractTextbooks} 
                                        nonExpandable = {this.state.badTextbook ? this.state.badTextbook.title : null}
                                        type = {"ABSTRACT+"}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                )
            }
        }

        return ( 
            <div>
                {this.connectionLost()}
                {renderAlerts()}
                <Container fluid>
                    {this.renderTitle("Textbook Management")}
                    <Row>
                        <Col>
                            {renderMainList()}
                        </Col>      
                        {renderMerge()}
                    </Row>
                    {this.renderBackButton()}
                </Container>
            </div>
         );
    }
}
 
export default TextbookManagement;