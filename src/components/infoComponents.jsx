//file containts the components that displays textbook and student info

import React, { Component } from 'react'

import {condition_to_word} from '../conversions'

import { Container, OverlayTrigger, Tooltip} from 'react-bootstrap';

import '../componentsCSS/headings.scss'
import '../componentsCSS/tables.scss'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const headerColor = '#400063'
const headerTextColor = 'white'

function kelsch_comma(name){
    var words = name.split(' ')
    return words.join(', ')
}

class StudentInfo extends Component {

    render() { 
        const {studentInfo} = this.props

        const renderOwedHelp = () => {
            return (
                <Tooltip> The total value of a student's withdrawn textbooks and of damage fees. </Tooltip>
            )
        }

        return (
            <div>
                <Container fluid>
                    <h1 className = "h1Style"> Student Info </h1>
                    <h2 className = "h2Style"> Name : {kelsch_comma(studentInfo.name)} </h2>
                    <h2 className = "h2Style"> Barcode ID : {studentInfo.number}</h2>
                    <h2 className = "h2Style"> Total Balance : {'$' + studentInfo.moneyOwed.toString()}</h2>
                </Container>
            </div>
        );


    }
}

class TextbookInfo extends Component {
    render() { 
        const {textbookInfo} = this.props

        const renderName = () => {
            console.log(this.props)
            if(this.props.highlightName){
                return <h2 className = "h2StyleRed"> Owner : {kelsch_comma(textbookInfo.owner.name)} </h2>
            } else {
                return <h2 className = "h2Style"> Owner : {kelsch_comma(textbookInfo.owner.name)} </h2>
            }
        }

        return ( 

            <div>
                <Container fluid>
                    <h1 className = "h1Style"> {this.props.title || this.props.noTitle ? this.props.title : "Textbook Info"} </h1>
                    <h2 className = "h2Style"> Title : {textbookInfo.title}</h2>
                    <h2 className = "h2Style"> Cost : {'$' + textbookInfo.cost}</h2>
                    <h2 className = "h2Style"> Condition : {condition_to_word(textbookInfo.condition)}</h2>
                    {renderName()}
                    <h2 className = "h2Style"> ID : {textbookInfo.number}</h2>
                </Container>
            </div> 
        );
    }
}


class CourseList extends Component {
    render(){

        const {studentCourses} = this.props
        
        const columns = [
            {dataField : "name", text : "Course Name", sort : true,
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
            {dataField : "teacher", text : "Teacher",
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
            {dataField : "course_number", text : "ID",
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }}
        ]

        const options = {
            sizePerPage : 4
        }

        return (
            <div>
                <Container fluid>
                    <h1 className = "h1Style"> Student Courses </h1>
                    <BootstrapTable 
                        keyField = "course_number"
                        data = {studentCourses}
                        columns = {columns}
                        pagination = {paginationFactory(options)}
                        striped
                        hover
                        bordered = {false}
                    />
                </Container>
            </div>
        );
    }
}



 
export {StudentInfo, TextbookInfo, CourseList}