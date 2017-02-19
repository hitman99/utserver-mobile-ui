import React from 'react';
import ReactDOM from 'react-dom';

import { Header, Container, Segment, Label } from 'semantic-ui-react';

import ServerStatus from './modules/server-status';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            free_disk_space: 0,
        };
    };

    render() {
        return(
            <Container text="center" className="center-container">
                <Header as='h1' textAlign="center">
                    Home Torrents
                </Header>
                <ServerStatus />
            </Container>
        );
    };
}

ReactDOM.render(<App/>, document.getElementById('root'));