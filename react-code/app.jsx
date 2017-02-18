import React from 'react';
import ReactDOM from 'react-dom';

import comm from './modules/comm';

class App extends React.Component {
    constructor(props){
        super(props);
        var srv_comm = new comm();
        this.state = {
            counter : 0
        };
        setInterval( () => { this.setState({counter: this.state.counter + 100 });}, 100 );
        srv_comm.getServerDiskSpace().then(function(data){
            console.log(data);
        });
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

ReactDOM.render(<App/>, document.getElementById('root'));