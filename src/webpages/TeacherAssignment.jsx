import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../componentsCSS/headings.scss'
import '../componentsCSS/buttons.scss'
import TemplateWebpage from './TemplateWebpage'

import EditableTextbookList from '../components/editableTextbookList'
import CourseList from '../components/courseList'
import { Container, Row, Col, Form} from 'react-bootstrap';
import {Error} from '../components/popupMessages'
import {courseSearch} from '../conversions'

class TeacherAssignment extends TemplateWebpage {
    state = {
        teacherList : [],
        allCourses : [], 
        currentCourses : [],
        currentTeacher : "",
        currentTextbook : "",
        displayIdentical : false,
        courseList : {
            currentRow : null,
            prevRowIndex : null,
            rowSelected : false   
        },
        currentSelectedTextbook : {},
        alerts : {
            rowSelect : false,
            duplicateTextbook : false
        }
    }
    

    constructor(props){
        super(props)
        this.getTeachers()
    } 

    getTeachers = () => {
        this.props.controller.api.getTeachers(this.setTeachers)
    }

    setTeachers = (content) => {
        content = content["teachers"]
        var allCourses = []

        //this creates a list of a school's courses, currently very cancer but it'll do
        for(var i = 0; i < content.length; i++){
            var courses = content[i].courses
            for(var x = 0; x < courses.length; x++){
                var course = courses[x]
                var courseTextbooks = []
                for(var y = 0; y < course.textbooks.length; y++){
                    courseTextbooks.push(this.props.controller.state.abstractTextbooksDict[parseInt(course.textbooks[y].id)])
                }
                course.textbooks = courseTextbooks
                allCourses.push(course)
            }
        }

        console.log(allCourses)
        this.setState({
            teacherList : content,
            allCourses : allCourses,
            currentCourses : courseSearch(this.state.currentTeacher, allCourses, this.state.displayIdentical)
        })
        this.props.controller.api.getAbstractTextbooks()
    }

    onTeacherChange = (e) => {
        this.setState({
            currentTeacher : e.target.value,
            currentCourses : courseSearch(e.target.value, this.state.allCourses, this.state.displayIdentical)
        })
    }

    onTextbookChange = (e) => {
        this.setState({
            currentTextbook : e.target.value,
        })
        this.props.controller.setState({
            currentKeyWord : e.target.value
        })
        this.props.controller.setCurrentAbstractTextbooks(e.target.value)
        this.props.controller.setState({
            currentKeyWord : e.target.value
        })
    }

    setIdenticalCourses = (e) => {
        e.currentTarget.blur()
        this.setState({
            displayIdentical : !this.state.displayIdentical,
            currentCourses : courseSearch(this.state.currentTeacher, this.state.allCourses, !this.state.displayIdentical)
        })

    }

    onCourseRowClick = (e, row, rowIndex) => {
        console.log(row, rowIndex, e)
        if(rowIndex === this.state.courseList.prevRowIndex && this.state.courseList.rowSelected){
            this.setState({
                courseList : {rowSelected : false}
            })
        } else{
            this.setState({
                courseList : {
                    currentRow : row,
                    prevRowIndex : rowIndex,
                    rowSelected : true
                }
            })
        }
    }

    textbookRowClicked = (row) => {
        this.setState({
            currentSelectedTextbook : row
        })
    }

    addTextbook = () => {
        var courseInfo = this.state.courseList.currentRow
        if(!courseInfo.textbooks.includes(this.state.currentSelectedTextbook)){
            if(!this.state.displayIdentical){
                this.props.controller.api.setCourseTextbooks(this.getTeachers, this.state.currentSelectedTextbook.id, courseInfo.teacher, courseInfo.name, null)
            } else{
                this.props.controller.api.setCourseTextbooks(this.getTeachers, this.state.currentSelectedTextbook.id, null, null, courseInfo.course_number)
            }
            this.state.courseList.currentRow.textbooks.push(this.state.currentSelectedTextbook)
            this.props.controller.addNotification("Assigning Textbook to Course", this.state.currentSelectedTextbook.title + " is now assigned to " + courseInfo.name)
        } else{
            this.setState({
                alerts : {duplicateTextbook : true}
            })
        }

    }

    deleteTextbook = (row) => {
        console.log("REMOVING TEXTBOOK")
        console.log("Row: ", row)
        this.state.courseList.currentRow.textbooks.splice(this.state.courseList.currentRow.textbooks.indexOf(row), 1)
        var courseInfo = this.state.courseList.currentRow
        if(!this.state.displayIdentical){
            this.props.controller.api.setCourseTextbooks(this.getTeachers, row.id, courseInfo.teacher, courseInfo.name, null, false)
        } else{
            this.props.controller.api.setCourseTextbooks(this.getTeachers, row.id, null, null, courseInfo.course_number, false)
        }
        this.props.controller.addNotification("Removing Textbook from Course", row.title + " is now removed from " + courseInfo.name)
    }


    render() { 

        const {currentAbstractTextbooks} = this.props.controller.state

        const renderAlerts = () => {
            if(this.state.alerts.duplicateTextbook){
                return <Error
                    heading = "Textbook Already in Course!"
                    message = {"This textbook is already assigned to this course...."}
                    dismissFunc = {() => this.setState({alerts : {duplicateTextbook : false}})}
                />
            }
        }

        return ( 
            
            <div>
                {renderAlerts()}
                {this.connectionLost()}
                <Container fluid> 
                    {this.renderTitle("Course Textbook Assignment")}
                    <Row>
                        <Col>
                            <Container>
                                <Row className = "mt-3">
                                    <Col xs = "auto">
                                        <Form>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label> <h2 className = "h2Style3"> Textbook Search </h2> </Form.Label>
                                                        <Form.Control onChange = {this.onTextbookChange} type = "text" placeholder = "Enter Textbook Title"/>
                                                    </Form.Group>
                                                </Col>
                                                <Col className = "ml-5">
                                                    <Form.Group>
                                                        <Form.Label> <h2 className = "h2Style3"> Teacher Search </h2> </Form.Label>
                                                        <Form.Control onChange = {e => this.onTeacherChange(e)} type = "text" placeholder = "Enter Teacher Name"/>
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <EditableTextbookList
                                            addFunc = {this.addTextbook}
                                            addButtonText = {this.state.courseList.currentRow ? "Add " + this.state.currentSelectedTextbook.title + " to " + this.state.courseList.currentRow.name : false}
                                            addEnabled = {this.state.courseList.rowSelected} 
                                            sizePerPage = {5} 
                                            handleRowClick = {this.textbookRowClicked} 
                                            textbooks = {currentAbstractTextbooks} 
                                            listTitle = {"Similar Textbooks"} 
                                            type = {"ABSTRACT+"}/>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            <Container>
                                <Row className = "mt-3">
                                    <CourseList 
                                        onRowClick = {this.onCourseRowClick} 
                                        identical = {this.state.displayIdentical} 
                                        sizePerPage = {5} 
                                        courses = {this.state.currentCourses} 
                                        title = "Courses Based on Filter"
                                        deleteTextbookFunc = {this.deleteTextbook}
                                    />
                                </Row>
                                <Row>
                                    <button className = "custom-btn second" onClick = {this.setIdenticalCourses}> {this.state.displayIdentical ? "Do Not Display Identical Courses" : "Display Identical Courses"} </button>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    {this.renderBackButton()}
                </Container>
            </div>
        );
    }
}
 
export default TeacherAssignment;