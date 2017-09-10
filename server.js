var cfg = require('./server.config.json');
var server = require('./src/express/routes');

server.prepare_utserver(cfg);
server.app.listen(cfg.port, cfg.address, function () {
    console.log('Server listening on port ' + cfg.address + ':' + cfg.port + '!');
});
