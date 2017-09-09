var cfg = require('./server.config.json');
var server = require('./src/express/routes');

server.listen(cfg.port, cfg.address, function () {
    console.log('Example app listening on port ' + cfg.address + ':' + cfg.port + '!');
});
