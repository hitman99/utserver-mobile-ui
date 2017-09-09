import React from 'react';
import { Header, Grid, Button, Container } from 'semantic-ui-react';

export default class NotFound extends React.Component {
    constructor(props){
        super(props);
    };

    render() {

        return(
            <Container className='v-align'>
                <Grid centered doubling>
                    <Grid.Row>
                        <Grid.Column>
                            <Header inverted as='h1' textAlign="center">
                                This page does not exist
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    };
}