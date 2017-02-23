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
            <Grid centered padded /*columns={ 10 }*/>
                <Grid.Row>
                    <Grid.Column /*width={2}*/>
                        <Header as='h1' textAlign="center">
                            Home Torrents
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column /*width={2}*/>
                        <ServerStatus />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };
}

ReactDOM.render(<App/>, document.getElementById('root'));