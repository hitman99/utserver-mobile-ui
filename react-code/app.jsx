import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import axios from 'axios';

import { Header, Grid, Button, Container, Icon, Modal, Input, Message } from 'semantic-ui-react';

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
            server_stopping: false,
            modal: false,
            torrent_url: null,
            error: false
        };
        this.serverControls = new ServerControls();
        this.__close = this.close_modal.bind(this);
    };

    __update_status(status){
        this.setState({ server: status });
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

    show_modal(){
        this.setState({ modal: true });
    }

    close_modal(){
        this.setState({ modal: false });
    }

    add_torrent(){
        const { torrent_url } = this.state;
        if(torrent_url.length > 0){
            axios.post('/rest/torrents/add-torrent', { torrent_url })
                .then((response)=>{
                    if(response.data.status == 'success'){
                        this.setState({ error: false });
                        this.close_modal();
                    }
                    else{
                        this.setState({ error: true });
                    }
                });
        }
    }

    render() {
        let error_message;
        if(this.state.error){
            error_message = <Message negative>
                                <Message.Header>Failed to add torrent</Message.Header>
                                <p>Check the URL you're trying to add</p>
                            </Message>
        }
        return(
            <Container className='v-align'>
                <Grid centered doubling>
                    <Grid.Row>
                        <Grid.Column verticalAlign="middle">
                            <Header inverted as='h1'>
                                Home Torrents
                            </Header>

                            <ServerStatus ref={ (server_status) => {this._serverStatus = server_status; } }
                                          onUpdate={this.__update_status.bind(this)} />

                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column mobile={12} computer={3} >
                            <Button fluid size='big' basic inverted onClick={this.show_modal.bind(this)}
                                    disabled={this.state.server == 'dead'}>
                                <Icon name='add square' /> Add torrent
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12} computer={3}>
                            <Button fluid size='big' inverted basic onClick={ () =>  this.props.router.push("list") } >
                                Torrent list
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12} computer={3}>
                            <Button fluid size='big' inverted basic onClick={ () =>  this.start_server() }
                                    disabled={ this.state.server == 'alive' || this.state.server == 'unknown' }
                                    loading={this.state.server_starting} >
                                Start Server
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={12} computer={3}>
                            <Button fluid size='big' inverted basic onClick={() => this.stop_server()  }
                                    disabled={ this.state.server == 'dead' || this.state.server == 'unknown' }
                                    loading={this.state.server_stopping} >
                                Stop Server
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal dimmer="blurring" open={this.state.modal} onClose={this.__close}>
                    <Modal.Header>Add new torrent</Modal.Header>
                    <Modal.Content>
                        { error_message }
                        <Input fluid focus placeholder='Paste URL...'
                               onChange={(ev, props)=>{ this.setState({ torrent_url: props.value }); }}
                               value={this.state.torrent_url} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.add_torrent.bind(this)}>
                            Add
                        </Button>
                        <Button color='black' onClick={this.__close}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
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