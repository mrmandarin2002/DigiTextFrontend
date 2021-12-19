import React, { Component } from 'react'
import '../componentsCSS/headings.scss'
import '../componentsCSS/tables.scss'
import '../componentsCSS/buttons.scss'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const headerColor = '#400063'
const headerTextColor = 'white'

// this whole file is scuffed af and will have to be rewritten when I have the time
// like holy shit it's disgusting

class TextbookList extends Component {

    state = {
        currentRow : null,
        expanded : []
    }

    //converts numerical condition to text
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

    onRowClick = (e, row, rowIndex) => {
        if(this.props.rowEventFunc){
            this.props.rowEventFunc(row)
        }
    }

    removeTextbook = () => {
        this.props.removeTextbookFunc(this.state.currentRow.number)
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
        if(this.state.currentRow === row){
            this.setState({
                currentRow : null,
                expanded : []
            })
        } else{
            this.setState({
                expanded : [row.title],
                currentRow : row
            })
        }
    }

    render(){

        const {textbooks, listTitle} = this.props

        const defaultSorted = () => {
            if(this.props.type === "ABSTRACT+"){
                return [{dataField : "title", order : 'asc'}]
            }
        }

        const defineColumns = () =>{
            if (this.props.type === "ABSTRACT"){
                return [
                    {dataField : "title", text : "Title",
                        headerStyle : (colum, colIndex) => {
                            return {backgroundColor : headerColor, color : headerTextColor}
                        }},
                    {dataField : "cost", text : "Cost",
                        formatter : this.costFormatter,
                        headerStyle : (colum, colIndex) => {
                            return {backgroundColor : headerColor, color : headerTextColor}
                        }}
                ]
            } 
            else if(this.props.type === "ABSTRACT+"){
                return[
                    {dataField : "title", text : "Title", sort : true, style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                    }},
                    {dataField : "cost", text : "Cost",
                        formatter : this.costFormatter,
                        style : {cursor : "pointer"},
                        headerStyle : (colum, colIndex) => {
                            return {width : "15%", backgroundColor : headerColor, color : headerTextColor}
                        }
                    },
                    {dataField : "amount", text : "Amount", style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%", backgroundColor : headerColor, color : headerTextColor}
                    }},
                    {dataField : "needed", text : "Needed", style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%", backgroundColor : headerColor, color : headerTextColor}
                    }}
                ]
            }
            else{
                return [
                    {dataField : "title", text : "Title",
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                    }, style : {cursor : "pointer"}},
                    {dataField : "cost", text : "Cost",
                        formatter : this.costFormatter,
                        headerStyle : (colum, colIndex) => {
                            return {width : '11%', backgroundColor : headerColor, color : headerTextColor}
                        }, style : {cursor : "pointer"}
                    },
                    {dataField : "condition", text : "Condition",
                        formatter : this.conditionFormatter, 
                        headerStyle : (colum, colIndex) => {
                            return {width : '15%', backgroundColor : headerColor, color : headerTextColor}
                        },
                        formatExtraData: {
                            0 : "New",
                            1 : "Good",
                            2 : "Fair",
                            3 : "Bad",
                            4 : "Destroyed",
                            5 : "Lost"
                    }, style : {cursor : "pointer"}},
                    {dataField : "owner.name", text : "Owner",
                    headerStyle : (colum, colIndex) => {
                        return {backgroundColor : headerColor, color : headerTextColor}
                    }, style : {cursor : "pointer"}},
                    {dataField : "number", text : "ID",                        
                    headerStyle : (colum, colIndex) => {
                        return {width : '13%',  backgroundColor : headerColor, color : headerTextColor}
                    }, style : {cursor : "pointer"}}
                ]
            }
        }

        const options = () => {
            if(this.props.type === "ABSTRACT+"){
                return{
                    sizePerPage : this.props.sizePerPage ? this.props.sizePerPage : 8
                }
            }
            return {
                sizePerPage : 6
            }

        } 

        const defineRowButton = () => {
            if(this.props.type === "ABSTRACT+" || this.props.type === "WITHDRAWN"){
                return (
                    <button className = "custom-btn second" onClick = {this.removeTextbook}> Return Textbook </button>
                )
            } 
        }

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                this.onRowClick(e, row, rowIndex)
            }
        }

        
        const expandRow = {
            onlyOneExpanding : true,
            renderer : row => (
                <div>
                    {defineRowButton()}
                </div>
            ),
            onExpand : this.handleOnExpand,
            expanded : this.state.expanded,
        }

        const defineTable = () => {
            if(this.props.type === "ABSTRACT+"){
                if(this.props.noPagination){
                    return (<BootstrapTable 
                        className = "tableRowStyle"
                        keyField = "title"
                        data = {textbooks} 
                        columns = {defineColumns()}
                        rowEvents = {rowEvents}
                        defaultSorted = {defaultSorted()}
                        bordered = {false}
                        striped
                        hover
                    />)
                } else{
                    return (<BootstrapTable 
                        className = "tableRowStyle"
                        keyField = "title"
                        data = {textbooks} 
                        columns = {defineColumns()}
                        rowEvents = {rowEvents}
                        pagination = {paginationFactory(options())}
                        defaultSorted = {defaultSorted()}
                        striped
                        bordered = {false}
                        hover
                    />)
                }
            } 
            else if(this.props.type === "ABSTRACT"){
                return (<BootstrapTable 
                    keyField = "title"
                    data = {textbooks} 
                    columns = {defineColumns()}
                    pagination = {paginationFactory(options())}
                    striped
                    bordered = {false}
                    expandRow = {expandRow}
                    hover
                />)
            } else if(this.props.type === "NORMAL" || this.props.type === "WITHDRAWN"){ //used in student lookup
                return(<BootstrapTable
                    keyField = "title"
                    data = {textbooks} 
                    columns = {defineColumns()}
                    pagination = {paginationFactory(options())}
                    striped
                    bordered = {false}
                    expandRow = {expandRow}
                    hover
                />)
            } 
            else{
                return (<BootstrapTable 
                    keyField = "title"
                    data = {textbooks} 
                    columns = {defineColumns()}
                    pagination = {paginationFactory(options())}
                    striped
                    bordered = {false}
                    expandRow = {expandRow}
                    hover
                />)
            }
        }

        return (
            <div>
                <h1 className = "h1Style"> {listTitle} </h1>
                {defineTable()}
            </div>
        );
    }
}

export default TextbookList
