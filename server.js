var express = require('express');
var path = require('path');
var app = express();
var cfg = require('./server.config.json');
const disk = require('diskusage');

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


/**
 * Catch all and redirect to index for Raect to handle
 *
 */
app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/static/', 'index.html'));
});


app.listen(cfg.port, cfg.address, function () {
    console.log('Example app listening on port ' + cfg.address + ':' + cfg.port + '!');
})