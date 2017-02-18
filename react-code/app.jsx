import React from 'react';
import ReactDOM from 'react-dom';

import comms from './modules/comms';

class App extends React.Component {
    constructor(props){
        super(props);
        this.srv_comm = new comms();
        this.state = {
            free_disk_space: 0
        };
    };

    get_info(){
        this.srv_comm.getServerDiskSpace()
            .then(function(res){
                this.setState({
                    free_disk_space: (res.data.disk_info.free / 1024 / 1024 / 1024).toFixed(2)
                });
            }.bind(this));
    }
    componentDidMount(){
        this.get_info();
    }
    render() {
        return(
            <div>
                <h1> Hello world! </h1>
                Free disk space: { this.state.free_disk_space } GB
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));