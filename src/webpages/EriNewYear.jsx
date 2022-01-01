import '../componentsCSS/eri.scss'
import eri from '../icons/background.jpg'
import cuteEri from '../icons/cringe_overload.jpg'

import TemplateWebpage from './TemplateWebpage'

import Countdown from '../components/countdown'

import { Container, Row, Col} from 'react-bootstrap';

class EriNewYear extends TemplateWebpage {
    
    state = {
        cringeOverload : false,
        opacity : 0.0
    }

    increaseCringe = (e) => {
        if(!this.state.cringeOverload){
            if(this.state.opacity < 0.35){
                this.setState({
                    opacity : this.state.opacity + 0.035
                })
            } else{
                this.setState({
                    cringeOverload : true
                })
            }
        } else{
            this.setState({
                cringeOverload : false,
                opacity : 0
            })
        }
    }


    render(){
        const currentDate = new Date();
        const year = (currentDate.getMonth() === 11 && currentDate.getDate() > 23) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        console.log("CurrentDate: ", currentDate)
        console.log("YEAR: ", year)

        const tooMuchCringe = () => {
            if(this.state.cringeOverload){
                return (
                    <div>
                        <text className = "EriCute"> Cringe Overload! Press Again to Reset... </text>
                    </div>
                )
            } 
        }

        return(
            <div>
                <img style = {{position : 'absolute', top : "5%", left : "0%", opacity : this.state.opacity}} className = "eriImg" src = {this.state.cringeOverload ? cuteEri : eri} alt = "Eri" height = {this.props.controller.state.windowHeight} width = {this.props.controller.state.windowWidth}/>
                <Container>
                    <Row>
                        <Col className = 'text-center'>
                            <text className = "EriTitle"> How long I've had a GF: </text>
                        </Col>
                    </Row>
                    <Row>
                        <Countdown date={`${currentDate.getFullYear()}-08-28T22:00:00`}/>
                    </Row>
                    <Row>
                        <Col className = 'text-center'>
                            {tooMuchCringe()}
                        </Col>
                    </Row>
                    <Row className = "mt-3">
                        <Col className = 'text-center'>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css" />
                            <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200&display=swap" rel="stylesheet" />
                            <button type="button" class="simple" onClick = {(e) => {this.increaseCringe(e)}}>{this.state.cringeOverload ? "Reset Cringe" : "Cringe"}</button>
                            
                        </Col>
                    </Row>
                </Container>
                {this.renderBackButton()}
            </div>
        )
    }
}
 
export default EriNewYear;