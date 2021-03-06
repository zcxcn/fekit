// Generated by CoffeeScript 1.4.0
(function() {
  var compiler, pid, syspath, utils;

  compiler = require("../compiler/compiler");

  utils = require("../util");

  syspath = require("path");

  pid = process.pid;

  process.on('message', function(m) {
    var conf, dest, disdest, dispath, o, opts, parents, srcpath, urlconvert, _done;
    conf = utils.config.parse(m.cwd);
    o = conf.get_export_info(m.file);
    srcpath = o.path;
    parents = o.parents;
    opts = o.opts;
    dispath = syspath.relative(process.cwd(), srcpath);
    utils.logger.log("<" + pid + "> 正在处理 " + dispath);
    urlconvert = new utils.UrlConvert(srcpath, m.cwd);
    if (opts.no_version) {
      urlconvert.set_no_version();
    }
    urlconvert.set_extname_type(compiler.getContentType(srcpath));
    dest = urlconvert.to_dev();
    disdest = syspath.relative(process.cwd(), dest);
    _done = function(err, source) {
      var writer;
      if (err) {
        utils.logger.error(err.toString());
        utils.exit(1);
        return;
      }
      writer = new utils.file.writer();
      writer.write(dest, source);
      if (!opts.no_version) {
        writer.write(urlconvert.to_ver(), "dev");
      }
      utils.logger.log("<" + pid + "> 已经处理 " + dispath + " ==> " + disdest);
      return process.send('ok');
    };
    return compiler.compile(srcpath, {
      dependencies_filepath_list: parents,
      environment: 'dev'
    }, _done);
  });

}).call(this);
