import React from 'react';
import { Header, List, Grid, Button, Container, Progress } from 'semantic-ui-react';
import { browserHistory } from 'react-router';

export default class TorrentList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            torrent_list: (() => {
                let l = [];
                for(let i = 0; i < 100; i++){
                    l.push(i);
                }
                return l;
            })()
        }
    }

    render() {

        let dummy_list = this.state.torrent_list.map((item) =>

                <List.Item inverted onClick={ () => this.props.router.push("/list/some-shit") }>
                    <List.Content>
                        <List.Header>
                            <Progress percent={83} inverted color='orange' label size="small" active >
                                13 MB/s
                            </Progress>
                        </List.Header>
                        <List.Description>Torrent number { item }</List.Description>
                    </List.Content>
                </List.Item>

        );

        return(
            <div>
                <Button basic inverted icon='left chevron' onClick={browserHistory.goBack}  />
                <Container>
                    <Grid doubling>
                        <Grid.Row centered>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    Torrent list
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column >
                                <List divided inverted selection>
                                    { dummy_list }
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}