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
                disk_info: disk.checkSync('C:')
            });
            break;
        case 'get_something_else':
            res.send({});
            break;
        default:
            res.send({
                data: 'Nothing'
            });
            break;
    }
});

app.get('/rest/torrents/:what', function(req, res){
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
    /*
     if($torrent[1] >= 136){
     $item = array(
     'status' => $torrent[21],
     'progress' => $torrent[4] / 10,
     'name' => $torrent[2],
     'peers' => $torrent[13],
     'seeds' => $torrent[15],
     'hash' => $torrent[0],
     'download_speed' => number_format($torrent[9] / 1024 / 1024, 2),
     'added' => $torrent[23]
     );
     array_push($result['list'], $item);
     }
     * */
}