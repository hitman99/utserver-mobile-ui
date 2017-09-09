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
describe('Server status tests', () => {
    it('get server disk space', () => {
        return request(app).get('/rest/serverinfo/disk-space')
            .expect(200)
            .expect(res).toHaveProperty('disk_info')
    });
    it('loads /list', () => {
        return request(app).get('/list')
            .expect(200);
    });
});


//app.close();
