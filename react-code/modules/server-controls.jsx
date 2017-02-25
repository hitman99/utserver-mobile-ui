import React from 'react';
import { Header, Grid, Button, Container } from 'semantic-ui-react';
import { browserHistory } from 'react-router';

export default class ServerControls extends React.Component {
    constructor(props){
        super(props);
    };

    render() {

        return(
            <div>
                <Button basic inverted icon='left chevron' onClick={browserHistory.goBack}  />
                <Container className='v-align'>
                    <Grid centered doubling>
                        <Grid.Row>
                            <Grid.Column>
                                <Header inverted as='h1' textAlign="center">
                                    Server controls
                                </Header>


                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    };
}