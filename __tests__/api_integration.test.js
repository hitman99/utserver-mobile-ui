/**
 * Created by Tomas on 2017-09-09.
 */
import request from 'supertest';

import app from '../src/express/routes';

describe('URL tests', () => {
    it('loads index', () => {
        return request(app).get('/')
            .expect(200);
    });
    it('loads /list', () => {
        return request(app).get('/list')
            .expect(200);
    });
});
describe('Server disk space tests', () => {
    it('should have available disk space', () => {
        return request(app).get('/rest/serverinfo/disk-space')
            .expect(200)
            .then((response)=>{
                expect(response.body).toHaveProperty('disk_info.available');
            })
    });
    it('should have free disk space', () => {
        return request(app).get('/rest/serverinfo/disk-space')
            .expect(200)
            .then((response)=>{
                expect(response.body).toHaveProperty('disk_info.free');
            })
    });
    it('should have total disk space', () => {
        return request(app).get('/rest/serverinfo/disk-space')
            .expect(200)
            .then((response)=>{
                expect(response.body).toHaveProperty('disk_info.total');
            })
    });
});

