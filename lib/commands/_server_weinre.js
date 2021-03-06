// Generated by CoffeeScript 1.4.0
(function() {
  var getPort, http, net, utils, weinre;

  net = require('net');

  utils = require("../util");

  weinre = require("weinre");

  http = require("http");

  exports.run = function(options, callback) {
    var customAddress, customPort;
    if (options.weinre.indexOf(':') > -1) {
      customAddress = options.weinre.split(':')[0];
      customPort = options.weinre.split(':')[1];
    } else {
      logger.error('weinre参数有误，正确示例：192.168.202.139:8081');
      return;
    }
    return getPort(function(port) {
      var weinreOption;
      weinreOption = {
        httpPort: customPort || port,
        boundHost: customAddress || '-all-',
        verbose: false,
        debug: false,
        readTimeout: 5
      };
      process.env["WEINRE_PORT"] = port;
      weinreOption.deathTimeout = 3 * weinreOption.readTimeout;
      weinre.run(weinreOption);
      utils.logger.log('weinre已启动!');
      return callback(weinreOption);
    });
  };

  getPort = function(callback) {
    var port, server;
    server = http.createServer();
    server.listen(0);
    port = 0;
    server.on('listening', function() {
      port = server.address().port;
      return server.close();
    });
    return server.on('close', function() {
      return callback(port);
    });
  };

}).call(this);
