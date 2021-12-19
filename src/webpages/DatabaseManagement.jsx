import './Background.css' //unfortunately all webpages have to important this to change the background color
import '../webpagesCSS/infoCSS.scss'
import '../componentsCSS/headings.scss'

import TemplateWebpage from './TemplateWebpage'

import LinkButton from '../components/linkButton'
import MainTitle from '../components/mainTitle'
import BootstrapTable from 'react-bootstrap-table-next';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';

class DatabaseManagement extends TemplateWebpage {
    
    render(){
        return(
            <div>
                <Container fluid>
                {this.renderTitle("Database Management")}
                <Row>
                    
                </Row>
                {this.renderBackButton()}
                </Container>
            </div>
        )
    }
}
 
export default DatabaseManagement;