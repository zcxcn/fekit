// Generated by CoffeeScript 1.4.0
(function() {
  var prompt, schema, start, utils;

  utils = require('../util');

  prompt = require('prompt');

  exports.usage = "初始化目录为标准[fekit项目]";

  exports.set_options = function(optimist) {
    optimist.usage('init [新建目录名]');
    return optimist;
  };

  exports.run = function(options) {
    return start(options);
  };

  schema = {
    properties: {
      name: {
        pattern: /^[0-9a-z\-_]+$/i,
        message: '只允许输入字母、连接符、下划线',
        required: true,
        description: 'Enter project name'
      },
      version: {
        pattern: /^\d{1,2}\.\d{1,2}\.\d{1,2}$/,
        message: '只允许输入如 1.2.3',
        required: true,
        description: 'Enter project version',
        "default": '0.0.0'
      }
    }
  };

  start = function(opts) {
    var base, config_path, name;
    base = opts.cwd;
    if (opts._[1]) {
      base = utils.path.join(opts.cwd, opts._[1]);
    }
    config_path = utils.path.join(base, 'fekit.config');
    if (utils.path.exists(config_path)) {
      return utils.logger.error('初始化失败, 已经存在 fekit.config 文件');
    }
    name = utils.path.basename(base);
    schema.properties.name["default"] = name;
    prompt.start();
    return prompt.get(schema, function(err, result) {
      var config;
      if (err) {
        return;
      }
      config = utils.config.createEmptySchema();
      config.name = result.name;
      config.version = result.version;
      utils.file.mkdirp(utils.path.join(base, 'src'));
      utils.file.io.write(config_path, JSON.stringify(config, {}, 4));
      return utils.logger.log("初始化成功.");
    });
  };

}).call(this);