/**
 * Created by Tomas on 2017-09-09.
 */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
const disk = require('diskusage');
var fs = require('fs');
// If the file is not found, fallback for bare minimum for testing
var cfg = { destination_dir: '/' };
var utorrent = null;

function objectify_torrents(list) {
    return list.filter(function (item) {
        return item[1] >= 136;
    }).map(function (item, idx) {
        return {
            status: item[21],
            progress: item[4] / 10,
            name: item[2],
            hash: item[0],
            download_speed: (item[9] / 1024 / 1024).toFixed(2),
            added: item[23]
        }
    });
}

function run_cmd(cmd, args, callback) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) {
        resp += buffer.toString()
    });
    child.stdout.on('end', function () {
        callback(resp)
    });
}





// Static files
app.use(express.static(path.join(__dirname, 'public/static/')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.redirect('/index.html');
});

app.get('/rest/serverinfo/:what', function (req, res) {
    switch (req.params.what) {
        case 'disk-space':
            res.send({
                disk_info: disk.checkSync(cfg.destination_dir)
            });
            break;
        case 'utserver-status':
            run_cmd('scripts/check_server.sh', [], function (data) {
                res.send({
                    status: data.trim()
                });
            });

            break;
        default:
            res.send({
                data: 'Nothing'
            });
            break;
    }
});

app.post('/rest/servercontrol/:what', function (req, res) {
    switch (req.params.what) {
        case 'start':
            run_cmd('scripts/start_utserver.sh', ['autokill'], function (data) {
                res.send({
                    status: 'alive',
                    data: data
                });
            });

            break;
        case 'stop':
            run_cmd('scripts/stop_utserver.sh', [], function (data) {
                res.send({
                    status: 'dead',
                    data: data
                });
            });

            break;
        default:
            res.send({
                status: 'unknown',
                data: 'Nothing'
            });
            break;
    }
});

app.get('/rest/torrents/:what/:hash?', function (req, res) {
    switch (req.params.what) {
        case 'list':
            utorrent.call('list', function (err, torrents_list) {
                if (err) {
                    res.send([]);
                }
                else {
                    res.send((torrents_list != null ? objectify_torrents(torrents_list.torrents) : []));
                }
            });
            break;
        case 'files':
            utorrent.call('getfiles', {'hash': req.params.hash}, function (err, data) {
                if (err) {
                    res.send({
                        files: []
                    });
                }
                else {
                    res.send({
                        files: data.files[1]
                    });
                }
            });

            break;
        default:
            res.send({
                data: 'Nothing'
            });
            break;
    }
});

app.delete('/rest/torrents/:hash', (req, res)=>{
    utorrent.call('removedata', { hash: req.params.hash }, (err, data)=>{
        if (err) {
            res.send({status: 'failed', message: err.message})
        }
        else {
            res.send({ status: 'success' });
        }
    });
});

app.post('/rest/torrents/:action', function (req, res) {
    switch (req.params.action) {
        case 'add-torrent':
            var final_url = req.body.torrent_url;
            if (typeof cfg.LM_cookie != 'undefined' && cfg.LM_cookie != null) {
                final_url += ':COOKIE:' + cfg.LM_cookie;
            }
            utorrent.call('add-url', {'s': final_url}, function (err, data) {
                if (err) {
                    res.send({status: 'failed'});
                }
                else {
                    if (typeof data.build != 'undefined') {
                        res.send({status: 'success'});
                    }
                    else {
                        res.send({status: 'failed'});
                    }
                }
            });
            break;
        default:
            res.send('Unknown action');
            break;
    }
});

/**
 * Catch all and redirect to index for React to handle
 *
 */
app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/static/', 'index.html'));
});

module.exports = app;

module.exports = {
    app: app,
    prepare_utserver: function(config){
        var uClient = require('utorrent-api');
        cfg = config;
        utorrent = new uClient(cfg.utserver.host, cfg.utserver.port);
        utorrent.setCredentials(cfg.utserver.credentials.user, cfg.utserver.credentials.password);
    }.bind(this)
};