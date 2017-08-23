import axios from 'axios';
export default class ServerControls {
    constructor() {

    }

    startServer(){
        return new Promise((resolve, reject) => {
            axios.post('/rest/servercontrol/start')
                .then((response)=>{
                    resolve(response.data);
                })
                .catch(()=>{
                    reject();
                });
        });
    }

    stopServer(){
        return new Promise((resolve, reject) => {
            axios.post('/rest/servercontrol/stop')
                .then((response)=>{
                    resolve(response.data);
                })
                .catch(()=>{
                    reject();
                });
        });
    }

    getServerStatus(){
        return new Promise((resolve, reject) => {
            axios.get('/rest/serverinfo/utserver-status')
                .then((response)=>{
                    resolve(response.data);
                })
                .catch(()=>{
                    reject();
                });
        });
    }
}
