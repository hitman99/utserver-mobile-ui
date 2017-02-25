import React from 'react';
import { Header, Grid, Button, Container, List } from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import axios from 'axios';

export default class TorrentListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.location.state.name,
            hash: this.props.location.state.hash,
            file_list: []
        };
    };
    componentDidMount(){
        axios.get('/rest/torrents/files/' + this.state.hash)
            .then((res) => {
                this.setState({ file_list: res.data.files });
            })
    }

    render() {
        let files = this.state.file_list.map((file) =>

            <List.Item>
                <List.Icon name='file' />
                <List.Content>
                    <List.Header> { file[0] } </List.Header>
                    <List.Description> Status: done </List.Description>
                </List.Content>
            </List.Item>

        );

        return(
            <div>
                <Button basic inverted icon='left chevron' onClick={browserHistory.goBack} />
                <Container >
                    <Grid doubling>
                        <Grid.Row>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">{this.state.name}</Header>

                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <List inverted selectable>

                                    { files }

                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}

