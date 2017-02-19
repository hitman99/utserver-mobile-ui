/**
 * Created by tomas on 2017-02-19.
 */

import React from 'react';
import Comms from './comms';

import { Segment, Dimmer, Loader, List, Icon } from 'semantic-ui-react';

export default class ServerStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            online_status: {
                text: 'Offline',
                color: 'red'
            },
            disk_space: {
                free: null,
                color: 'black'
            },
            loading: true
        };
        this.backend = new Comms();
    };

    componentDidMount(){
        this.backend.getServerDiskSpace()
            .then(function(res){
                let free = (res.data.disk_info.free / 1024 / 1024 / 1024).toFixed(2);
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
                        color: color
                    },
                    loading: false
                });
            }.bind(this));
    };

    render(){
        return (
          <Segment loading={this.state.loading} textAlign='center'>
              <List horizontal>
                  <List.Item className="srv-info-item">
                      <Icon name="disk outline" color={ this.state.disk_space.color } size="big" />
                      <List.Content textAlign="left">
                          <List.Header>Disk space</List.Header>
                          <List.Description>
                              Free: { this.state.disk_space.free } GB
                          </List.Description>
                      </List.Content>
                  </List.Item>
                  <List.Item className="srv-info-item">
                      <Icon name="idea" color={ this.state.online_status.color } size="big" />
                      <List.Content>
                          <List.Header>Server status</List.Header>
                          <List.Description>
                              { this.state.online_status.text }
                          </List.Description>
                      </List.Content>
                  </List.Item>
              </List>
          </Segment>
        );
    }
}
