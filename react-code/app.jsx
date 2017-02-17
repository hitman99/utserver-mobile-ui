import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            counter : 0
        };
        setInterval( () => { this.setState({counter: this.state.counter + 100 });}, 100 );
    }

    render() {
        return(
            <div>
                <h1> Hello world! </h1>
                <h3>Seconds passed since page load: { (this.state.counter / 1000).toFixed(1) }s</h3>
            </div>
        );
    }
}

ReactDOM.render(<Hello/>, document.getElementById('root'));