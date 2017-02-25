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
            }
        }
        this.get_torrent_list();
    }

    get_torrent_list() {
        axios.get('/rest/torrents/list').then((res) => {

            this.setState({
                loading: false,
                torrent_list: res.data.sort(function(a, b){
                    if (a.added < b.added) {
                        return 1;
                    }
                    if (a.added > b.added) {
                        return -1;
                    }
                    return 0;
                })
            });
        });

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
                <Button basic inverted icon='left chevron' onClick={browserHistory.goBack}  />
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
                            <Grid.Column  >
                                <Button basic inverted >
                                    <Icon name='add square' /> Add torrent
                                </Button>
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