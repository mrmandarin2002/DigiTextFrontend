import './Background.css' //unfortunately all webpages have to important this to change the background color
import TemplateWebpage from './TemplateWebpage'
import '../componentsCSS/headings.scss'
import BootstrapTable from 'react-bootstrap-table-next';

import { Container, Row, Col} from 'react-bootstrap';
import {timeConversion} from '../conversions'

const headerColor = 'black'
const headerTextColor = 'white'
const statsRefreshRate = 10000 //in ms


class Stats extends TemplateWebpage {
    state = { 
        totalNumOfTextbooks : 0,
        totalWithdrawn : 0,
        totalWorth : 0,
        totalOwed : 0,
        latest_transactions : [],
        unmmounting : false,
        numberOfTransactions : this.props.controller.getNumberOfRows(8)
    }

    constructor(props){
        super(props)
        this.props.controller.state.getStats = true
        this.getStats()
    }

    windowSizeChange = () => {
        this.setState({
            numberOfTransactions : this.props.controller.getNumberOfRows(8)
        }) 
        console.log(this.state)
    }

    getStats = () => {
        //disgusting way of using state but whatever
        if(this.props.controller.state.getStats){
            this.props.controller.api.getStats(this.state.numberOfTransactions, this.setStats)
            setTimeout(this.getStats, statsRefreshRate)
        }
    }

    setStats = (stats) => {
        stats.latest_transactions = stats.latest_transactions.reverse()
        for(var i = 0; i < stats.latest_transactions.length; i++){
            stats.latest_transactions[i].date = timeConversion(stats.latest_transactions[i].date)
            stats.latest_transactions[i].id = i + 1
        }
        this.setState({
            totalWorth : stats.total_textbook_worth,
            totalOwed : stats.total_money_owed,
            totalNumOfTextbooks : stats.total_number,
            totalWithdrawn : stats.total_withdrawn,
            latest_transactions : stats.latest_transactions,
            destroyedTextbooks : stats.destroyed_textbooks,
            studentsOwingMoney : stats.students_owing_money
        })
        console.log(stats)
    }

    componentWillUnmount = () => {
        this.props.controller.setState({
            getStats : false
        })
    }

    conditionFormatter(cell, row, rowIndex, formatExtraData){
        return (
            <i>
                {formatExtraData[cell]}
            </i>
        );
    }

    costFormatter(cell, row, rowIndex, formatExtraData){
        return (
            <i> {cell == null ? "$0" : "$" + cell.toString()}</i>
        );
    }

    render() { 

        const columns = [
            {
              dataField : "id",
              text : "#",
              style : {backgroundColor : 'white'},
              headerStyle : (colum, colIndex) => {
                  return {width : '3%', backgroundColor : headerColor, color : headerTextColor}
              }
            },{
                dataField : "date",
                text : "Transaction Time",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {width : '14%', backgroundColor : headerColor, color : headerTextColor}
                }
            },{
                dataField : "transaction_type",
                text : "Transaction Type",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {width : '12%', backgroundColor : headerColor, color : headerTextColor}
                }
            },{
                dataField : "textbook_info.title",
                text : "Textbook Title",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {backgroundColor : headerColor, color : headerTextColor}
                }
            }, {
                dataField : "textbook_condition",
                text : "Condition",
                style : {backgroundColor : 'white'},
                formatter : this.conditionFormatter, formatExtraData: {
                    0 : "New",
                    1 : "Good",
                    2 : "Fair",
                    3 : "Bad",
                    4 : "Destroyed"
                },
                headerStyle : (colum, colIndex) => {
                    return {width : '7%', backgroundColor : headerColor, color : headerTextColor}
                }
            }, {
                dataField : "transaction_cost",
                text : "Cost",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {width : '11%', backgroundColor : headerColor, color : headerTextColor}
                },
                formatter : this.costFormatter
            },{
                dataField : "from",
                text : "From",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {width : '12%', backgroundColor : headerColor, color : headerTextColor}
                }
            },{
                dataField : "to",
                text : "To",
                style : {backgroundColor : 'white'},
                headerStyle : (colum, colIndex) => {
                    return {width : '12%',  backgroundColor : headerColor, color : headerTextColor}
                }
            }
        ]

        

        return ( 
            <div>
                {this.connectionLost()}
                <Container fluid>
                    {this.renderTitle("Statistics & Latest Transactions")}
                    
                    
                    <Row className = "mt-3">
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Total Number of Textbooks : {this.state.totalNumOfTextbooks} </h2>
                        </Col>
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Total Value of Textbooks : {'$' + this.state.totalWorth.toString()} </h2>
                        </Col>
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Destroyed Textbooks : {this.state.destroyedTextbooks} </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Total Withdrawn Textbooks : {this.state.totalWithdrawn} </h2>
                        </Col>
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Textbook Damage Fees : {'$' + this.state.totalOwed.toString()} </h2>
                        </Col>
                        <Col className = "text-center">
                            <h2 className = "h2Style2"> Students Owing Money : {this.state.studentsOwingMoney} </h2>
                        </Col>
                    </Row>
                    <Row className = "mt-3">
                        <Col className = "text-center">
                            <BootstrapTable 
                                keyField = "id" 
                                data = {this.state.latest_transactions} 
                                columns = {columns}
                                bordered = {false}
                            />
                        </Col>
                    </Row>
                    {this.renderBackButton()}
                </Container>
                
            </div>
        );
    }
}
 
export default Stats;