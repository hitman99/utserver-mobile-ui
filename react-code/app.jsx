import React from 'react';
import ReactDOM from 'react-dom';

import { Header, Container, Segment, Label, Grid } from 'semantic-ui-react';

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
            <Grid container centered>

                    <Grid.Column>
                        <Header as='h1' textAlign="center">
                            Home Torrents
                        </Header>
                        <ServerStatus />
                    </Grid.Column>

            </Grid>
        );
    };
}

ReactDOM.render(<App/>, document.getElementById('root'));