import React from 'react';
import {Header, Grid, Button, Container, List} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import axios from 'axios';

export default class TorrentListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.location.state.name,
            hash: this.props.location.state.hash,
            file_list: []
        };
    };

    componentDidMount() {
        axios.get('/rest/torrents/files/' + this.state.hash)
            .then((res) => {
                this.setState({file_list: res.data.files});
            })
    }

    render() {
        let files = this.state.file_list.map((file) =>

            <List.Item>
                <List.Icon name='file'/>
                <List.Content>
                    <List.Header> {  file[0].length > 35 ? file[0].substr(0, 35) + '...' : file[0] } </List.Header>
                    <List.Description> Status: done </List.Description>
                </List.Content>
            </List.Item>
        );

        return (
            <div>

                <Container>
                    <Header inverted dividing textAlign="center">{this.state.name}</Header>
                    <List inverted selectable>

                        {files}

                    </List>
                </Container>
            </div>
        );
    };
}

