/**
 * Created by tomas on 2017-02-19.
 */

import React from 'react';
import axios from 'axios';
import ServerControls from './server-controls';

import { Segment, Dimmer, Loader, List, Icon, Header } from 'semantic-ui-react';

export default class ServerStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            online_status: {
                text: 'Offline',
                color: 'red',
                state: false
            },
            disk_space: {
                free: null,
                total: null,
                color: 'black'
            },
            loading: true
        };
        this.serverControls = new ServerControls();
    };

    get_status(){
        return this.state.online_status;
    }

    refresh(){
        this.fetch_data();
    }

    fetch_data(){
        axios.get('/rest/serverinfo/disk-space')
            .then((res) => {
                let free = (res.data.disk_info.free / 1024 / 1024 / 1024).toFixed(2);
                let total = (res.data.disk_info.total / 1024 / 1024 / 1024).toFixed(2);
                let color = 'green';
                if(free < 100){
                    color = 'yellow';
                }
                if(free < 50){
                    color = 'red';
                }
                this.setState({
                    disk_space: {
                        free: free,
                        total: total,
                        color: color
                    },
                    loading: false
                });
            });
        this.serverControls.getServerStatus()
            .then((res) => {
                this.setState({
                    online_status: {
                        text: (res.data.status == 'alive' ? 'Online' : 'Offline'),
                        color: (res.data.status == 'alive' ? 'green' : 'red'),
                        state: (res.data.status == 'alive')
                    }
                })
            });
    }

    componentDidMount(){
        this.fetch_data();
    };

    render(){

        return (
          <Segment loading={this.state.loading} >
              <List horizontal>
                  <List.Item className="srv-info-item">
                      <Icon name="disk outline" color={ this.state.disk_space.color } size="big" />
                      <List.Content textAlign="left">
                          <List.Header>{ this.state.disk_space.free } GB</List.Header>
                          <List.Description>
                              Free disk space
                          </List.Description>
                      </List.Content>
                  </List.Item>
                  <List.Item className="srv-info-item">
                      <Icon name="idea" color={ this.state.online_status.color } size="big" />
                      <List.Content>
                          <List.Header>{ this.state.online_status.text }</List.Header>
                          <List.Description>
                              Server status
                          </List.Description>
                      </List.Content>
                  </List.Item>
              </List>
          </Segment>
        );
    }
}
