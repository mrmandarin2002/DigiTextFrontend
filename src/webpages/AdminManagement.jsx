//page where information regarding textbooks and students can be obtained
import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../webpagesCSS/infoCSS.scss'
import '../componentsCSS/headings.scss'

import TemplateWebpage from './TemplateWebpage'

import BootstrapTable from 'react-bootstrap-table-next';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';

class AdminManagement extends TemplateWebpage {
    state = {
        users : [],
        currentUsername : "",
        currentPassword : "",
        currentRole : "",
        selectedRow : {}
    }

    componentDidMount = () => {
        this.getUsers()
    }

    getUsers = () => {
        setTimeout(() => {this.props.controller.api.getUsers(this.setUsers)}, 50)
    }

    setUsers = (users) => {
        this.setState({users : users["users"]})
    }

    addUser = () => {
        this.props.controller.api.addUser(this.getUsers(), this.state.currentUsername, this.state.currentPassword, this.state.currentRole)
    }

    deleteUser = () => {
        this.props.controller.api.deleteUser(this.getUsers(), this.state.selectedRow.username)
    }

    render() { 

        const columns = [
            {dataField : "username", text : "Username", style : {cursor : "pointer"}},
            {dataField : "school_code", text : "School Code", style : {cursor : "pointer"}},
            {dataField : "role", text : "Role", style : {cursor : "pointer"}}
        ]

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                this.setState({
                    selectedRow : row
                })
            }
        }

        const renderDeleteButton = () => {
            if(this.state.selectedRow.username){
                return <Button onClick = {this.deleteUser}> Delete User </Button>
            } 
        }

        return ( 
            <div>
                {this.connectionLost()}
                <Container fluid>
                    {this.renderTitle("Admin Management")}
                    <Row className = "mt-3">
                        <Col>
                            <Container>
                                <Row>
                                    <Col>
                                        <Form>
                                            <Form.Row>
                                                <Col xs = "auto">
                                                    <Form.Group>
                                                        <Form.Label> Username </Form.Label>
                                                        <Form.Control onChange = {(e) => {this.setState({currentUsername : e.target.value})}}type = "text" placeholder = "Enter username"/>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs = "auto">
                                                    <Form.Group>
                                                        <Form.Label> Password </Form.Label>
                                                        <Form.Control onChange = {(e) => {this.setState({currentPassword : e.target.value})}}type = "text" placeholder = "Enter password"/>
                                                    </Form.Group>                                                
                                                </Col>
                                                <Col xs = "auto">
                                                    <Form.Group>
                                                        <Form.Label> Role </Form.Label>
                                                        <Form.Control onChange = {(e) => {this.setState({currentRole : e.target.value})}}type = "text" placeholder = "Enter role"/>
                                                    </Form.Group>                                                
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col>
                                                    <Button onClick = {this.addUser}> Add User </Button>
                                                </Col>
                                            </Form.Row>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row className = "mt-3">
                                    <Col>
                                        <h1 className = "h2Style2"> Selected User: </h1>
                                        <h2 className = "h2Style3"> Username : {this.state.selectedRow.username}</h2>
                                        <h2 className = "h2Style3"> School Code : {this.state.selectedRow.school_code}</h2>
                                        <h2 className = "h2Style3"> Role : {this.state.selectedRow.role}</h2>
                                        {renderDeleteButton()}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            <h1 className = "h2StyleBold text-center"> List of Users </h1>
                            <BootstrapTable
                                keyField = "username"
                                data = {this.state.users}
                                columns = {columns}
                                striped
                                hover
                                rowEvents = {rowEvents}
                            >
                            </BootstrapTable>
                        </Col>
                    </Row>
                    {this.renderBackButton()}
                </Container>
            </div>
         );
    }
}
 
export default AdminManagement;