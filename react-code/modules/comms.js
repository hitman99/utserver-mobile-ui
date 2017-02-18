import axios from 'axios';

/**
 * Communicate to backend
 */
export default class Comm {

    getServerDiskSpace(){
        return axios.get('/rest/serverinfo/disk-space');
    }
}