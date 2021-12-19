//Menu where users will proceed after 
import { Container, Row, Col, OverlayTrigger, Tooltip} from 'react-bootstrap';
import LinkButton from '../components/linkButton'
import './Background.css' //unfortunately all webpages have to important this to change the background color
import TemplateWebpage from './TemplateWebpage'

import {Link} from "react-router-dom"

import logout_icon from "../icons/logoutIcon.svg"
import "../componentsCSS/icons.scss"

// permission levels
// 0 - superadmin
// 1 - admin
// 2 - teacher
// 3 - student

class Menu extends TemplateWebpage {
  state = {}

  constructor(props){
    //still don't understand what super does but fuck it...
    super(props);
    //gives information for the names of the buttons / the links to where they will lead
    this.teacherButtons = [];
    this.teacherButtons.push({pageName : "Textbook Distribution", link : "/textbookdistribution", mode : 'D', permLevel : 2});
    this.teacherButtons.push({pageName : "Textbook Return", link : "/textbookreturn", mode : 'R', permLevel : 2});
    this.teacherButtons.push({pageName : "Textbook & Student Lookup", link : "/info", permLevel : 3});
    this.teacherButtons.push({pageName : "Course Textbook Assignment", link : "/teacherassignment", permLevel : 2});
    this.adminButtons = [];
    this.adminButtons.push({pageName : "Add & Delete Textbooks", link : "/addtextbooks", permLevel : 1});
    this.adminButtons.push({pageName : "Textbook Management", link : "/textbookmanagement", permLevel : 1});
    this.adminButtons.push({pageName : "Barcode & Invoice Printer", link : "/printer", permLevel : 1})
    this.adminButtons.push({pageName : "Statistics", link : "/stats", permLevel : 1});
    this.superAdminButtons = [];
    this.superAdminButtons.push({pageName : "Database Management", link : "/databasemanagement", permLevel : 0})
    this.superAdminButtons.push({pageName : "Admin Management", link : "/adminmanagement", permLevel : 0})
  }

  //based on permissions
  filterButtons = (buttons) => {
    var tempButtons = []
    for(var i = 0; i < buttons.length; i++){
      if(buttons[i].permLevel >= this.props.controller.state.permLevel){
        tempButtons.push(buttons[i])
      }
    }
    return tempButtons
  }

  render() {

    const renderLogoutHelp = (props) => {
      return (
        <Tooltip {...props}>
          Logout
        </Tooltip>
      )
    }

    return ( 
      <div>
        {this.connectionLost()}
        <Container>
          {this.renderTitle("DigiText Menu")}
          <Row className = "mt-5">

          </Row>
          <Row className = "mt-5" style = {{position : "relative", left : "5%"}}>
          {this.filterButtons(this.teacherButtons).map((buttonInfo, index) => (
              <Col xs = "auto" className = "text-center" key = {index}>
                <LinkButton styling = "glow-on-hover" text = {buttonInfo.pageName} link = {buttonInfo.link} mode = {buttonInfo.mode}/>
              </Col>
            ))}
          </Row >
          <Row className = "mt-4" style = {{position : "relative", left : "5%"}}>
          {this.filterButtons(this.adminButtons).map((buttonInfo, index) => (
              <Col xs = "auto" className = "text-center" key = {index + 4}>
                <LinkButton styling = "glow-on-hover" text = {buttonInfo.pageName} link = {buttonInfo.link} mode = {buttonInfo.mode}/>
              </Col>
            ))}
          </Row>
          <Row className = "mt-4" style = {{position : "relative", left : "5%"}}>
          {this.filterButtons(this.superAdminButtons).map((buttonInfo, index) => (
              <Col xs = "auto" className = "text-center" key = {index + 8}>
                <LinkButton styling = "glow-on-hover" text = {buttonInfo.pageName} link = {buttonInfo.link} mode = {buttonInfo.mode}/>
              </Col>
            ))}
          </Row>
          <Row style = {{position : "absolute", bottom : "20px", left : "20px"}}>
            <Col>
              <OverlayTrigger
                placement = "right"
                overlay = {renderLogoutHelp()}
              >
                <Link to = "/login">
                  <img src = {logout_icon} className = "icon" onClick = {this.props.controller.logout}/>  
                </Link>
              </OverlayTrigger>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Menu;
