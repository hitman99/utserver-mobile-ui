import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import { Header, Grid, Button, Container } from 'semantic-ui-react';

import ServerStatus from './modules/server-status';
import TorrentList from './modules/torrent-list';
import NotFound from './modules/not-found';
import Torrent from './modules/torrent-list-item';
import ServerControls from './modules/server-controls.js';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            server: 'unknown',
            server_starting: false,
            server_stopping: false
        };
        this.serverControls = new ServerControls();
    };

    componentDidMount(){
        this.serverControls.getServerStatus()
            .then( (response) => {
                this.setState({
                    server: response.data.status
                });
            })
            .catch( (error) => {

            } );
    }

    stop_server(){
        this.setState({
            server_stopping: true
        });
        this.serverControls.stopServer()
            .then( (response) => {
                this.setState({
                    server: response.data.status,
                    server_stopping: false
                })
                this._serverStatus.refresh();
            })
            .catch((error) => {
                this.setState({
                    server_stopping: false
                })
            });
    }

    start_server(){
        this.setState({
            server_starting: true
        });
        this.serverControls.startServer()
            .then( (response) => {
                this.setState({
                    server: response.data.status,
                    server_starting: false
                });
                this._serverStatus.refresh();
            })
            .catch((error) => {
                this.setState({
                    server_starting: false
                })
            });
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

                            <ServerStatus ref={ (server_status) => {this._serverStatus = server_status; } } />

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
                            <Button fluid size='big' inverted basic onClick={ () =>  this.start_server() }
                                    disabled={ (this.state.server == 'alive' || this.state.server == 'unknown' ? 'disabled' : false) }
                                    loading={this.state.server_starting} >
                                Start Server
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12}>
                            <Button fluid size='big' inverted basic onClick={() => this.stop_server()  }
                                    disabled={ (this.state.server == 'dead' || this.state.server == 'unknown' ? 'disabled' : false) }
                                    loading={this.state.server_stopping} >
                                Stop Server
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
        <Route path="/list/:hash" component={Torrent} />
        <Route path="/*" component={NotFound} />

    </Router>, document.getElementById('root'));