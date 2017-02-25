import React from 'react';
import { Header, Grid, Button, Container } from 'semantic-ui-react';

export default class TorrentList extends React.Component {
    constructor(props){
        super(props);
    };

    render() {

        return(
            <div>
                <Container  className='v-align'>
                    <Grid centered doubling>
                        <Grid.Row>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    Torrent list
                                </Header>


                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}