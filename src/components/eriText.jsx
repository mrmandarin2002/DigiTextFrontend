import React, { Component } from 'react';
import '../componentsCSS/eri.scss'

class EriText extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.stop();
  }

  stop() {
    clearInterval(this.interval);
  }

  render() {


    return (
        <div>
            
        </div>

    
    );
  }
}

export default EriText;