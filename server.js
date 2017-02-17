var express = require('express');
var path = require('path');
var app = express();
var cfg = require('./server.config.json');


app.use(express.static(path.join(__dirname, 'public/static/')));


app.get('/', function (req, res) {
    res.redirect('/index.html');
    //res.send('Hello World!')
})

app.listen(cfg.port, cfg.address, function () {
    console.log('Example app listening on port ' + cfg.address + ':' + cfg.port + '!');
})