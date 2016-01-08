net=require('net')
utils = require("../util");
weinre = require("weinre");
http = require("http");

exports.run = (options) ->
    getPort (port)->
        weinreOption = {
            httpPort: port,
            boundHost: '-all-',
            verbose: false,
            debug: false,
            readTimeout: 5
        };
        weinreOption.deathTimeout = 3 * weinreOption.readTimeout;
        weinre.run(weinreOption)
        utils.logger.log 'weinre已启动'

getPort=(callback)->
    server = http.createServer()
    server.listen(0)
    port=0
    server.on 'listening'
        ,()->
            port = server.address().port
            server.close()
    server.on 'close'
        ,()->
            callback(port)
