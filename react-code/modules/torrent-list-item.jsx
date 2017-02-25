import React from 'react';
import { Header, Grid, Button, Container, List } from 'semantic-ui-react';
import { browserHistory } from 'react-router';

export default class TorrentListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.params.itemName,
            filename: 'some'
        };
    };

    render() {
        return(
            <div>
                <Button basic inverted icon='left chevron' onClick={browserHistory.goBack} />
                <Container >
                    <Grid centered doubling>
                        <Grid.Row>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    { this.state.id }
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <List inverted>
                                    <List.Item>
                                        <List.Icon name='file' />
                                        <List.Content>
                                            <List.Header>Some filename</List.Header>
                                            <List.Description>Description</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}

