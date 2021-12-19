import React, { Component } from 'react'
import {Modal, Button, Form, Container, Row, Col, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {studentSearch} from '../conversions'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import '../componentsCSS/headings.scss'

import helpIcon from "../icons/helpIcon.svg"
import "../componentsCSS/icons.scss"
import '../componentsCSS/buttons.scss'

// when a student is selected, acts as the scanner essentially

// props
// studentList --> list of students to be selected from
// callBackFunc --> function that will send the student id to

class StudentSearch extends Component {
    state = { 
        show : false,
        studentSelected : false,
        currentName : "",
        studentList : [],
        currentStudentList : [],
        currentRow : null
    }

    constructor(props){
        super(props)
        this.state.studentList = this.props.studentList
        this.state.currentStudentList = this.props.studentList
        console.log(this.state)
    }

    closeModal = () => {
        this.setState({
            show : false
        })
    }

    submit = () => {
        this.props.callBackFunc(this.state.currentRow.number)
        this.closeModal()
    }

    callModal = () => {
        this.setState({
            show : true
        })
    }

    searchChange = (e) => {
        this.setState({
            currentName : e.target.value,
            studentSelected : false,
            currentStudentList : studentSearch(e.target.value, this.state.studentList)
        })
    }

    rowSelected = (e, row, rowIndex) => {
        this.setState({
            currentName : row.name,
            currentRow : row,
            currentStudentList : studentSearch(row.name, this.state.studentList),
            studentSelected : true 
        })
    }

    studentSearch = (e) => {
        if(e.clientX !== 0 && e.clientY !== 0){ //makes sure button can only be activated with mouse
            e.currentTarget.blur()
            this.callModal()
        }
    }

    setFocus = (c) => {
        if(c != null){
            setTimeout(() => { //timeout somehow makes it focus? ok...
                c.focus()
            }, 1)
        }
    }



    render() {
        
        const renderModalButton = () => {
            if(this.state.studentSelected){
                return <button className = "custom-btn second" onClick = {this.submit}> Search </button>
            }
        }

        const renderCancelButton = () => {
            if(this.state.studentSelected){
                return <button className = "custom-btn first" onClick = {this.closeModal}> Cancel </button>
            } else{
                return <button className = "custom-btn second" onClick = {this.closeModal}> Cancel </button>
            }
        }

        const options = () => {
            return {sizePerPage : this.props.sizePerPage ? this.props.sizePerPage : 5}
        } 

        const columns = [
            {dataField : "name", text : "Name:", sort : true, style : {cursor : "pointer"}},
            {dataField : "number", text : "ID:", style : {cursor : "pointer"}}
        ]

        const rowEvents = {
            onClick : (e, row, rowIndex) => {
                this.rowSelected(e, row, rowIndex)
            }
        }

        const renderHelp = (props) => {
            return (
                <Tooltip {...props}>
                    To search a student, search their name in the search bar and click on the student's name within the list below. Afterwards a "search" button will appear.
                </Tooltip>
            )
        }

        const renderButtonHelp = () => {
            return (
                <Tooltip>
                    Click to search student by name.
                </Tooltip>
            )
        } 


        return ( 
            <div>
                <OverlayTrigger
                    placement = "top"
                    overlay = {renderButtonHelp()}
                >
                    <button className = "custom-btn second" onClick = {this.studentSearch}> Student Search </button>
                </OverlayTrigger>
                <Modal show = {this.state.show} onHide = {this.closeModal} backdrop = "static" size = "lg">
                        <Modal.Header>
                            <Container>
                                <Row>
                                    <Col>
                                        <h1 className = "h1Style">Student Search </h1>
                                    </Col>
                                </Row>
                            </Container>
                            <OverlayTrigger
                                placement = "left"
                                overlay = {renderHelp()}
                            >
                                <img src = {helpIcon} className = "help-icon"></img>     
                            </OverlayTrigger>
                        </Modal.Header>

                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <Form>
                                            <Form.Group>
                                                <Form.Label> Student Name: </Form.Label>
                                                <Form.Control 
                                                    ref = {c => (this.setFocus(c))}
                                                    value = {this.state.currentName.toString()} 
                                                    onChange = {this.searchChange} 
                                                    type = "text" 
                                                    placeholder = "Enter Student Name"
                                                >
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <BootstrapTable 
                                            keyField = "number"
                                            data = {this.state.currentStudentList}
                                            pagination = {paginationFactory(options())}
                                            columns = {columns}
                                            rowEvents = {rowEvents}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>

                        <Modal.Footer>
                            {renderModalButton()}
                            {renderCancelButton()}
                        </Modal.Footer>
                </Modal>
            </div>
         );
    }
}
 
export default StudentSearch;