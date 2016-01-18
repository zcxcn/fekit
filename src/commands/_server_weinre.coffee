net=require('net')
utils = require("../util");
weinre = require("weinre");
http = require("http");

exports.run = (options,callback) ->

    if(options.weinre.indexOf(':')>-1)
        customAddress=options.weinre.split(':')[0]
        customPort=options.weinre.split(':')[1]
    else
        logger.error 'weinre参数有误，正确示例：192.168.202.139:8081'
        return

    getPort (port)->
        weinreOption = {
            httpPort: customPort || port,
            boundHost: customAddress||'-all-',
            verbose: false,
            debug: false,
            readTimeout: 5
        };
        process.env["WEINRE_PORT"]=port
        weinreOption.deathTimeout = 3 * weinreOption.readTimeout;
        weinre.run(weinreOption)

        utils.logger.log 'weinre已启动!'
        callback(weinreOption)



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
