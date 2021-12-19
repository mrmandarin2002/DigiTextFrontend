import React, { Component } from 'react'
import '../componentsCSS/headings.scss'
import '../componentsCSS/tables.scss'
import '../componentsCSS/buttons.scss'

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit'

import {Container, Col, Row, OverlayTrigger, Tooltip} from 'react-bootstrap';

import {textbooksToOrder} from '../conversions'
import {YesOrNo} from "./popupMessages"

const headerColor = '#400063'
const headerTextColor = 'white'


class EditableTextbookList extends Component {

    state = { //state does not dynamically update due to bug with bootstrap table
        selectedRow : -1,
        row : {},
        textbooksToOrder : false,
        expanded : [],
        alerts : {
            confirmRemoval : false
        }
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

    triggerTextbookRemoval = (e) => {
        e.currentTarget.blur()
        if(this.props.removalConfirmation){
            this.setState({
                alerts : {confirmRemoval : true}
            })
        } else {
            this.deleteTextbook(true)
        }
    }

    deleteTextbook = (check) => {
        if(this.props.removalConfirmation){
            if(check){
                this.props.deleteFunc(this.state.row)
            }
            this.setState({
                alerts : {confirmRemoval : false},
                expanded : []
            })
        } else {
            this.props.deleteFunc(this.state.row)
        }
    }

    addTextbook = (e) => {
        e.currentTarget.blur()
        if(this.props.addFunc){
            this.props.addFunc()
        }
    }

    mergeTextbook = (e) => {
        e.currentTarget.blur()
        if(this.props.mergeFunc){
            this.props.mergeFunc(this.state.row)
        }
    }

    cancelMerge = () => {
        if(this.props.cancelMergeFunc){
            this.props.cancelMergeFunc()
        }
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
        console.log(row, rowIndex)
        if(this.state.selectedRow == rowIndex && this.state.expanded.length != 0){
            this.setState({
                expanded : []
            })
        } else {
            this.setState({
                expanded : [row.title],
                selectedRow : rowIndex,
                row : row
            })
        }
        if(this.props.handleRowClick){
            this.props.handleRowClick(row)
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
            return[
                {dataField : "title", text : "Title", sort : true, style : {cursor : "pointer"}, headerStyle : (colum, colIndex) => {
                    return {backgroundColor : headerColor, color : headerTextColor}
                }},
                {dataField : "cost", text : "Cost",
                    formatter : this.costFormatter,
                    style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%", backgroundColor : headerColor, color : headerTextColor }
                }},
                {dataField : "amount", text : "Amount", style : {cursor : "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%",backgroundColor : headerColor, color : headerTextColor }
                    }},
                {dataField : "needed", text : "Needed", style : {cursor: "pointer"},
                    headerStyle : (colum, colIndex) => {
                        return {width : "15%",backgroundColor : headerColor, color : headerTextColor}
                    }}
            ]
        }

        const options = () => {
            return {sizePerPage : this.props.sizePerPage ? this.props.sizePerPage : 8}
        } 

        const renderButtons = () => {
            var buttonList = []
            if(this.props.cancelMergeEnabled){
                buttonList.push({onClick : this.cancelMerge, text : "Cancel Replace", style : "second"})
            }
            if(this.props.deleteEnabled){
                buttonList.push({onClick : this.triggerTextbookRemoval, text : "Remove Textbook", style : "first"})
            }
            if(this.props.mergeEnabled){
                buttonList.push({onClick : this.mergeTextbook, text : "Replace Textbook", style : "second"})
            }
            if(this.props.addEnabled){
                buttonList.push({onClick : this.addTextbook, text : this.props.addButtonText ? this.props.addButtonText : "Add Textbook", style : "second"})
            }

            if(buttonList.length){
                return (
                    <div>
                        {buttonList.map((button, index)=> (
                            <button className = {"custom-btn " + button.style + " mr-2"} key = {button.text} onClick = {button.onClick}> {button.text}</button>
                        ))}
                    </div>
                )
            } else{
                return <h2 className = "h2Style4"> No actions available </h2>
            }
        }

        const expandRow = {
            onlyOneExpanding : true,
            renderer : row => (
                <div>
                    {renderButtons()}
                </div>
            ),
            onExpand : this.handleOnExpand,
            expanded : this.state.expanded,
            nonExpandable : [this.props.nonExpandable]
        }

        const MyExportCSV = (props) => {

            const handleClick = () => {
                props.onExport()
            }

            const renderCSVTooltip = (props) => {
                if(!this.state.textbooksToOrder){
                    return (
                        <Tooltip id = "button-tooltip" {...props}>
                            Downloads an inventory of all textbooks as an csv file that can be opened in excel.
                        </Tooltip> 
                    )
                } else {
                    return (
                        <Tooltip id = "button-tooltip" {...props}>
                            Downloads an inventory of all textbooks that should be ordered as an csv file that can be opened in excel.
                        </Tooltip> 
                    )
                }
            }

            const renderNeededTooltip = (props) => {
                if(!this.state.textbooksToOrder){
                    return (
                        <Tooltip id = "button-tooltip" {...props}>
                            Displays list of textbooks that should be ordered for the upcoming school year.
                        </Tooltip>
                    )
                } else {
                    return (
                        <Tooltip id = "button-tooltip" {...props}>
                            Displays all textbooks.
                        </Tooltip>
                    )
                }
            }

            return (
                <div>
                    <Container className = "p-0">
                        <Row>
                            <Col xs = "auto">
                                <OverlayTrigger
                                    placement = "bottom"
                                    delay = {{show : 250, hide : 250}}
                                    overlay = {renderCSVTooltip()}
                                >
                                    <button className = "custom-btn second" onClick ={handleClick}> Export to CSV </button>
                                </OverlayTrigger>
                            </Col>
                            <Col xs = "auto">
                                <OverlayTrigger
                                    placement = "bottom"
                                    delay = {{show : 250, hide : 250}}
                                    overlay = {renderNeededTooltip()}
                                >
                                    <button 
                                        className = "ml-2 custom-btn second" 
                                        onClick = {() => {this.setState({textbooksToOrder : !this.state.textbooksToOrder})}}
                                    > 
                                    {this.state.textbooksToOrder ? "All Textbooks" : "Textbooks to Order" }
                                    </button>
                                </OverlayTrigger>           
                            </Col>
                        </Row>
                    </Container>
                    
                </div>
            )

        }

        const defineTable = () => {
            if(this.props.noPagination){
                return (<BootstrapTable 
                    className = "tableRowStyle"
                    keyField = "title"
                    data = {textbooks} 
                    columns = {defineColumns()}
                    expandRow = {expandRow}
                    defaultSorted = {defaultSorted()}
                    bordered = {false}
                    striped
                    hover
                    noDataIndication={ <h2 className = "h2StyleBold"> No Textbooks! </h2> }
                />)
            } else {
                if(this.props.exportCSV){
                    return (<ToolkitProvider
                        keyField = "title"
                        data = {this.state.textbooksToOrder ? textbooksToOrder(textbooks) : textbooks} 
                        columns = {defineColumns()}
                        exportCSV = {{
                            fileName : "textbook_inventory.csv"
                        }}
                    > 
                        {
                            props => (
                                <div>
                                    <BootstrapTable { ...props.baseProps 
                                    }
                                        className = "table-scroll"
                                        expandRow = {expandRow}
                                        pagination = {paginationFactory(options())}
                                        defaultSorted = {defaultSorted()}
                                        striped
                                        bordered = {false}
                                        hover
                                    />
                                    <MyExportCSV { ...props.csvProps }>Export CSV!!</MyExportCSV>
                                </div>
                            )
                        }
                    </ToolkitProvider>
                    )
                } else{
                    return (<BootstrapTable 
                        className = "tableRowStyle"
                        keyField = "title"
                        data = {textbooks} 
                        columns = {defineColumns()}
                        expandRow = {expandRow}
                        pagination = {paginationFactory(options())}
                        defaultSorted = {defaultSorted()}
                        striped
                        hover
                    />)
                }
            }
        }

        const renderAlerts = () => {
            if(this.state.alerts.confirmRemoval){
                return (<YesOrNo
                    title = "Confirm Removal"
                    message = {"Are you sure you want to remove all instances of " + this.state.row.title + " from the database?"}
                    callBackFunc = {this.deleteTextbook}
                />)
            }
        }

        return (
            <div>
                {renderAlerts()}
                <h1 className = "h1Style"> {listTitle} </h1>
                {defineTable()}
            </div>
        );
    }
}

export default EditableTextbookList
