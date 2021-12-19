import React, { Component } from 'react'
import '../componentsCSS/headings.scss'
import '../componentsCSS/tables.scss'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const headerColor = '#400063'
const headerTextColor = 'white'


class TransactionList extends Component {

    conditionFormatter(cell, row, rowIndex, formatExtraData){
        return (
            <i>
                {formatExtraData[cell]}
            </i>
        );
    }

    costFormatter(cell, row, rowIndex, formatExtraData){
        return (
            <i>
                {'$' + cell.toString()}
            </i>
        )
    }

    dateFormatter(cell, row, rowIndex, formatExtraData){
        var date = "N/A"
        if(cell != null){
            date = new Date(cell)
            console.log(date)
            date = date.toLocaleDateString()
        }
        return (
            <i>
                {date}
            </i>
        )
    }

    render() { 
        const {transactions} = this.props
        
        const columns = [
            {dataField : "id", text : "#", sort : true, headerStyle : (colum, colIndex) => {
                return {width : '7%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "date", text : "Date", formatter : this.dateFormatter, headerStyle : (colum, colIndex) => {
                return {width : '13%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "type", text : "Type", headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "cost", text : "Cost", formatter : this.costFormatter, headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "textbookInfo.title", text : "Title", headerStyle : (colum, colIndex) => {
                return {backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "textbookInfo.condition", text : "Condition", formatter : this.conditionFormatter, formatExtraData: {
                0 : "New",
                1 : "Good",
                2 : "Fair",
                3 : "Bad",
                4 : "Destroyed"
            }, headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }},
            //{dataField : "textbookInfo.cost", text : "Cost", formatter : this.costFormatter}
        ]

        const textbookColumns = [
            {dataField : "id", text : "#", sort : true, headerStyle : (colum, colIndex) => {
                return {width : '7%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "date", text : "Date", formatter : this.dateFormatter, headerStyle : (colum, colIndex) => {
                return {width : '13%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "type", text : "Type", headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "cost", text : "Cost", formatter : this.costFormatter, headerStyle : (colum, colIndex) => {
                return {width : '10%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "origin", text : "From", headerStyle : (colum, colIndex) => {
                return {backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "destin", text : "To",  headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }},
            {dataField : "condition", text : "Condition", formatter : this.conditionFormatter, formatExtraData: {
                0 : "New",
                1 : "Good",
                2 : "Fair",
                3 : "Bad",
                4 : "Destroyed"
            }, headerStyle : (colum, colIndex) => {
                return {width : '17%', backgroundColor : headerColor, color : headerTextColor}
            }}
        ]

        const options = {
            sizePerPage : 5
        }

        return (
            <div>
                <h1 className = "h1Style"> {this.props.title} </h1>
                <BootstrapTable 
                    keyField = "id"
                    data = {transactions}
                    columns = {this.props.isTextbook ? textbookColumns : columns}
                    pagination = {paginationFactory(options)}
                    striped
                    bordered = {false}
                    hover
                />
            </div>
        );
    }
}
 
export default TransactionList;