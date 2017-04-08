import axios from 'axios';
export default class ServerControls {
    constructor() {

    }

    startServer(){
        return axios.post('/rest/servercontrol/start');
    }

    stopServer(){
        return axios.post('/rest/servercontrol/stop');
    }

    getServerStatus(){
        return axios.get('/rest/serverinfo/utserver-status');
    }
}
