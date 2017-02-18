var express = require('express');
var path = require('path');
var app = express();
var cfg = require('./server.config.json');
const disk = require('diskusage');

app.use(express.static(path.join(__dirname, 'public/static/')));


app.get('/', function (req, res) {
    res.redirect('/index.html');
    //res.send('Hello World!')
})

app.get('/rest/serverinfo/:what', function(req, res){
    switch(req.params.what){
        case 'disk-space':
            res.send({
                data: disk.checkSync('D:')
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

app.listen(cfg.port, cfg.address, function () {
    console.log('Example app listening on port ' + cfg.address + ':' + cfg.port + '!');
})