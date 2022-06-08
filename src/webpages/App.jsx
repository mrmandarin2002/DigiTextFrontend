import '../componentsCSS/headings.scss'

import { Col, Container, Row } from 'react-bootstrap';
import {Redirect, Route, BrowserRouter as Router} from 'react-router-dom';
import {abstractTextbookSearch, permLevel} from '../conversions'

import AdminManagement from './AdminManagement'
import { Component } from 'react'
import DatabaseManagement from './DatabaseManagement'
import EriNewYear from './EriNewYear'
import {Helmet} from 'react-helmet'
//Controls which page is currently active
import Info from './Info'
import Login from './Login'
import Menu from './Menu'
//components
import Notification from '../components/notification'
import Printer from './Printer'
import Stats from './Stats'
import TeacherAssignment from './TeacherAssignment'
import TextbookDistribution from './TextbookDistribution'
import TextbookManagement from './TextbookManagement'
import TextbookScanner from './TextbookScanner'
import interactions from '../interactions'
import scanner from '../barcodeInteraction'

const debugMode = false

const IP_ADDRESS = debugMode ? "192.168.100.109" : "api.digitext.ca"
const PORT = debugMode ? 5000 : -1 
const USERNAME = debugMode ? "" : ""
const PASSWORD = debugMode ? "" : ""

class App extends Component {
  //stores which page is currently active so that the scanner class can interact with each class
  state = {
    currentPage: this,
    connectionLost : false,
    textbookInfo : {title : "", cost : 0, condition : 0, owner : {name : "", id :0}, number : 0},
    studentInfo : {name : "", grade : "", withdrawnTextbooks : [], neededTextbooks : [], courses : [
      {}
    ]},
    currentScanned : null,
    textbookList: {
      title : "",
      textbooks : [],
      type : ""
    },
    loginInfo : {loginFailed : false, loggedIn : false, username : USERNAME, password : PASSWORD, token : ""},
    userSchoolCode : "",
    userType : "",
    permLevel : 4,
    currentBarcode : "",
    abstractTextbooks : [],
    abstractTextbooksDict : [], //creates a dictionary with all the abstract textbooks
    currentAbstractTextbooks : [],
    currentKeyWord : "",
    studentList : [],
    notifications : [],
    windowHeight : window.innerHeight,
    windowWidth : window.innerWidth,
    debugMode : debugMode
  }

  constructor(){
    super();
    //array of the possible webpages
    this.webpages = [
      {link : "/info", component : Info}, 
      {link : "/adminmanagement", component : AdminManagement},
      {link : "/menu", component : Menu}, 
      {link : "/stats", component : Stats},
      {link : "/textbookreturn", component : TextbookDistribution, mode : 'R'},
      {link : "/textbookdistribution", component : TextbookDistribution, mode : 'D'},
      {link : "/addtextbooks", component : TextbookScanner},  
      {link : "/teacherassignment", component : TeacherAssignment},
      {link : "/textbookmanagement", component : TextbookManagement},
      {link : "/login", component : Login},
      {link : "/printer", component : Printer},
      {link : "/databasemanagement", component : DatabaseManagement},
      {link : "/happynewyeareri", component : EriNewYear},
      {link : "/", component : Login} 
    ]
    this.api = new interactions(IP_ADDRESS, PORT, this)
    if(this.state.loginInfo.username && this.state.loginInfo.password){
      this.api.login(this.state.loginInfo.username, this.state.loginInfo.password)
    }
    this.scanner = new scanner(this.api, this)
    this.notificationNumber = 0
  }

  //we want to clear the state whenever a new webpage / frame is reached
  clearState = () =>{
    this.setState({
      currentPage : null,
      textbookInfo : {title : "", cost : 0, condition : 0, owner : {name : "", id : 0}, number : 0},
      studentInfo : {number : "", name : "", grade : "", withdrawnTextbooks : [], neededTextbooks : [], withdrawnIds : [], neededIds : [], courses : []},
      currentScanned : null,
      currentBarcode : null,
      textbookList : {title : "", textbooks : [], type : ""},
      currentAbstractTextbooks : this.state.abstractTextbooks,
      currentKeyWord : ""
    })
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    if(this.state.currentPage.windowSizeChange){
      this.state.currentPage.windowSizeChange() //calls the size change function based on current webpage
    }
  }

  setAbstractTextbooks = (abstractTextbooks) => {
    abstractTextbooks = abstractTextbooks["abstract_textbooks"]
    console.log(abstractTextbooks)
    var abstractDict = {}
    for(var i = 0; i < abstractTextbooks.length; i++){
      abstractDict[abstractTextbooks[i].id] = abstractTextbooks[i]
    }
    this.setState({
      abstractTextbooks : abstractTextbooks,
      abstractTextbooksDict : abstractDict,
      currentAbstractTextbooks : abstractTextbookSearch(this.state.currentKeyWord, abstractTextbooks)
    })
  }

  setCurrentAbstractTextbooks = (word) => {
    this.setState({
      currentAbstractTextbooks : abstractTextbookSearch(word, this.state.abstractTextbooks)
    })
    console.log(this.state.currentAbstractTextbooks)
  }

  //arrow function so that we don't have to bind every method in this class
  //pass in the studentInfo from interactions to modify the state
  setStudentInfo = (studentInfo) => {
    var withdrawnIds = []
    var neededIds = []
    var owed_money = 0
    for(var i = 0; i < studentInfo.withdrawnTextbooks.length; i++){
      owed_money += studentInfo.withdrawnTextbooks[i].cost
      withdrawnIds.push(studentInfo.withdrawnTextbooks[i].abstract_textbook_id)
    }
    for (var x = 0; x < studentInfo.neededTextbooks.length; x++){
      neededIds.push(studentInfo.neededTextbooks[x].abstract_textbook_id)
    }
    for(var i = 0; i < studentInfo.transactions.length; i++){
      owed_money += studentInfo.transactions[i].cost
    }
    studentInfo.withdrawnIds = withdrawnIds
    studentInfo.neededIds = neededIds
    studentInfo.moneyOwed = owed_money
    console.log("SETTING STUDENT INFO")
    console.log(studentInfo)
    this.setState({
      studentInfo : studentInfo,
      currentScanned : "STUDENT"
    })
    this.state.currentPage.studentScanned()
  }

  setTextbookInfo = (textbookInfo) => {
    console.log("SETTING TEXTBOOK INFO")
    console.log(textbookInfo)
    textbookInfo.transactions.reverse()
    this.setState({
      textbookInfo : textbookInfo,
      currentScanned : "TEXTBOOK"
    })
    this.state.currentPage.textbookScanned()
  }

  scannedUnknownBarcode = (barcode) => {
    this.setState({
      currentBarcode : barcode,
      currentScanned : "UNKNOWN"
    })
    this.state.currentPage.unknownScanned(barcode)
  }

  setCurrentPage = (currentObject) => {
    console.log("SETTING CURRENT PAGE")
    this.setState({
      currentPage: currentObject
    })
  }

  //type -> normal or abstract
  setTextbookList = (textbookList, listTitle, type) =>{
    console.log("SETTING TEXTBOOK LIST")
    this.setState({
      textbookList : {
        title : listTitle,
        textbooks : textbookList,
        type : type
      }
    })
  }

  //gets the the number of rows a table should have based on window height
  getNumberOfRows = (defaultNum) => {
    var negativeMultiplier = this.state.windowHeight < 754 ? 3 : 1
    var extraRows = Math.round((1 - (this.state.windowHeight / 754) ** 2.6) * 5 * negativeMultiplier * -1)
    return Math.min(Math.max(defaultNum + extraRows, Math.floor(defaultNum / 2)), defaultNum * 2)
  }

  //basically login
  setToken = (token) => {
    console.log("SETTING TOKEN: ", token.access_token)
    if(token.access_token === "FAILED"){
      if(this.state.currentPage.state.username !== '' || this.state.currentPage.state.password !== ''){
        this.setState({
          loginInfo : {
            loginFailed : true
          }
        })
      } 
      console.log("LOGIN FAILED!")
    } else {
      console.log("LOGGED IN!")
      console.log(this.state.loginInfo)
      this.setState({
        loginInfo : {
          username : this.state.loginInfo.username,
          loggedIn : true,
          password : "",
          token : token.access_token
        },
        userSchoolCode : token.school_code,
        userType : token.role,
        permLevel : permLevel(token.role)
      })
      this.api.getAbstractTextbooks()
      this.api.getStudentList()
    }
  }

  logout = () => {
    this.setState({
      loginInfo : {
        loggedIn : false,
        token : ""
      },
      userSchoolCode : "",
      userType : "",
      permLevel : 4
    })
    this.clearState()
  }

  setStudents = (students) => {
    console.log(students)
    students = students["students"]
    students.splice(0, 1)
    this.setState({
      studentList : students
    })
  }
  
  addNotification = (title, message, delay = 2000) => {
    this.setState({
      notifications : [{key : this.notificationNumber, title : title, message : message, delay : delay}, ...this.state.notifications]
    })
    this.notificationNumber++
  }

  closeNotification = (index) => {
    var newNotifications = [...this.state.notifications]
    for(var i = 0; i < newNotifications.length; i++){
      if(newNotifications[i].key == index){
        newNotifications.splice(i, 1)
        break
      }
    }
    setTimeout(() => {this.setState({notifications : newNotifications})}, 1000) //allows the animation to play
  }

  render() {
    
    //redirects 
    const redirections = (webpage) => {
      if(this.state.loginInfo.loggedIn && (webpage.link === '/' || webpage.link === '/login')){
        return <Redirect to = "/menu"/>
      }
    }

    const renderToasts = () => {
      return (
        <div style = {{
          position : 'absolute',
          top : "10px",
          right : "10px"
        }}>
          {this.state.notifications.map((notification, index) => (
            <Notification title = {notification.title} message = {notification.message} key = {notification.key} delay = {notification.delay} onClose = {this.closeNotification}/>
          ))}
        </div>
      )
    }

    const renderWindowDimensions = () => {
      if(debugMode){
        return(
          <div>
            <Row style = {{position: "absolute", bottom: "31px", right : "15px"}}>
              <Col>
                <h3 className = "h3Style">{"Window Height: " + this.state.windowHeight}</h3>
              </Col>
            </Row>
            <Row style = {{position: "absolute", bottom: "41px", right : "15px"}}>
              <Col>
                <h3 className = "h3Style">{"Window Width: " + this.state.windowWidth}</h3>
              </Col>
            </Row>
          </div>
        )
      }
    }


    return ( 
      <div>
        <Helmet>
          <title> DigiText </title>
        </Helmet>
        <Router>
            {
              this.webpages.map((webpage, index) => (
                <Route path = {webpage.link} exact
                render = {(props) => (
                  <webpage.component {...props} controller = {this} mode = {webpage.mode}/>
                )} key = {index}> 
                {redirections(webpage)}
                </Route>
              ))
            }
            <Route path = "/">
              <Container className = "p-0">
                <Row style = {{position: "absolute", bottom: "21px", right : "15px"}}>
                  <Col>
                    <h3 className = "h3Style">{this.state.userSchoolCode ? "School: " + this.state.userSchoolCode : ""}</h3>
                  </Col>
                </Row>
                <Row style = {{position: "absolute", bottom: "11px", right : "15px"}}>
                  <Col>
                    <h3 className = "h3Style">{this.state.userType ? "User Type: " + this.state.userType : ""}</h3>
                  </Col>
                </Row>
                <Row style = {{position: "absolute", bottom: "1px", right : "15px"}}>
                  <Col>
                    <h3 className = "h3Style">{"Developed by Derek Ma"}</h3>
                  </Col>
                </Row>
                {renderWindowDimensions()}
                {renderToasts()}
              </Container>
            </Route>
        </Router>
      </div>
    );
  }
}

export default App;
