import '../componentsCSS/eri.scss'

import TemplateWebpage from './TemplateWebpage'

import Countdown from '../components/countdown'

import { Container, Row, Col} from 'react-bootstrap';

class EriNewYear extends TemplateWebpage {
    
    render(){
        const currentDate = new Date();
        const year = (currentDate.getMonth() === 11 && currentDate.getDate() > 23) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        console.log("CurrentDate: ", currentDate)
        console.log("YEAR: ", year)
        return(
            <div>
                <Container>
                    <Row>
                        <Col className = 'text-center'>
                            <text className = "EriTitle"> How long I've had a GF: </text>
                        </Col>
                    </Row>
                    <Row>
                        <Countdown date={`${currentDate.getFullYear()}-08-28T22:00:00`}/>
                    </Row>
                </Container>
                {this.renderBackButton()}
            </div>
        )
    }
}
 
export default EriNewYear;