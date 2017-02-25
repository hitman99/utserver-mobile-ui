import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import { Header, Grid, Button, Container } from 'semantic-ui-react';

import ServerStatus from './modules/server-status';
import ServerControls from './modules/server-controls';
import TorrentList from './modules/torrent-list';
import NotFound from './modules/not-found';

class App extends React.Component {
    constructor(props){
        super(props);
    };

    to_url(url){
        this.props.router.push(url);
    }

    render() {
        return(
            <Container className='v-align'>
                <Grid centered doubling>
                    <Grid.Row>
                        <Grid.Column>
                            <Header inverted as='h1' textAlign="center">
                                Home Torrents
                            </Header>

                            <ServerStatus />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12}>
                            <Button fluid size='big' inverted basic onClick={() => this.to_url("list")} >
                                Torrent list
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12}>
                            <Button fluid size='big' inverted basic onClick={() => this.to_url("controls")}>
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
            <Route path="/controls" component={ServerControls} />
        <Route path="/*" component={NotFound} />

    </Router>, document.getElementById('root'));