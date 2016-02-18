/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

var fs = require('fs')
  , path = require('path')
  , util = require('util')
  , methods = require('methods')
  , _ = require('underscore')
  , pathToRegExp = require('path-to-regexp')
  , DEFAULT_OPTS = {
      controllers: path.join(process.cwd(), 'controllers')
    , url: '/'
    }
;

function paramKeys(vpath)
{
  var keys = [];
  pathToRegExp(vpath, keys);
  return _.map(keys, function(key) { return key.name; });
}

function buildValidatorChain(vpath, handler)
{
  var keys = paramKeys(vpath);
  if (!keys.length) {
    return handler;
  }

  var validators = {};
  _.toArray(arguments).slice(2).forEach(function(validator) {
    if (_.isObject(validator)) {
      _.extend(validators, validator);
    }
  });

  var chain = _.map(validators, function(validator, key) {
                var check;
                if (~_.indexOf(keys, key)) {
                  if (_.isRegExp(validator)) {
                    check = function(value) {
                      return validator.test(value);
                    };
                  }
                  else if (_.isFunction(validator)) {
                    check = validator;
                  }
                }

                return check ? { key: key, check: check } : null;
              }).filter(function(validator) {
                return validator !== null;
              })
  ;

  if (!chain.length) {
    return handler;
  }

  return function(req, res, next) {
    var ok = _.reduce(chain, function(valid, validator) {
               if (valid) {
                 valid = validator.check(req.params[validator.key]);
               }
               return valid;
             }, true)
    ;

    ok ? handler(req, res, next) : next();
  };
}

function buildMiddlewareChain()
{
  var handlers = [];

  _.toArray(arguments).forEach(function(middlewares) {
    if (_.isFunction(middlewares)) {
      handlers.push(middlewares);
    }
    else if (_.isArray(middlewares)) {
      middlewares.forEach(function(middleware) {
        if (_.isFunction(middleware)) {
          handlers.push(middleware);
        }
      });
    }
  });

  return handlers;
}

function loadOneController(app, opts, file)
{
  var name = [
        opts.url.replace(/^\/+/, '/').replace(/\/+$/, '')
      , path.basename(file, '.js')
      ].join('/')
    , fullpath = path.join(opts.controllers, file)
    , controller = require(fullpath)
    , config = controller.__exprest
    , error = function() {
        return new Error(name+' controller: '+util.format.apply(util, arguments)+' in '+fullpath);
      }
  ;

  if (!config) {
    throw error('No __exprest defined');
  }
  if (!_.isObject(config)) {
    throw error('Invalid __exprest');
  }
  if (!config.routes) {
    throw error('No __exprest.routes defined');
  }
  if (!_.isArray(config.routes)) {
    throw error('Invalid __exprest.routes');
  }

  var preset = config.preset || {};

  config.routes.forEach(function(route, idx) {
    var method = (route.method || 'get').toLowerCase();
    if (!_.find(methods, function(verb) { return verb === method })) {
      throw error('Unknown method "%s" in __exprest.routes[%d].method', method, idx);
    }

    var action = route.action
    if (!action) {
      throw error('No __exprest.routes[%d].action defined', idx);
    }

    var handler = controller[action];
    if (!_.isFunction(handler)) {
      throw error('No %s() implemented', action);
    }

    var vpath = route.path ? [name, route.path].join('/') : name
      , authorized = (!_.isUndefined(route.authorized) ? route : preset).authorized !== false
      , authorizer = authorized ? opts.authorizer : undefined
      , validators = buildValidatorChain(vpath, handler, preset.validator, route.validator)
      , middlewares = buildMiddlewareChain(authorizer, preset.middleware, route.middleware, validators)
    ;

    app[method](vpath, middlewares);

    if (_.isFunction(opts.logger)) {
      opts.logger(util.format('[exprest4] app.%s("%s") loaded.', method, vpath));
    }
  });
}

function loadControllers(app, opts, files)
{
  return Promise.all(
    _.map(files, function(file) {
      return new Promise(function(resolved, rejected) {
        try {
          loadOneController(app, opts, file);
          resolved();
        }
        catch (err) {
          rejected(err);
        }
      });
    })
  );
}

module.exports.route = function(app, opts) {
  opts = _.defaults(opts || {}, DEFAULT_OPTS);
  return new Promise(function(resolved, rejected) {
    fs.readdir(opts.controllers, function(err, files) {
      err ?
        rejected(err) :
        loadControllers(app, opts, files).then(resolved, rejected);
    });
  });
}
