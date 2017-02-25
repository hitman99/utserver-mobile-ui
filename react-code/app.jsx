import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import { Header, Grid, Button, Container } from 'semantic-ui-react';

import ServerStatus from './modules/server-status';
import ServerControls from './modules/server-controls';
import TorrentList from './modules/torrent-list';
import NotFound from './modules/not-found';
import Torrent from './modules/torrent-list-item';

class App extends React.Component {
    constructor(props){
        super(props);

    };

    componentDidMount(){
    }

    shouldShowList(){
        return this.server_status.state.online_status.state;
    }

    render() {
        return(
            <Container className='v-align'>
                <Grid centered doubling>
                    <Grid.Row>
                        <Grid.Column verticalAlign="middle">
                            <Header inverted as='h1'>
                                Home Torrents
                            </Header>

                            <ServerStatus ref={(server_status) => {this.server_status = server_status;}} />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12}>
                            <Button fluid size='big' inverted basic onClick={ () =>  this.props.router.push("list") } >
                                Torrent list
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12}>
                            <Button fluid size='big' inverted basic onClick={() => this.props.router.push("controls")}>
                                Server controls
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    };
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/list" component={TorrentList} />
        <Route path="/list/:itemName" component={Torrent} />
        <Route path="/controls" component={ServerControls} />
        <Route path="/*" component={NotFound} />

    </Router>, document.getElementById('root'));