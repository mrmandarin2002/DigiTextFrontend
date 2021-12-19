import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import EditableTextbookList from '../components/editableTextbookList'

const headerColor = '#400063'
const headerTextColor = 'white'

class CourseList extends Component {

    state = {
        currentRow : null,
        currentIndex : -1,
        expanded : []
    }

    columns = () => {
        if(!this.props.identical){
            return [
                {dataField : "id", text : "#" , style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "7%", backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "name", text : "Course Name", sort : true , style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "teacher", text : "Teacher" , style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "amount", text : "Classes" , style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%", backgroundColor : headerColor, color : headerTextColor}
                }}
            ]
        } else{
            return [
                {dataField : "id", text : "#" , style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "7%", backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "name", text : "Course Name", sort : true, style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "teacher", text : "Teacher", style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "course_number", text : "ID", style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%", backgroundColor : headerColor, color : headerTextColor}
                }}
            ]
        }
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
        console.log(row, rowIndex)
        if(this.state.currentIndex != rowIndex || this.state.currentRow == null){
            this.setState({
                currentRow : row,
                currentIndex : rowIndex,
                expanded : [row.course_number]
            })
        } else {
            this.setState({
                currentRow : null,
                expanded : []
            })
        }
        this.props.onRowClick(e, row, rowIndex)
    }


    render(){

        const {courses, title} = this.props
        

        const options = {
            sizePerPage : this.props.sizePerPage ? this.props.sizePerPage : 4
        }

        const expandRow = {
            onlyOneExpanding : true,
            renderer : row => (
                <div>
                    <EditableTextbookList 
                        deleteFunc = {this.props.deleteTextbookFunc}
                        textbooks = {courses[row.id - 1].textbooks}
                        type = "ABSTRACT+"
                        noPagination = {true}
                        deleteEnabled = {true}
                    />
                </div>
            ),
            expanded : this.state.expanded,
            onExpand : this.handleOnExpand

        }

        return (
            <div>
                <h1 className = "h1Style"> {title} </h1>
                <BootstrapTable 
                    keyField = "course_number"
                    data = {courses}
                    columns = {this.columns()}
                    expandRow = {expandRow}
                    pagination = {paginationFactory(options)}
                    striped
                    hover
                />
            </div>
        );
    }
}

export default CourseList