import React from 'react';
import {
    Header,
    List,
    Grid,
    Button,
    Container,
    Progress,
    Dimmer,
    Loader,
    Checkbox,
    Icon
} from 'semantic-ui-react';

import DeleteModal from './delete-torrent';

import axios from 'axios';

export default class TorrentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            torrent_list: [],
            loading: true,
            rendering: {
                show_only_active: false,
                delete_modal: false
            },
            active_torrent_hashes: [],
            refresh_handle: null,
            deleting_torrent: {
                title: '',
                hash:''
            }
        }
        this.get_torrent_list();
        this.interval_handle = null;
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
    }

    get_torrent_list() {
        axios.get('/rest/torrents/list').then((res) => {
            let torrent_list = res.data;
            this.setState({
                loading: false,
                torrent_list: torrent_list.sort(function (a, b) {
                    if (a.added < b.added) {
                        return 1;
                    }
                    if (a.added > b.added) {
                        return -1;
                    }
                    return 0;
                }),
                active_torrent_hashes: res.data.filter((item) => {
                    return item.status != 'Finished';
                })
            }, () => {
                if (torrent_list.findIndex(tor => tor.progress != 100) != -1) {
                    if (this.interval_handle == null) {
                        this.interval_handle = setInterval(() => {
                            this.get_torrent_list()
                        }, 3000);
                    }
                }
                else {
                    if (this.interval_handle) {
                        clearInterval(this.interval_handle);
                    }
                }
            });
        });
    }

    renderDeleteModal(title, hash) {
        let rendering = Object.assign({}, this.state.rendering);
        rendering.delete_modal = true;
        this.setState({rendering, deleting_torrent: { title, hash }});
    }

    closeDeleteModal() {
        let rendering = Object.assign({}, this.state.rendering);
        rendering.delete_modal = false;
        this.setState({rendering, deleting_torrent: { title: '', hash: '' }});
    }

    deleteTorrent() {
        let torrent_list = [...this.state.torrent_list]
        let idx = torrent_list.findIndex((t => t.hash == this.state.deleting_torrent.hash));
        if (idx > 0) {
            torrent_list.splice(idx, 1);
        }
        this.setState({ torrent_list });
        axios.delete(`/rest/torrents/${this.state.deleting_torrent.hash}`)
    }

    componentWillUnmount() {
        clearInterval(this.interval_handle);
    }

    render() {
        let delete_torrent_modal;
        if (this.state.rendering.delete_modal) {
            delete_torrent_modal = <DeleteModal title={this.state.deleting_torrent.title}
                                                onConfirm={() => {
                                                        this.deleteTorrent(this.state.deleting_torrent.hash);
                                                        this.closeDeleteModal();
                                                        this.get_torrent_list();
                                                    }
                                                }
                                                onCancel={this.closeDeleteModal}/>
        }
        let torrent_list = this.state.torrent_list
            .filter((item) => {
                return !this.state.rendering.show_only_active ||
                    this.state.rendering.show_only_active && item.status != 'Finished';
            }).map((item) => {
                    let header, description;
                    if (item.progress != 100) {
                        header = <List.Header>
                            <Progress percent={item.progress} inverted color='orange' label size="small"
                                      active={item.progress != 100}>
                                {item.download_speed} MB/s
                            </Progress>
                        </List.Header>
                        description = <List.Description> {item.name}</List.Description>;
                    }
                    else {
                        let item_name = item.name.length > 33 ? item.name.substring(0, 33) + '...' : item.name;
                        header = <List.Header> {item_name} </List.Header>
                    }
                    return (
                        <List.Item inverted >

                            <List.Content floated='right'>
                                <Button icon='trash' color='orange' size={'tiny'} onClick={()=>{
                                    this.renderDeleteModal(item.name, item.hash);
                                }}/>
                            </List.Content>
                            <List.Content onClick={() => this.props.router.push(
                                {
                                    pathname: "/list/" + item.hash,
                                    state: {
                                        name: item.name,
                                        hash: item.hash
                                    }
                                })
                            }>
                                {header}
                                {description}
                            </List.Content>
                        </List.Item>
                    );
                }
            );
        let empty_message;
        if (torrent_list.length == 0) {
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
        if (this.state.loading) {
            loader = <Dimmer inverted active><Loader size='big'>Loading</Loader></Dimmer>;
        }

        return (
            <div>

                <Container>

                    {loader}
                    {delete_torrent_modal}
                    <Grid verticalAlign='middle'>
                        <Grid.Row centered>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    Torrent list
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Checkbox toggle label="Only active" checked={this.state.rendering.show_only_active}
                                          onChange={() => this.setState({
                                              rendering: {
                                                  show_only_active: !this.state.rendering.show_only_active
                                              }
                                          })}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {empty_message}
                                <List divided inverted selection>
                                    {torrent_list}
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}