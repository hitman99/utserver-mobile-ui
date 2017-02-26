var express = require('express');
var path = require('path');
var app = express();
var cfg = require('./server.config.json');
const disk = require('diskusage');
var uClient = require('utorrent-api');
var fs = require('fs');

var utorrent = new uClient(cfg.utserver.host, cfg.utserver.port);
utorrent.setCredentials(cfg.utserver.credentials.user, cfg.utserver.credentials.password);

app.use(express.static(path.join(__dirname, 'public/static/')));


app.get('/', function (req, res) {
    res.redirect('/index.html');
});

app.get('/rest/serverinfo/:what', function(req, res){
    switch(req.params.what){
        case 'disk-space':
            res.send({
                disk_info: disk.checkSync(cfg.destination_dir)
            });
            break;
        case 'utserver-status':
            run_cmd('ls', ['-al'], function (data) {
                res.send({
                    status: 'alive'
                });
            })

            break;
        default:
            res.send({
                data: 'Nothing'
            });
            break;
    }
});

app.get('/rest/torrents/:what/:hash?', function(req, res){
    switch(req.params.what){
        case 'list':
            utorrent.call('list', function(err, torrents_list) {
                if(err) {
                    res.send([]);
                }
                else{
                    res.send((torrents_list != null ? objectify_torrents(torrents_list.torrents) : []));
                }
            });
            break;
        case 'files':
            utorrent.call('getfiles', {'hash': req.params.hash}, function(err, data) {
                if(err) {
                    res.send({
                        files: []
                    });
                }
                else{
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


/**
 * Catch all and redirect to index for Raect to handle
 *
 */
app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/static/', 'index.html'));
});


app.listen(cfg.port, cfg.address, function () {
    console.log('Example app listening on port ' + cfg.address + ':' + cfg.port + '!');
});

function objectify_torrents(list){
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

function run_cmd(cmd, args, callback ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callback (resp) });
}