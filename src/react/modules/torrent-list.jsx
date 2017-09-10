import React from 'react';
import { Header, List, Grid, Button, Container, Segment, Progress, Dimmer, Loader, Checkbox, Icon } from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import axios from 'axios';

export default class TorrentList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            torrent_list: [],
            loading: true,
            rendering: {
                show_only_active: false
            },
            active_torrent_hashes: [],
            refresh_handle: null
        }
        this.get_torrent_list();
        this.interval_handle = null;
    }

    get_torrent_list() {
        axios.get('/rest/torrents/list').then((res) => {
            let torrent_list = res.data;
            this.setState({
                loading: false,
                torrent_list: torrent_list.sort(function(a, b){
                    if (a.added < b.added) {
                        return 1;
                    }
                    if (a.added > b.added) {
                        return -1;
                    }
                    return 0;
                }),
                active_torrent_hashes: res.data.filter((item) => { return item.status != 'Finished'; })
            }, ()=>{
                if(torrent_list.findIndex( tor => tor.progress != 100) != -1){
                    if(this.interval_handle == null) {
                        this.interval_handle = setInterval(() => { this.get_torrent_list() }, 3000);
                    }
                }
                else{
                    if(this.interval_handle){
                        clearInterval(this.interval_handle);
                    }
                }
            });
        });
    }

    refresh_active_torrents(){

    }

    componentWillUnmount(){
        clearInterval(this.interval_handle);
    }

    render() {

        let torrent_list = this.state.torrent_list
            .filter((item) => {
                return !this.state.rendering.show_only_active ||
                    this.state.rendering.show_only_active && item.status != 'Finished';
            }).map((item) => {
                let header, description;
                if(item.progress != 100){
                    header = <List.Header>
                                <Progress percent={ item.progress } inverted color='orange' label size="small"
                                          active={item.progress != 100} >
                                    { item.download_speed } MB/s
                                </Progress>
                            </List.Header>
                    description = <List.Description> { item.name }</List.Description>;
                }
                else{
                    header = <List.Header> { item.name } </List.Header>
                }
                return (
                    <List.Item inverted onClick={ () => this.props.router.push(
                        {
                            pathname: "/list/" + item.hash,
                            state: {
                                name: item.name,
                                hash: item.hash
                            }
                        })
                    }>
                        <List.Content>
                            { header }
                            { description }
                        </List.Content>
                    </List.Item>
                );
            }
        );
        let empty_message;
        if(torrent_list.length == 0){
            empty_message = <Grid centered>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h2' inverted disabled textAlign="center">
                            Such empty
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        }

        let loader;
        if(this.state.loading){
            loader = <Dimmer inverted active><Loader size='big'>Loading</Loader></Dimmer>;
        }

        return(
            <div>

                <Container>

                    { loader }

                    <Grid verticalAlign='middle'>
                        <Grid.Row centered>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    Torrent list
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column >
                                <Checkbox toggle label="Only active" checked={this.state.rendering.show_only_active}
                                onChange={ () => this.setState({
                                    rendering: {
                                        show_only_active: !this.state.rendering.show_only_active
                                    }
                                }) } />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                { empty_message }
                                <List divided inverted selection>
                                    { torrent_list }
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}