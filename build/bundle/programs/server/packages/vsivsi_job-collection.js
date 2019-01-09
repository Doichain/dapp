(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var later = Package['mrt:later'].later;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var __coffeescriptShare, Job, JobCollection;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/job/src/job_class.coffee.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var JobQueue, _clearInterval, _setImmediate, _setInterval, concatReduce, isBoolean, isInteger, methodCall, optionsHelp, reduceCallbacks, splitLongArray,     
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

methodCall = function(root, method, params, cb, after) {
  var apply, name, ref, ref1, ref2, ref3;
  if (after == null) {
    after = (function(ret) {
      return ret;
    });
  }
  apply = (ref = (ref1 = Job._ddp_apply) != null ? ref1[(ref2 = root.root) != null ? ref2 : root] : void 0) != null ? ref : Job._ddp_apply;
  if (typeof apply !== 'function') {
    throw new Error("Job remote method call error, no valid invocation method found.");
  }
  name = ((ref3 = root.root) != null ? ref3 : root) + "_" + method;
  if (cb && typeof cb === 'function') {
    return apply(name, params, (function(_this) {
      return function(err, res) {
        if (err) {
          return cb(err);
        }
        return cb(null, after(res));
      };
    })(this));
  } else {
    return after(apply(name, params));
  }
};

optionsHelp = function(options, cb) {
  var ref;
  if ((cb != null) && typeof cb !== 'function') {
    options = cb;
    cb = void 0;
  } else {
    if (!(typeof options === 'object' && options instanceof Array && options.length < 2)) {
      throw new Error('options... in optionsHelp must be an Array with zero or one elements');
    }
    options = (ref = options != null ? options[0] : void 0) != null ? ref : {};
  }
  if (typeof options !== 'object') {
    throw new Error('in optionsHelp options not an object or bad callback');
  }
  return [options, cb];
};

splitLongArray = function(arr, max) {
  var i, k, ref, results;
  if (!(arr instanceof Array && max > 0)) {
    throw new Error('splitLongArray: bad params');
  }
  results = [];
  for (i = k = 0, ref = Math.ceil(arr.length / max); 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
    results.push(arr.slice(i * max, (i + 1) * max));
  }
  return results;
};

reduceCallbacks = function(cb, num, reduce, init) {
  var cbCount, cbErr, cbRetVal;
  if (reduce == null) {
    reduce = (function(a, b) {
      return a || b;
    });
  }
  if (init == null) {
    init = false;
  }
  if (cb == null) {
    return void 0;
  }
  if (!(typeof cb === 'function' && num > 0 && typeof reduce === 'function')) {
    throw new Error('Bad params given to reduceCallbacks');
  }
  cbRetVal = init;
  cbCount = 0;
  cbErr = null;
  return function(err, res) {
    if (!cbErr) {
      if (err) {
        cbErr = err;
        return cb(err);
      } else {
        cbCount++;
        cbRetVal = reduce(cbRetVal, res);
        if (cbCount === num) {
          return cb(null, cbRetVal);
        } else if (cbCount > num) {
          throw new Error("reduceCallbacks callback invoked more than requested " + num + " times");
        }
      }
    }
  };
};

concatReduce = function(a, b) {
  if (!(a instanceof Array)) {
    a = [a];
  }
  return a.concat(b);
};

isInteger = function(i) {
  return typeof i === 'number' && Math.floor(i) === i;
};

isBoolean = function(b) {
  return typeof b === 'boolean';
};

_setImmediate = function() {
  var args, func;
  func = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setTimeout : void 0) != null) {
    return Meteor.setTimeout.apply(Meteor, [func, 0].concat(slice.call(args)));
  } else if (typeof setImmediate !== "undefined" && setImmediate !== null) {
    return setImmediate.apply(null, [func].concat(slice.call(args)));
  } else {
    return setTimeout.apply(null, [func, 0].concat(slice.call(args)));
  }
};

_setInterval = function() {
  var args, func, timeOut;
  func = arguments[0], timeOut = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setInterval : void 0) != null) {
    return Meteor.setInterval.apply(Meteor, [func, timeOut].concat(slice.call(args)));
  } else {
    return setInterval.apply(null, [func, timeOut].concat(slice.call(args)));
  }
};

_clearInterval = function(id) {
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.clearInterval : void 0) != null) {
    return Meteor.clearInterval(id);
  } else {
    return clearInterval(id);
  }
};

JobQueue = (function() {
  function JobQueue() {
    var k, options, ref, ref1, ref2, ref3, root1, type1, worker;
    root1 = arguments[0], type1 = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), worker = arguments[k++];
    this.root = root1;
    this.type = type1;
    this.worker = worker;
    if (!(this instanceof JobQueue)) {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(JobQueue, [this.root, this.type].concat(slice.call(options), [this.worker]), function(){});
    }
    ref = optionsHelp(options, this.worker), options = ref[0], this.worker = ref[1];
    this.pollInterval = (options.pollInterval != null) && !options.pollInterval ? Job.forever : !((options.pollInterval != null) && isInteger(options.pollInterval)) ? 5000 : options.pollInterval;
    if (!(isInteger(this.pollInterval) && this.pollInterval >= 0)) {
      throw new Error("JobQueue: Invalid pollInterval, must be a positive integer");
    }
    this.concurrency = (ref1 = options.concurrency) != null ? ref1 : 1;
    if (!(isInteger(this.concurrency) && this.concurrency >= 0)) {
      throw new Error("JobQueue: Invalid concurrency, must be a positive integer");
    }
    this.payload = (ref2 = options.payload) != null ? ref2 : 1;
    if (!(isInteger(this.payload) && this.payload >= 0)) {
      throw new Error("JobQueue: Invalid payload, must be a positive integer");
    }
    this.prefetch = (ref3 = options.prefetch) != null ? ref3 : 0;
    if (!(isInteger(this.prefetch) && this.prefetch >= 0)) {
      throw new Error("JobQueue: Invalid prefetch, must be a positive integer");
    }
    this.workTimeout = options.workTimeout;
    if ((this.workTimeout != null) && !(isInteger(this.workTimeout) && this.workTimeout >= 0)) {
      throw new Error("JobQueue: Invalid workTimeout, must be a positive integer");
    }
    this.callbackStrict = options.callbackStrict;
    if ((this.callbackStrict != null) && !isBoolean(this.callbackStrict)) {
      throw new Error("JobQueue: Invalid callbackStrict, must be a boolean");
    }
    this._workers = {};
    this._tasks = [];
    this._taskNumber = 0;
    this._stoppingGetWork = void 0;
    this._stoppingTasks = void 0;
    this._interval = null;
    this._getWorkOutstanding = false;
    this.paused = true;
    this.resume();
  }

  JobQueue.prototype._getWork = function() {
    var numJobsToGet, options;
    if (!(this._getWorkOutstanding || this.paused)) {
      numJobsToGet = this.prefetch + this.payload * (this.concurrency - this.running()) - this.length();
      if (numJobsToGet > 0) {
        this._getWorkOutstanding = true;
        options = {
          maxJobs: numJobsToGet
        };
        if (this.workTimeout != null) {
          options.workTimeout = this.workTimeout;
        }
        return Job.getWork(this.root, this.type, options, (function(_this) {
          return function(err, jobs) {
            var j, k, len;
            _this._getWorkOutstanding = false;
            if (err) {
              return console.error("JobQueue: Received error from getWork(): ", err);
            } else if ((jobs != null) && jobs instanceof Array) {
              if (jobs.length > numJobsToGet) {
                console.error("JobQueue: getWork() returned jobs (" + jobs.length + ") in excess of maxJobs (" + numJobsToGet + ")");
              }
              for (k = 0, len = jobs.length; k < len; k++) {
                j = jobs[k];
                _this._tasks.push(j);
                if (_this._stoppingGetWork == null) {
                  _setImmediate(_this._process.bind(_this));
                }
              }
              if (_this._stoppingGetWork != null) {
                return _this._stoppingGetWork();
              }
            } else {
              return console.error("JobQueue: Nonarray response from server from getWork()");
            }
          };
        })(this));
      }
    }
  };

  JobQueue.prototype._only_once = function(fn) {
    var called;
    called = false;
    return (function(_this) {
      return function() {
        if (called) {
          console.error("Worker callback called multiple times in JobQueue");
          if (_this.callbackStrict) {
            throw new Error("JobQueue worker callback was invoked multiple times");
          }
        }
        called = true;
        return fn.apply(_this, arguments);
      };
    })(this);
  };

  JobQueue.prototype._process = function() {
    var cb, job, next;
    if (!this.paused && this.running() < this.concurrency && this.length()) {
      if (this.payload > 1) {
        job = this._tasks.splice(0, this.payload);
      } else {
        job = this._tasks.shift();
      }
      job._taskId = "Task_" + (this._taskNumber++);
      this._workers[job._taskId] = job;
      next = (function(_this) {
        return function() {
          delete _this._workers[job._taskId];
          if ((_this._stoppingTasks != null) && _this.running() === 0 && _this.length() === 0) {
            return _this._stoppingTasks();
          } else {
            _setImmediate(_this._process.bind(_this));
            return _setImmediate(_this._getWork.bind(_this));
          }
        };
      })(this);
      cb = this._only_once(next);
      return this.worker(job, cb);
    }
  };

  JobQueue.prototype._stopGetWork = function(callback) {
    _clearInterval(this._interval);
    this._interval = null;
    if (this._getWorkOutstanding) {
      return this._stoppingGetWork = callback;
    } else {
      return _setImmediate(callback);
    }
  };

  JobQueue.prototype._waitForTasks = function(callback) {
    if (this.running() !== 0) {
      return this._stoppingTasks = callback;
    } else {
      return _setImmediate(callback);
    }
  };

  JobQueue.prototype._failJobs = function(tasks, callback) {
    var count, job, k, len, results;
    if (tasks.length === 0) {
      _setImmediate(callback);
    }
    count = 0;
    results = [];
    for (k = 0, len = tasks.length; k < len; k++) {
      job = tasks[k];
      results.push(job.fail("Worker shutdown", (function(_this) {
        return function(err, res) {
          count++;
          if (count === tasks.length) {
            return callback();
          }
        };
      })(this)));
    }
    return results;
  };

  JobQueue.prototype._hard = function(callback) {
    this.paused = true;
    return this._stopGetWork((function(_this) {
      return function() {
        var i, r, ref, tasks;
        tasks = _this._tasks;
        _this._tasks = [];
        ref = _this._workers;
        for (i in ref) {
          r = ref[i];
          tasks = tasks.concat(r);
        }
        return _this._failJobs(tasks, callback);
      };
    })(this));
  };

  JobQueue.prototype._stop = function(callback) {
    this.paused = true;
    return this._stopGetWork((function(_this) {
      return function() {
        var tasks;
        tasks = _this._tasks;
        _this._tasks = [];
        return _this._waitForTasks(function() {
          return _this._failJobs(tasks, callback);
        });
      };
    })(this));
  };

  JobQueue.prototype._soft = function(callback) {
    return this._stopGetWork((function(_this) {
      return function() {
        return _this._waitForTasks(callback);
      };
    })(this));
  };

  JobQueue.prototype.length = function() {
    return this._tasks.length;
  };

  JobQueue.prototype.running = function() {
    return Object.keys(this._workers).length;
  };

  JobQueue.prototype.idle = function() {
    return this.length() + this.running() === 0;
  };

  JobQueue.prototype.full = function() {
    return this.running() === this.concurrency;
  };

  JobQueue.prototype.pause = function() {
    if (this.paused) {
      return;
    }
    if (!(this.pollInterval >= Job.forever)) {
      _clearInterval(this._interval);
      this._interval = null;
    }
    this.paused = true;
    return this;
  };

  JobQueue.prototype.resume = function() {
    var k, ref, w;
    if (!this.paused) {
      return;
    }
    this.paused = false;
    _setImmediate(this._getWork.bind(this));
    if (!(this.pollInterval >= Job.forever)) {
      this._interval = _setInterval(this._getWork.bind(this), this.pollInterval);
    }
    for (w = k = 1, ref = this.concurrency; 1 <= ref ? k <= ref : k >= ref; w = 1 <= ref ? ++k : --k) {
      _setImmediate(this._process.bind(this));
    }
    return this;
  };

  JobQueue.prototype.trigger = function() {
    if (this.paused) {
      return;
    }
    _setImmediate(this._getWork.bind(this));
    return this;
  };

  JobQueue.prototype.shutdown = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.level == null) {
      options.level = 'normal';
    }
    if (options.quiet == null) {
      options.quiet = false;
    }
    if (cb == null) {
      if (!options.quiet) {
        console.warn("using default shutdown callback!");
      }
      cb = (function(_this) {
        return function() {
          return console.warn("Shutdown complete");
        };
      })(this);
    }
    switch (options.level) {
      case 'hard':
        if (!options.quiet) {
          console.warn("Shutting down hard");
        }
        return this._hard(cb);
      case 'soft':
        if (!options.quiet) {
          console.warn("Shutting down soft");
        }
        return this._soft(cb);
      default:
        if (!options.quiet) {
          console.warn("Shutting down normally");
        }
        return this._stop(cb);
    }
  };

  return JobQueue;

})();

Job = (function() {
  Job.forever = 9007199254740992;

  Job.foreverDate = new Date(8640000000000000);

  Job.jobPriorities = {
    low: 10,
    normal: 0,
    medium: -5,
    high: -10,
    critical: -15
  };

  Job.jobRetryBackoffMethods = ['constant', 'exponential'];

  Job.jobStatuses = ['waiting', 'paused', 'ready', 'running', 'failed', 'cancelled', 'completed'];

  Job.jobLogLevels = ['info', 'success', 'warning', 'danger'];

  Job.jobStatusCancellable = ['running', 'ready', 'waiting', 'paused'];

  Job.jobStatusPausable = ['ready', 'waiting'];

  Job.jobStatusRemovable = ['cancelled', 'completed', 'failed'];

  Job.jobStatusRestartable = ['cancelled', 'failed'];

  Job.ddpMethods = ['startJobs', 'stopJobs', 'startJobServer', 'shutdownJobServer', 'jobRemove', 'jobPause', 'jobResume', 'jobReady', 'jobCancel', 'jobRestart', 'jobSave', 'jobRerun', 'getWork', 'getJob', 'jobLog', 'jobProgress', 'jobDone', 'jobFail'];

  Job.ddpPermissionLevels = ['admin', 'manager', 'creator', 'worker'];

  Job.ddpMethodPermissions = {
    'startJobs': ['startJobs', 'admin'],
    'stopJobs': ['stopJobs', 'admin'],
    'startJobServer': ['startJobServer', 'admin'],
    'shutdownJobServer': ['shutdownJobServer', 'admin'],
    'jobRemove': ['jobRemove', 'admin', 'manager'],
    'jobPause': ['jobPause', 'admin', 'manager'],
    'jobResume': ['jobResume', 'admin', 'manager'],
    'jobCancel': ['jobCancel', 'admin', 'manager'],
    'jobReady': ['jobReady', 'admin', 'manager'],
    'jobRestart': ['jobRestart', 'admin', 'manager'],
    'jobSave': ['jobSave', 'admin', 'creator'],
    'jobRerun': ['jobRerun', 'admin', 'creator'],
    'getWork': ['getWork', 'admin', 'worker'],
    'getJob': ['getJob', 'admin', 'worker'],
    'jobLog': ['jobLog', 'admin', 'worker'],
    'jobProgress': ['jobProgress', 'admin', 'worker'],
    'jobDone': ['jobDone', 'admin', 'worker'],
    'jobFail': ['jobFail', 'admin', 'worker']
  };

  Job._ddp_apply = void 0;

  Job._setDDPApply = function(apply, collectionName) {
    if (typeof apply === 'function') {
      if (typeof collectionName === 'string') {
        if (this._ddp_apply == null) {
          this._ddp_apply = {};
        }
        if (typeof this._ddp_apply === 'function') {
          throw new Error("Job.setDDP must specify a collection name each time if called more than once.");
        }
        return this._ddp_apply[collectionName] = apply;
      } else if (!this._ddp_apply) {
        return this._ddp_apply = apply;
      } else {
        throw new Error("Job.setDDP must specify a collection name each time if called more than once.");
      }
    } else {
      throw new Error("Bad function in Job.setDDPApply()");
    }
  };

  Job.setDDP = function(ddp, collectionNames, Fiber) {
    var collName, k, len, results;
    if (ddp == null) {
      ddp = null;
    }
    if (collectionNames == null) {
      collectionNames = null;
    }
    if (Fiber == null) {
      Fiber = null;
    }
    if (!((typeof collectionNames === 'string') || (collectionNames instanceof Array))) {
      Fiber = collectionNames;
      collectionNames = [void 0];
    } else if (typeof collectionNames === 'string') {
      collectionNames = [collectionNames];
    }
    results = [];
    for (k = 0, len = collectionNames.length; k < len; k++) {
      collName = collectionNames[k];
      if (!((ddp != null) && (ddp.close != null) && (ddp.subscribe != null))) {
        if (ddp === null && ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.apply : void 0) != null)) {
          results.push(this._setDDPApply(Meteor.apply, collName));
        } else {
          throw new Error("Bad ddp object in Job.setDDP()");
        }
      } else if (ddp.observe == null) {
        results.push(this._setDDPApply(ddp.apply.bind(ddp), collName));
      } else {
        if (Fiber == null) {
          results.push(this._setDDPApply(ddp.call.bind(ddp), collName));
        } else {
          results.push(this._setDDPApply((function(name, params, cb) {
            var fib;
            fib = Fiber.current;
            ddp.call(name, params, function(err, res) {
              if ((cb != null) && typeof cb === 'function') {
                return cb(err, res);
              } else {
                if (err) {
                  return fib.throwInto(err);
                } else {
                  return fib.run(res);
                }
              }
            });
            if ((cb != null) && typeof cb === 'function') {

            } else {
              return Fiber["yield"]();
            }
          }), collName));
        }
      }
    }
    return results;
  };

  Job.getWork = function() {
    var cb, k, options, ref, root, type;
    root = arguments[0], type = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (typeof type === 'string') {
      type = [type];
    }
    if (options.workTimeout != null) {
      if (!(isInteger(options.workTimeout) && options.workTimeout > 0)) {
        throw new Error('getWork: workTimeout must be a positive integer');
      }
    }
    return methodCall(root, "getWork", [type, options], cb, (function(_this) {
      return function(res) {
        var doc, jobs;
        jobs = ((function() {
          var l, len, results;
          results = [];
          for (l = 0, len = res.length; l < len; l++) {
            doc = res[l];
            results.push(new Job(root, doc));
          }
          return results;
        })()) || [];
        if (options.maxJobs != null) {
          return jobs;
        } else {
          return jobs[0];
        }
      };
    })(this));
  };

  Job.processJobs = JobQueue;

  Job.makeJob = (function() {
    var depFlag;
    depFlag = false;
    return function(root, doc) {
      if (!depFlag) {
        depFlag = true;
        console.warn("Job.makeJob(root, jobDoc) has been deprecated and will be removed in a future release, use 'new Job(root, jobDoc)' instead.");
      }
      return new Job(root, doc);
    };
  })();

  Job.getJob = function() {
    var cb, id, k, options, ref, root;
    root = arguments[0], id = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.getLog == null) {
      options.getLog = false;
    }
    return methodCall(root, "getJob", [id, options], cb, (function(_this) {
      return function(doc) {
        if (doc) {
          return new Job(root, doc);
        } else {
          return void 0;
        }
      };
    })(this));
  };

  Job.getJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.getLog == null) {
      options.getLog = false;
    }
    retVal = [];
    chunksOfIds = splitLongArray(ids, 32);
    myCb = reduceCallbacks(cb, chunksOfIds.length, concatReduce, []);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = retVal.concat(methodCall(root, "getJob", [chunkOfIds, options], myCb, (function(_this) {
        return function(doc) {
          var d, len1, m, results;
          if (doc) {
            results = [];
            for (m = 0, len1 = doc.length; m < len1; m++) {
              d = doc[m];
              results.push(new Job(root, d.type, d.data, d));
            }
            return results;
          } else {
            return null;
          }
        };
      })(this)));
    }
    return retVal;
  };

  Job.pauseJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobPause", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.resumeJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobResume", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.readyJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    if (ids == null) {
      ids = [];
    }
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.force == null) {
      options.force = false;
    }
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    if (!(chunksOfIds.length > 0)) {
      chunksOfIds = [[]];
    }
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobReady", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.cancelJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.antecedents == null) {
      options.antecedents = true;
    }
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobCancel", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.restartJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.retries == null) {
      options.retries = 1;
    }
    if (options.dependents == null) {
      options.dependents = true;
    }
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobRestart", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.removeJobs = function() {
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    retVal = false;
    chunksOfIds = splitLongArray(ids, 256);
    myCb = reduceCallbacks(cb, chunksOfIds.length);
    for (l = 0, len = chunksOfIds.length; l < len; l++) {
      chunkOfIds = chunksOfIds[l];
      retVal = methodCall(root, "jobRemove", [chunkOfIds, options], myCb) || retVal;
    }
    return retVal;
  };

  Job.startJobs = function() {
    var cb, k, options, ref, root;
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    return methodCall(root, "startJobs", [options], cb);
  };

  Job.stopJobs = function() {
    var cb, k, options, ref, root;
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.timeout == null) {
      options.timeout = 60 * 1000;
    }
    return methodCall(root, "stopJobs", [options], cb);
  };

  Job.startJobServer = function() {
    var cb, k, options, ref, root;
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    return methodCall(root, "startJobServer", [options], cb);
  };

  Job.shutdownJobServer = function() {
    var cb, k, options, ref, root;
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.timeout == null) {
      options.timeout = 60 * 1000;
    }
    return methodCall(root, "shutdownJobServer", [options], cb);
  };

  function Job(root1, type, data) {
    var doc, ref, time;
    this.root = root1;
    if (!(this instanceof Job)) {
      return new Job(this.root, type, data);
    }
    this._root = this.root;
    if ((((ref = this.root) != null ? ref.root : void 0) != null) && typeof this.root.root === 'string') {
      this.root = this._root.root;
    }
    if ((data == null) && ((type != null ? type.data : void 0) != null) && ((type != null ? type.type : void 0) != null)) {
      if (type instanceof Job) {
        return type;
      }
      doc = type;
      data = doc.data;
      type = doc.type;
    } else {
      doc = {};
    }
    if (!(typeof doc === 'object' && typeof data === 'object' && typeof type === 'string' && typeof this.root === 'string')) {
      throw new Error("new Job: bad parameter(s), " + this.root + " (" + (typeof this.root) + "), " + type + " (" + (typeof type) + "), " + data + " (" + (typeof data) + "), " + doc + " (" + (typeof doc) + ")");
    } else if ((doc.type != null) && (doc.data != null)) {
      this._doc = doc;
    } else {
      time = new Date();
      this._doc = {
        runId: null,
        type: type,
        data: data,
        status: 'waiting',
        updated: time,
        created: time
      };
      this.priority().retry().repeat().after().progress().depends().log("Constructed");
    }
    return this;
  }

  Job.prototype._echo = function(message, level) {
    if (level == null) {
      level = null;
    }
    switch (level) {
      case 'danger':
        console.error(message);
        break;
      case 'warning':
        console.warn(message);
        break;
      case 'success':
        console.log(message);
        break;
      default:
        console.info(message);
    }
  };

  Job.prototype.depends = function(jobs) {
    var depends, j, k, len;
    if (jobs) {
      if (jobs instanceof Job) {
        jobs = [jobs];
      }
      if (jobs instanceof Array) {
        depends = this._doc.depends;
        for (k = 0, len = jobs.length; k < len; k++) {
          j = jobs[k];
          if (!(j instanceof Job && (j._doc._id != null))) {
            throw new Error('Each provided object must be a saved Job instance (with an _id)');
          }
          depends.push(j._doc._id);
        }
      } else {
        throw new Error('Bad input parameter: depends() accepts a falsy value, or Job or array of Jobs');
      }
    } else {
      depends = [];
    }
    this._doc.depends = depends;
    this._doc.resolved = [];
    return this;
  };

  Job.prototype.priority = function(level) {
    var priority;
    if (level == null) {
      level = 0;
    }
    if (typeof level === 'string') {
      priority = Job.jobPriorities[level];
      if (priority == null) {
        throw new Error('Invalid string priority level provided');
      }
    } else if (isInteger(level)) {
      priority = level;
    } else {
      throw new Error('priority must be an integer or valid priority level');
      priority = 0;
    }
    this._doc.priority = priority;
    return this;
  };

  Job.prototype.retry = function(options) {
    var base, ref;
    if (options == null) {
      options = 0;
    }
    if (isInteger(options) && options >= 0) {
      options = {
        retries: options
      };
    }
    if (typeof options !== 'object') {
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');
    }
    if (options.retries != null) {
      if (!(isInteger(options.retries) && options.retries >= 0)) {
        throw new Error('bad option: retries must be an integer >= 0');
      }
      options.retries++;
    } else {
      options.retries = Job.forever;
    }
    if (options.until != null) {
      if (!(options.until instanceof Date)) {
        throw new Error('bad option: until must be a Date object');
      }
    } else {
      options.until = Job.foreverDate;
    }
    if (options.wait != null) {
      if (!(isInteger(options.wait) && options.wait >= 0)) {
        throw new Error('bad option: wait must be an integer >= 0');
      }
    } else {
      options.wait = 5 * 60 * 1000;
    }
    if (options.backoff != null) {
      if (ref = options.backoff, indexOf.call(Job.jobRetryBackoffMethods, ref) < 0) {
        throw new Error('bad option: invalid retry backoff method');
      }
    } else {
      options.backoff = 'constant';
    }
    this._doc.retries = options.retries;
    this._doc.repeatRetries = options.retries;
    this._doc.retryWait = options.wait;
    if ((base = this._doc).retried == null) {
      base.retried = 0;
    }
    this._doc.retryBackoff = options.backoff;
    this._doc.retryUntil = options.until;
    return this;
  };

  Job.prototype.repeat = function(options) {
    var base, ref;
    if (options == null) {
      options = 0;
    }
    if (isInteger(options) && options >= 0) {
      options = {
        repeats: options
      };
    }
    if (typeof options !== 'object') {
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');
    }
    if ((options.wait != null) && (options.schedule != null)) {
      throw new Error('bad options: wait and schedule options are mutually exclusive');
    }
    if (options.repeats != null) {
      if (!(isInteger(options.repeats) && options.repeats >= 0)) {
        throw new Error('bad option: repeats must be an integer >= 0');
      }
    } else {
      options.repeats = Job.forever;
    }
    if (options.until != null) {
      if (!(options.until instanceof Date)) {
        throw new Error('bad option: until must be a Date object');
      }
    } else {
      options.until = Job.foreverDate;
    }
    if (options.wait != null) {
      if (!(isInteger(options.wait) && options.wait >= 0)) {
        throw new Error('bad option: wait must be an integer >= 0');
      }
    } else {
      options.wait = 5 * 60 * 1000;
    }
    if (options.schedule != null) {
      if (typeof options.schedule !== 'object') {
        throw new Error('bad option, schedule option must be an object');
      }
      if (!((((ref = options.schedule) != null ? ref.schedules : void 0) != null) && options.schedule.schedules instanceof Array)) {
        throw new Error('bad option, schedule object requires a schedules attribute of type Array.');
      }
      if ((options.schedule.exceptions != null) && !(options.schedule.exceptions instanceof Array)) {
        throw new Error('bad option, schedule object exceptions attribute must be an Array');
      }
      options.wait = {
        schedules: options.schedule.schedules,
        exceptions: options.schedule.exceptions
      };
    }
    this._doc.repeats = options.repeats;
    this._doc.repeatWait = options.wait;
    if ((base = this._doc).repeated == null) {
      base.repeated = 0;
    }
    this._doc.repeatUntil = options.until;
    return this;
  };

  Job.prototype.delay = function(wait) {
    if (wait == null) {
      wait = 0;
    }
    if (!(isInteger(wait) && wait >= 0)) {
      throw new Error('Bad parameter, delay requires a non-negative integer.');
    }
    return this.after(new Date(new Date().valueOf() + wait));
  };

  Job.prototype.after = function(time) {
    var after;
    if (time == null) {
      time = new Date(0);
    }
    if (typeof time === 'object' && time instanceof Date) {
      after = time;
    } else {
      throw new Error('Bad parameter, after requires a valid Date object');
    }
    this._doc.after = after;
    return this;
  };

  Job.prototype.log = function() {
    var base, cb, k, message, options, ref, ref1;
    message = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.level == null) {
      options.level = 'info';
    }
    if (typeof message !== 'string') {
      throw new Error('Log message must be a string');
    }
    if (!(typeof options.level === 'string' && (ref1 = options.level, indexOf.call(Job.jobLogLevels, ref1) >= 0))) {
      throw new Error('Log level options must be one of Job.jobLogLevels');
    }
    if (options.echo != null) {
      if (options.echo && Job.jobLogLevels.indexOf(options.level) >= Job.jobLogLevels.indexOf(options.echo)) {
        this._echo("LOG: " + options.level + ", " + this._doc._id + " " + this._doc.runId + ": " + message, options.level);
      }
      delete options.echo;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "jobLog", [this._doc._id, this._doc.runId, message, options], cb);
    } else {
      if ((base = this._doc).log == null) {
        base.log = [];
      }
      this._doc.log.push({
        time: new Date(),
        runId: null,
        level: options.level,
        message: message
      });
      if ((cb != null) && typeof cb === 'function') {
        _setImmediate(cb, null, true);
      }
      return this;
    }
  };

  Job.prototype.progress = function() {
    var cb, completed, k, options, progress, ref, total;
    completed = arguments[0], total = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    if (completed == null) {
      completed = 0;
    }
    if (total == null) {
      total = 1;
    }
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (typeof completed === 'number' && typeof total === 'number' && completed >= 0 && total > 0 && total >= completed) {
      progress = {
        completed: completed,
        total: total,
        percent: 100 * completed / total
      };
      if (options.echo) {
        delete options.echo;
        this._echo("PROGRESS: " + this._doc._id + " " + this._doc.runId + ": " + progress.completed + " out of " + progress.total + " (" + progress.percent + "%)");
      }
      if ((this._doc._id != null) && (this._doc.runId != null)) {
        return methodCall(this._root, "jobProgress", [this._doc._id, this._doc.runId, completed, total, options], cb, (function(_this) {
          return function(res) {
            if (res) {
              _this._doc.progress = progress;
            }
            return res;
          };
        })(this));
      } else if (this._doc._id == null) {
        this._doc.progress = progress;
        if ((cb != null) && typeof cb === 'function') {
          _setImmediate(cb, null, true);
        }
        return this;
      }
    } else {
      throw new Error("job.progress: something is wrong with progress params: " + this.id + ", " + completed + " out of " + total);
    }
    return null;
  };

  Job.prototype.save = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    return methodCall(this._root, "jobSave", [this._doc, options], cb, (function(_this) {
      return function(id) {
        if (id) {
          _this._doc._id = id;
        }
        return id;
      };
    })(this));
  };

  Job.prototype.refresh = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.getLog == null) {
      options.getLog = false;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "getJob", [this._doc._id, options], cb, (function(_this) {
        return function(doc) {
          if (doc != null) {
            _this._doc = doc;
            return _this;
          } else {
            return false;
          }
        };
      })(this));
    } else {
      throw new Error("Can't call .refresh() on an unsaved job");
    }
  };

  Job.prototype.done = function() {
    var cb, k, options, ref, result;
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    if (result == null) {
      result = {};
    }
    if (typeof result === 'function') {
      cb = result;
      result = {};
    }
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (!((result != null) && typeof result === 'object')) {
      result = {
        value: result
      };
    }
    if ((this._doc._id != null) && (this._doc.runId != null)) {
      return methodCall(this._root, "jobDone", [this._doc._id, this._doc.runId, result, options], cb);
    } else {
      throw new Error("Can't call .done() on an unsaved or non-running job");
    }
    return null;
  };

  Job.prototype.fail = function() {
    var cb, k, options, ref, result;
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    if (result == null) {
      result = "No error information provided";
    }
    if (typeof result === 'function') {
      cb = result;
      result = "No error information provided";
    }
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (!((result != null) && typeof result === 'object')) {
      result = {
        value: result
      };
    }
    if (options.fatal == null) {
      options.fatal = false;
    }
    if ((this._doc._id != null) && (this._doc.runId != null)) {
      return methodCall(this._root, "jobFail", [this._doc._id, this._doc.runId, result, options], cb);
    } else {
      throw new Error("Can't call .fail() on an unsaved or non-running job");
    }
    return null;
  };

  Job.prototype.pause = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (this._doc._id != null) {
      return methodCall(this._root, "jobPause", [this._doc._id, options], cb);
    } else {
      this._doc.status = 'paused';
      if ((cb != null) && typeof cb === 'function') {
        _setImmediate(cb, null, true);
      }
      return this;
    }
    return null;
  };

  Job.prototype.resume = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (this._doc._id != null) {
      return methodCall(this._root, "jobResume", [this._doc._id, options], cb);
    } else {
      this._doc.status = 'waiting';
      if ((cb != null) && typeof cb === 'function') {
        _setImmediate(cb, null, true);
      }
      return this;
    }
    return null;
  };

  Job.prototype.ready = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.force == null) {
      options.force = false;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "jobReady", [this._doc._id, options], cb);
    } else {
      throw new Error("Can't call .ready() on an unsaved job");
    }
    return null;
  };

  Job.prototype.cancel = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.antecedents == null) {
      options.antecedents = true;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "jobCancel", [this._doc._id, options], cb);
    } else {
      throw new Error("Can't call .cancel() on an unsaved job");
    }
    return null;
  };

  Job.prototype.restart = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.retries == null) {
      options.retries = 1;
    }
    if (options.dependents == null) {
      options.dependents = true;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "jobRestart", [this._doc._id, options], cb);
    } else {
      throw new Error("Can't call .restart() on an unsaved job");
    }
    return null;
  };

  Job.prototype.rerun = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (options.repeats == null) {
      options.repeats = 0;
    }
    if (options.wait == null) {
      options.wait = this._doc.repeatWait;
    }
    if (this._doc._id != null) {
      return methodCall(this._root, "jobRerun", [this._doc._id, options], cb);
    } else {
      throw new Error("Can't call .rerun() on an unsaved job");
    }
    return null;
  };

  Job.prototype.remove = function() {
    var cb, k, options, ref;
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];
    if (this._doc._id != null) {
      return methodCall(this._root, "jobRemove", [this._doc._id, options], cb);
    } else {
      throw new Error("Can't call .remove() on an unsaved job");
    }
    return null;
  };

  Object.defineProperties(Job.prototype, {
    doc: {
      get: function() {
        return this._doc;
      },
      set: function() {
        return console.warn("Job.doc cannot be directly assigned.");
      }
    },
    type: {
      get: function() {
        return this._doc.type;
      },
      set: function() {
        return console.warn("Job.type cannot be directly assigned.");
      }
    },
    data: {
      get: function() {
        return this._doc.data;
      },
      set: function() {
        return console.warn("Job.data cannot be directly assigned.");
      }
    }
  });

  return Job;

})();

if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = Job;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/src/shared.coffee.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var JobCollectionBase, _validId, _validIntGTEOne, _validIntGTEZero, _validJobDoc, _validLaterJSObj, _validLog, _validLogLevel, _validNumGTEOne, _validNumGTEZero, _validNumGTZero, _validProgress, _validRetryBackoff, _validStatus,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

_validNumGTEZero = function(v) {
  return Match.test(v, Number) && v >= 0.0;
};

_validNumGTZero = function(v) {
  return Match.test(v, Number) && v > 0.0;
};

_validNumGTEOne = function(v) {
  return Match.test(v, Number) && v >= 1.0;
};

_validIntGTEZero = function(v) {
  return _validNumGTEZero(v) && Math.floor(v) === v;
};

_validIntGTEOne = function(v) {
  return _validNumGTEOne(v) && Math.floor(v) === v;
};

_validStatus = function(v) {
  return Match.test(v, String) && indexOf.call(Job.jobStatuses, v) >= 0;
};

_validLogLevel = function(v) {
  return Match.test(v, String) && indexOf.call(Job.jobLogLevels, v) >= 0;
};

_validRetryBackoff = function(v) {
  return Match.test(v, String) && indexOf.call(Job.jobRetryBackoffMethods, v) >= 0;
};

_validId = function(v) {
  return Match.test(v, Match.OneOf(String, Mongo.Collection.ObjectID));
};

_validLog = function() {
  return [
    {
      time: Date,
      runId: Match.OneOf(Match.Where(_validId), null),
      level: Match.Where(_validLogLevel),
      message: String,
      data: Match.Optional(Object)
    }
  ];
};

_validProgress = function() {
  return {
    completed: Match.Where(_validNumGTEZero),
    total: Match.Where(_validNumGTEZero),
    percent: Match.Where(_validNumGTEZero)
  };
};

_validLaterJSObj = function() {
  return {
    schedules: [Object],
    exceptions: Match.Optional([Object])
  };
};

_validJobDoc = function() {
  return {
    _id: Match.Optional(Match.OneOf(Match.Where(_validId), null)),
    runId: Match.OneOf(Match.Where(_validId), null),
    type: String,
    status: Match.Where(_validStatus),
    data: Object,
    result: Match.Optional(Object),
    failures: Match.Optional([Object]),
    priority: Match.Integer,
    depends: [Match.Where(_validId)],
    resolved: [Match.Where(_validId)],
    after: Date,
    updated: Date,
    workTimeout: Match.Optional(Match.Where(_validIntGTEOne)),
    expiresAfter: Match.Optional(Date),
    log: Match.Optional(_validLog()),
    progress: _validProgress(),
    retries: Match.Where(_validIntGTEZero),
    retried: Match.Where(_validIntGTEZero),
    repeatRetries: Match.Optional(Match.Where(_validIntGTEZero)),
    retryUntil: Date,
    retryWait: Match.Where(_validIntGTEZero),
    retryBackoff: Match.Where(_validRetryBackoff),
    repeats: Match.Where(_validIntGTEZero),
    repeated: Match.Where(_validIntGTEZero),
    repeatUntil: Date,
    repeatWait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj)),
    created: Date
  };
};

JobCollectionBase = (function(superClass) {
  extend(JobCollectionBase, superClass);

  function JobCollectionBase(root, options) {
    var collectionName;
    this.root = root != null ? root : 'queue';
    if (options == null) {
      options = {};
    }
    if (!(this instanceof JobCollectionBase)) {
      return new JobCollectionBase(this.root, options);
    }
    if (!(this instanceof Mongo.Collection)) {
      throw new Error('The global definition of Mongo.Collection has changed since the job-collection package was loaded. Please ensure that any packages that redefine Mongo.Collection are loaded before job-collection.');
    }
    if (Mongo.Collection !== Mongo.Collection.prototype.constructor) {
      throw new Meteor.Error('The global definition of Mongo.Collection has been patched by another package, and the prototype constructor has been left in an inconsistent state. Please see this link for a workaround: https://github.com/vsivsi/meteor-file-sample-app/issues/2#issuecomment-120780592');
    }
    this.later = later;
    if (options.noCollectionSuffix == null) {
      options.noCollectionSuffix = false;
    }
    collectionName = this.root;
    if (!options.noCollectionSuffix) {
      collectionName += '.jobs';
    }
    delete options.noCollectionSuffix;
    Job.setDDP(options.connection, this.root);
    this._createLogEntry = function(message, runId, level, time, data) {
      var l;
      if (message == null) {
        message = '';
      }
      if (runId == null) {
        runId = null;
      }
      if (level == null) {
        level = 'info';
      }
      if (time == null) {
        time = new Date();
      }
      if (data == null) {
        data = null;
      }
      l = {
        time: time,
        runId: runId,
        message: message,
        level: level
      };
      return l;
    };
    this._logMessage = {
      'readied': (function() {
        return this._createLogEntry("Promoted to ready");
      }).bind(this),
      'forced': (function(id) {
        return this._createLogEntry("Dependencies force resolved", null, 'warning');
      }).bind(this),
      'rerun': (function(id, runId) {
        return this._createLogEntry("Rerunning job", null, 'info', new Date(), {
          previousJob: {
            id: id,
            runId: runId
          }
        });
      }).bind(this),
      'running': (function(runId) {
        return this._createLogEntry("Job Running", runId);
      }).bind(this),
      'paused': (function() {
        return this._createLogEntry("Job Paused");
      }).bind(this),
      'resumed': (function() {
        return this._createLogEntry("Job Resumed");
      }).bind(this),
      'cancelled': (function() {
        return this._createLogEntry("Job Cancelled", null, 'warning');
      }).bind(this),
      'restarted': (function() {
        return this._createLogEntry("Job Restarted");
      }).bind(this),
      'resubmitted': (function() {
        return this._createLogEntry("Job Resubmitted");
      }).bind(this),
      'submitted': (function() {
        return this._createLogEntry("Job Submitted");
      }).bind(this),
      'completed': (function(runId) {
        return this._createLogEntry("Job Completed", runId, 'success');
      }).bind(this),
      'resolved': (function(id, runId) {
        return this._createLogEntry("Dependency resolved", null, 'info', new Date(), {
          dependency: {
            id: id,
            runId: runId
          }
        });
      }).bind(this),
      'failed': (function(runId, fatal, err) {
        var level, msg, value;
        value = err.value;
        msg = "Job Failed with" + (fatal ? ' Fatal' : '') + " Error" + ((value != null) && typeof value === 'string' ? ': ' + value : '') + ".";
        level = fatal ? 'danger' : 'warning';
        return this._createLogEntry(msg, runId, level);
      }).bind(this)
    };
    JobCollectionBase.__super__.constructor.call(this, collectionName, options);
  }

  JobCollectionBase.prototype._validNumGTEZero = _validNumGTEZero;

  JobCollectionBase.prototype._validNumGTZero = _validNumGTZero;

  JobCollectionBase.prototype._validNumGTEOne = _validNumGTEOne;

  JobCollectionBase.prototype._validIntGTEZero = _validIntGTEZero;

  JobCollectionBase.prototype._validIntGTEOne = _validIntGTEOne;

  JobCollectionBase.prototype._validStatus = _validStatus;

  JobCollectionBase.prototype._validLogLevel = _validLogLevel;

  JobCollectionBase.prototype._validRetryBackoff = _validRetryBackoff;

  JobCollectionBase.prototype._validId = _validId;

  JobCollectionBase.prototype._validLog = _validLog;

  JobCollectionBase.prototype._validProgress = _validProgress;

  JobCollectionBase.prototype._validJobDoc = _validJobDoc;

  JobCollectionBase.prototype.jobLogLevels = Job.jobLogLevels;

  JobCollectionBase.prototype.jobPriorities = Job.jobPriorities;

  JobCollectionBase.prototype.jobStatuses = Job.jobStatuses;

  JobCollectionBase.prototype.jobStatusCancellable = Job.jobStatusCancellable;

  JobCollectionBase.prototype.jobStatusPausable = Job.jobStatusPausable;

  JobCollectionBase.prototype.jobStatusRemovable = Job.jobStatusRemovable;

  JobCollectionBase.prototype.jobStatusRestartable = Job.jobStatusRestartable;

  JobCollectionBase.prototype.forever = Job.forever;

  JobCollectionBase.prototype.foreverDate = Job.foreverDate;

  JobCollectionBase.prototype.ddpMethods = Job.ddpMethods;

  JobCollectionBase.prototype.ddpPermissionLevels = Job.ddpPermissionLevels;

  JobCollectionBase.prototype.ddpMethodPermissions = Job.ddpMethodPermissions;

  JobCollectionBase.prototype.processJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Job.processJobs, [this.root].concat(slice.call(params)), function(){});
  };

  JobCollectionBase.prototype.getJob = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.getJob.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.getWork = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.getWork.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.getJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.getJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.readyJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.readyJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.cancelJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.cancelJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.pauseJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.pauseJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.resumeJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.resumeJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.restartJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.restartJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.removeJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.removeJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.setDDP = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.setDDP.apply(Job, params);
  };

  JobCollectionBase.prototype.startJobServer = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.startJobServer.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.shutdownJobServer = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.shutdownJobServer.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.startJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.startJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.stopJobs = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Job.stopJobs.apply(Job, [this.root].concat(slice.call(params)));
  };

  JobCollectionBase.prototype.jobDocPattern = _validJobDoc();

  JobCollectionBase.prototype.allow = function() {
    throw new Error("Server-only function jc.allow() invoked on client.");
  };

  JobCollectionBase.prototype.deny = function() {
    throw new Error("Server-only function jc.deny() invoked on client.");
  };

  JobCollectionBase.prototype.promote = function() {
    throw new Error("Server-only function jc.promote() invoked on client.");
  };

  JobCollectionBase.prototype.setLogStream = function() {
    throw new Error("Server-only function jc.setLogStream() invoked on client.");
  };

  JobCollectionBase.prototype.logConsole = function() {
    throw new Error("Client-only function jc.logConsole() invoked on server.");
  };

  JobCollectionBase.prototype.makeJob = (function() {
    var dep;
    dep = false;
    return function() {
      var params;
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!dep) {
        dep = true;
        console.warn("WARNING: jc.makeJob() has been deprecated. Use new Job(jc, doc) instead.");
      }
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Job, [this.root].concat(slice.call(params)), function(){});
    };
  })();

  JobCollectionBase.prototype.createJob = (function() {
    var dep;
    dep = false;
    return function() {
      var params;
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!dep) {
        dep = true;
        console.warn("WARNING: jc.createJob() has been deprecated. Use new Job(jc, type, data) instead.");
      }
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Job, [this.root].concat(slice.call(params)), function(){});
    };
  })();

  JobCollectionBase.prototype._methodWrapper = function(method, func) {
    var ref, toLog, unblockDDPMethods;
    toLog = this._toLog;
    unblockDDPMethods = (ref = this._unblockDDPMethods) != null ? ref : false;
    return function() {
      var params, ref1, retval, user;
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      user = (ref1 = this.userId) != null ? ref1 : "[UNAUTHENTICATED]";
      toLog(user, method, "params: " + JSON.stringify(params));
      if (unblockDDPMethods) {
        this.unblock();
      }
      retval = func.apply(null, params);
      toLog(user, method, "returned: " + JSON.stringify(retval));
      return retval;
    };
  };

  JobCollectionBase.prototype._generateMethods = function() {
    var baseMethodName, methodFunc, methodName, methodPrefix, methodsOut;
    methodsOut = {};
    methodPrefix = '_DDPMethod_';
    for (methodName in this) {
      methodFunc = this[methodName];
      if (!(methodName.slice(0, methodPrefix.length) === methodPrefix)) {
        continue;
      }
      baseMethodName = methodName.slice(methodPrefix.length);
      methodsOut[this.root + "_" + baseMethodName] = this._methodWrapper(baseMethodName, methodFunc.bind(this));
    }
    return methodsOut;
  };

  JobCollectionBase.prototype._idsOfDeps = function(ids, antecedents, dependents, jobStatuses) {
    var antsArray, dependsIds, dependsQuery;
    dependsQuery = [];
    if (dependents) {
      dependsQuery.push({
        depends: {
          $elemMatch: {
            $in: ids
          }
        }
      });
    }
    if (antecedents) {
      antsArray = [];
      this.find({
        _id: {
          $in: ids
        }
      }, {
        fields: {
          depends: 1
        },
        transform: null
      }).forEach(function(d) {
        var i, j, len, ref, results;
        if (indexOf.call(antsArray, i) < 0) {
          ref = d.depends;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(antsArray.push(i));
          }
          return results;
        }
      });
      if (antsArray.length > 0) {
        dependsQuery.push({
          _id: {
            $in: antsArray
          }
        });
      }
    }
    if (dependsQuery) {
      dependsIds = [];
      this.find({
        status: {
          $in: jobStatuses
        },
        $or: dependsQuery
      }, {
        fields: {
          _id: 1
        },
        transform: null
      }).forEach(function(d) {
        var ref;
        if (ref = d._id, indexOf.call(dependsIds, ref) < 0) {
          return dependsIds.push(d._id);
        }
      });
    }
    return dependsIds;
  };

  JobCollectionBase.prototype._rerun_job = function(doc, repeats, wait, repeatUntil) {
    var id, jobId, logObj, runId, time;
    if (repeats == null) {
      repeats = doc.repeats - 1;
    }
    if (wait == null) {
      wait = doc.repeatWait;
    }
    if (repeatUntil == null) {
      repeatUntil = doc.repeatUntil;
    }
    id = doc._id;
    runId = doc.runId;
    time = new Date();
    delete doc._id;
    delete doc.result;
    delete doc.failures;
    delete doc.expiresAfter;
    delete doc.workTimeout;
    doc.runId = null;
    doc.status = "waiting";
    doc.repeatRetries = doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried;
    doc.retries = doc.repeatRetries;
    if (doc.retries > this.forever) {
      doc.retries = this.forever;
    }
    doc.retryUntil = repeatUntil;
    doc.retried = 0;
    doc.repeats = repeats;
    if (doc.repeats > this.forever) {
      doc.repeats = this.forever;
    }
    doc.repeatUntil = repeatUntil;
    doc.repeated = doc.repeated + 1;
    doc.updated = time;
    doc.created = time;
    doc.progress = {
      completed: 0,
      total: 1,
      percent: 0
    };
    if (logObj = this._logMessage.rerun(id, runId)) {
      doc.log = [logObj];
    } else {
      doc.log = [];
    }
    doc.after = new Date(time.valueOf() + wait);
    if (jobId = this.insert(doc)) {
      this._DDPMethod_jobReady(jobId);
      return jobId;
    } else {
      console.warn("Job rerun/repeat failed to reschedule!", id, runId);
    }
    return null;
  };

  JobCollectionBase.prototype._DDPMethod_startJobServer = function(options) {
    check(options, Match.Optional({}));
    if (options == null) {
      options = {};
    }
    if (!this.isSimulation) {
      if (this.stopped && this.stopped !== true) {
        Meteor.clearTimeout(this.stopped);
      }
      this.stopped = false;
    }
    return true;
  };

  JobCollectionBase.prototype._DDPMethod_startJobs = (function() {
    var depFlag;
    depFlag = false;
    return function(options) {
      if (!depFlag) {
        depFlag = true;
        console.warn("Deprecation Warning: jc.startJobs() has been renamed to jc.startJobServer()");
      }
      return this._DDPMethod_startJobServer(options);
    };
  })();

  JobCollectionBase.prototype._DDPMethod_shutdownJobServer = function(options) {
    check(options, Match.Optional({
      timeout: Match.Optional(Match.Where(_validIntGTEOne))
    }));
    if (options == null) {
      options = {};
    }
    if (options.timeout == null) {
      options.timeout = 60 * 1000;
    }
    if (!this.isSimulation) {
      if (this.stopped && this.stopped !== true) {
        Meteor.clearTimeout(this.stopped);
      }
      this.stopped = Meteor.setTimeout((function(_this) {
        return function() {
          var cursor, failedJobs;
          cursor = _this.find({
            status: 'running'
          }, {
            transform: null
          });
          failedJobs = cursor.count();
          if (failedJobs !== 0) {
            console.warn("Failing " + failedJobs + " jobs on queue stop.");
          }
          cursor.forEach(function(d) {
            return _this._DDPMethod_jobFail(d._id, d.runId, "Running at Job Server shutdown.");
          });
          if (_this.logStream != null) {
            _this.logStream.end();
            return _this.logStream = null;
          }
        };
      })(this), options.timeout);
    }
    return true;
  };

  JobCollectionBase.prototype._DDPMethod_stopJobs = (function() {
    var depFlag;
    depFlag = false;
    return function(options) {
      if (!depFlag) {
        depFlag = true;
        console.warn("Deprecation Warning: jc.stopJobs() has been renamed to jc.shutdownJobServer()");
      }
      return this._DDPMethod_shutdownJobServer(options);
    };
  })();

  JobCollectionBase.prototype._DDPMethod_getJob = function(ids, options) {
    var d, docs, fields, single;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({
      getLog: Match.Optional(Boolean),
      getFailures: Match.Optional(Boolean)
    }));
    if (options == null) {
      options = {};
    }
    if (options.getLog == null) {
      options.getLog = false;
    }
    if (options.getFailures == null) {
      options.getFailures = false;
    }
    single = false;
    if (_validId(ids)) {
      ids = [ids];
      single = true;
    }
    if (ids.length === 0) {
      return null;
    }
    fields = {
      _private: 0
    };
    if (!options.getLog) {
      fields.log = 0;
    }
    if (!options.getFailures) {
      fields.failures = 0;
    }
    docs = this.find({
      _id: {
        $in: ids
      }
    }, {
      fields: fields,
      transform: null
    }).fetch();
    if (docs != null ? docs.length : void 0) {
      if (this.scrub != null) {
        docs = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = docs.length; j < len; j++) {
            d = docs[j];
            results.push(this.scrub(d));
          }
          return results;
        }).call(this);
      }
      check(docs, [_validJobDoc()]);
      if (single) {
        return docs[0];
      } else {
        return docs;
      }
    }
    return null;
  };

  JobCollectionBase.prototype._DDPMethod_getWork = function(type, options) {
    var d, docs, foundDocs, ids, logObj, mods, num, runId, time;
    check(type, Match.OneOf(String, [String]));
    check(options, Match.Optional({
      maxJobs: Match.Optional(Match.Where(_validIntGTEOne)),
      workTimeout: Match.Optional(Match.Where(_validIntGTEOne))
    }));
    if (this.isSimulation) {
      return;
    }
    if (options == null) {
      options = {};
    }
    if (options.maxJobs == null) {
      options.maxJobs = 1;
    }
    if (this.stopped) {
      return [];
    }
    if (typeof type === 'string') {
      type = [type];
    }
    time = new Date();
    docs = [];
    runId = this._makeNewID();
    while (docs.length < options.maxJobs) {
      ids = this.find({
        type: {
          $in: type
        },
        status: 'ready',
        runId: null
      }, {
        sort: {
          priority: 1,
          retryUntil: 1,
          after: 1
        },
        limit: options.maxJobs - docs.length,
        fields: {
          _id: 1
        },
        transform: null
      }).map(function(d) {
        return d._id;
      });
      if (!((ids != null ? ids.length : void 0) > 0)) {
        break;
      }
      mods = {
        $set: {
          status: 'running',
          runId: runId,
          updated: time
        },
        $inc: {
          retries: -1,
          retried: 1
        }
      };
      if (logObj = this._logMessage.running(runId)) {
        mods.$push = {
          log: logObj
        };
      }
      if (options.workTimeout != null) {
        mods.$set.workTimeout = options.workTimeout;
        mods.$set.expiresAfter = new Date(time.valueOf() + options.workTimeout);
      } else {
        if (mods.$unset == null) {
          mods.$unset = {};
        }
        mods.$unset.workTimeout = "";
        mods.$unset.expiresAfter = "";
      }
      num = this.update({
        _id: {
          $in: ids
        },
        status: 'ready',
        runId: null
      }, mods, {
        multi: true
      });
      if (num > 0) {
        foundDocs = this.find({
          _id: {
            $in: ids
          },
          runId: runId
        }, {
          fields: {
            log: 0,
            failures: 0,
            _private: 0
          },
          transform: null
        }).fetch();
        if ((foundDocs != null ? foundDocs.length : void 0) > 0) {
          if (this.scrub != null) {
            foundDocs = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = foundDocs.length; j < len; j++) {
                d = foundDocs[j];
                results.push(this.scrub(d));
              }
              return results;
            }).call(this);
          }
          check(docs, [_validJobDoc()]);
          docs = docs.concat(foundDocs);
        }
      }
    }
    return docs;
  };

  JobCollectionBase.prototype._DDPMethod_jobRemove = function(ids, options) {
    var num;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({}));
    if (options == null) {
      options = {};
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) {
      return false;
    }
    num = this.remove({
      _id: {
        $in: ids
      },
      status: {
        $in: this.jobStatusRemovable
      }
    });
    if (num > 0) {
      return true;
    } else {
      console.warn("jobRemove failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobPause = function(ids, options) {
    var logObj, mods, num, time;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({}));
    if (options == null) {
      options = {};
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) {
      return false;
    }
    time = new Date();
    mods = {
      $set: {
        status: "paused",
        updated: time
      }
    };
    if (logObj = this._logMessage.paused()) {
      mods.$push = {
        log: logObj
      };
    }
    num = this.update({
      _id: {
        $in: ids
      },
      status: {
        $in: this.jobStatusPausable
      }
    }, mods, {
      multi: true
    });
    if (num > 0) {
      return true;
    } else {
      console.warn("jobPause failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobResume = function(ids, options) {
    var logObj, mods, num, time;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({}));
    if (options == null) {
      options = {};
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) {
      return false;
    }
    time = new Date();
    mods = {
      $set: {
        status: "waiting",
        updated: time
      }
    };
    if (logObj = this._logMessage.resumed()) {
      mods.$push = {
        log: logObj
      };
    }
    num = this.update({
      _id: {
        $in: ids
      },
      status: "paused",
      updated: {
        $ne: time
      }
    }, mods, {
      multi: true
    });
    if (num > 0) {
      this._DDPMethod_jobReady(ids);
      return true;
    } else {
      console.warn("jobResume failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobReady = function(ids, options) {
    var l, logObj, mods, now, num, query;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({
      force: Match.Optional(Boolean),
      time: Match.Optional(Date)
    }));
    if (this.isSimulation) {
      return;
    }
    now = new Date();
    if (options == null) {
      options = {};
    }
    if (options.force == null) {
      options.force = false;
    }
    if (options.time == null) {
      options.time = now;
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    query = {
      status: "waiting",
      after: {
        $lte: options.time
      }
    };
    mods = {
      $set: {
        status: "ready",
        updated: now
      }
    };
    if (ids.length > 0) {
      query._id = {
        $in: ids
      };
      mods.$set.after = now;
    }
    logObj = [];
    if (options.force) {
      mods.$set.depends = [];
      l = this._logMessage.forced();
      if (l) {
        logObj.push(l);
      }
    } else {
      query.depends = {
        $size: 0
      };
    }
    l = this._logMessage.readied();
    if (l) {
      logObj.push(l);
    }
    if (logObj.length > 0) {
      mods.$push = {
        log: {
          $each: logObj
        }
      };
    }
    num = this.update(query, mods, {
      multi: true
    });
    if (num > 0) {
      return true;
    } else {
      return false;
    }
  };

  JobCollectionBase.prototype._DDPMethod_jobCancel = function(ids, options) {
    var cancelIds, depsCancelled, logObj, mods, num, time;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({
      antecedents: Match.Optional(Boolean),
      dependents: Match.Optional(Boolean)
    }));
    if (options == null) {
      options = {};
    }
    if (options.antecedents == null) {
      options.antecedents = false;
    }
    if (options.dependents == null) {
      options.dependents = true;
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) {
      return false;
    }
    time = new Date();
    mods = {
      $set: {
        status: "cancelled",
        runId: null,
        progress: {
          completed: 0,
          total: 1,
          percent: 0
        },
        updated: time
      }
    };
    if (logObj = this._logMessage.cancelled()) {
      mods.$push = {
        log: logObj
      };
    }
    num = this.update({
      _id: {
        $in: ids
      },
      status: {
        $in: this.jobStatusCancellable
      }
    }, mods, {
      multi: true
    });
    cancelIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusCancellable);
    depsCancelled = false;
    if (cancelIds.length > 0) {
      depsCancelled = this._DDPMethod_jobCancel(cancelIds, options);
    }
    if (num > 0 || depsCancelled) {
      return true;
    } else {
      console.warn("jobCancel failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobRestart = function(ids, options) {
    var depsRestarted, logObj, mods, num, query, restartIds, time;
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));
    check(options, Match.Optional({
      retries: Match.Optional(Match.Where(_validIntGTEZero)),
      until: Match.Optional(Date),
      antecedents: Match.Optional(Boolean),
      dependents: Match.Optional(Boolean)
    }));
    if (options == null) {
      options = {};
    }
    if (options.retries == null) {
      options.retries = 1;
    }
    if (options.retries > this.forever) {
      options.retries = this.forever;
    }
    if (options.dependents == null) {
      options.dependents = false;
    }
    if (options.antecedents == null) {
      options.antecedents = true;
    }
    if (_validId(ids)) {
      ids = [ids];
    }
    if (ids.length === 0) {
      return false;
    }
    time = new Date();
    query = {
      _id: {
        $in: ids
      },
      status: {
        $in: this.jobStatusRestartable
      }
    };
    mods = {
      $set: {
        status: "waiting",
        progress: {
          completed: 0,
          total: 1,
          percent: 0
        },
        updated: time
      },
      $inc: {
        retries: options.retries
      }
    };
    if (logObj = this._logMessage.restarted()) {
      mods.$push = {
        log: logObj
      };
    }
    if (options.until != null) {
      mods.$set.retryUntil = options.until;
    }
    num = this.update(query, mods, {
      multi: true
    });
    restartIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusRestartable);
    depsRestarted = false;
    if (restartIds.length > 0) {
      depsRestarted = this._DDPMethod_jobRestart(restartIds, options);
    }
    if (num > 0 || depsRestarted) {
      this._DDPMethod_jobReady(ids);
      return true;
    } else {
      console.warn("jobRestart failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobSave = function(doc, options) {
    var logObj, mods, newId, next, nextDate, num, ref, time;
    check(doc, _validJobDoc());
    check(options, Match.Optional({
      cancelRepeats: Match.Optional(Boolean)
    }));
    check(doc.status, Match.Where(function(v) {
      return Match.test(v, String) && (v === 'waiting' || v === 'paused');
    }));
    if (options == null) {
      options = {};
    }
    if (options.cancelRepeats == null) {
      options.cancelRepeats = false;
    }
    if (doc.repeats > this.forever) {
      doc.repeats = this.forever;
    }
    if (doc.retries > this.forever) {
      doc.retries = this.forever;
    }
    time = new Date();
    if (doc.after < time) {
      doc.after = time;
    }
    if (doc.retryUntil < time) {
      doc.retryUntil = time;
    }
    if (doc.repeatUntil < time) {
      doc.repeatUntil = time;
    }
    if ((this.later != null) && typeof doc.repeatWait !== 'number') {
      if (!(next = (ref = this.later) != null ? ref.schedule(doc.repeatWait).next(1, doc.after) : void 0)) {
        console.warn("No valid available later.js times in schedule after " + doc.after);
        return null;
      }
      nextDate = new Date(next);
      if (!(nextDate <= doc.repeatUntil)) {
        console.warn("No valid available later.js times in schedule before " + doc.repeatUntil);
        return null;
      }
      doc.after = nextDate;
    } else if ((this.later == null) && doc.repeatWait !== 'number') {
      console.warn("Later.js not loaded...");
      return null;
    }
    if (doc._id) {
      mods = {
        $set: {
          status: 'waiting',
          data: doc.data,
          retries: doc.retries,
          repeatRetries: doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried,
          retryUntil: doc.retryUntil,
          retryWait: doc.retryWait,
          retryBackoff: doc.retryBackoff,
          repeats: doc.repeats,
          repeatUntil: doc.repeatUntil,
          repeatWait: doc.repeatWait,
          depends: doc.depends,
          priority: doc.priority,
          after: doc.after,
          updated: time
        }
      };
      if (logObj = this._logMessage.resubmitted()) {
        mods.$push = {
          log: logObj
        };
      }
      num = this.update({
        _id: doc._id,
        status: 'paused',
        runId: null
      }, mods);
      if (num) {
        this._DDPMethod_jobReady(doc._id);
        return doc._id;
      } else {
        return null;
      }
    } else {
      if (doc.repeats === this.forever && options.cancelRepeats) {
        this.find({
          type: doc.type,
          status: {
            $in: this.jobStatusCancellable
          }
        }, {
          transform: null
        }).forEach((function(_this) {
          return function(d) {
            return _this._DDPMethod_jobCancel(d._id, {});
          };
        })(this));
      }
      doc.created = time;
      doc.log.push(this._logMessage.submitted());
      newId = this.insert(doc);
      this._DDPMethod_jobReady(newId);
      return newId;
    }
  };

  JobCollectionBase.prototype._DDPMethod_jobProgress = function(id, runId, completed, total, options) {
    var job, mods, num, progress, time;
    check(id, Match.Where(_validId));
    check(runId, Match.Where(_validId));
    check(completed, Match.Where(_validNumGTEZero));
    check(total, Match.Where(_validNumGTZero));
    check(options, Match.Optional({}));
    if (options == null) {
      options = {};
    }
    if (this.stopped) {
      return null;
    }
    progress = {
      completed: completed,
      total: total,
      percent: 100 * completed / total
    };
    check(progress, Match.Where(function(v) {
      var ref;
      return v.total >= v.completed && (0 <= (ref = v.percent) && ref <= 100);
    }));
    time = new Date();
    job = this.findOne({
      _id: id
    }, {
      fields: {
        workTimeout: 1
      }
    });
    mods = {
      $set: {
        progress: progress,
        updated: time
      }
    };
    if ((job != null ? job.workTimeout : void 0) != null) {
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);
    }
    num = this.update({
      _id: id,
      runId: runId,
      status: "running"
    }, mods);
    if (num === 1) {
      return true;
    } else {
      console.warn("jobProgress failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobLog = function(id, runId, message, options) {
    var job, logObj, mods, num, ref, time;
    check(id, Match.Where(_validId));
    check(runId, Match.OneOf(Match.Where(_validId), null));
    check(message, String);
    check(options, Match.Optional({
      level: Match.Optional(Match.Where(_validLogLevel)),
      data: Match.Optional(Object)
    }));
    if (options == null) {
      options = {};
    }
    time = new Date();
    logObj = {
      time: time,
      runId: runId,
      level: (ref = options.level) != null ? ref : 'info',
      message: message
    };
    if (options.data != null) {
      logObj.data = options.data;
    }
    job = this.findOne({
      _id: id
    }, {
      fields: {
        status: 1,
        workTimeout: 1
      }
    });
    mods = {
      $push: {
        log: logObj
      },
      $set: {
        updated: time
      }
    };
    if (((job != null ? job.workTimeout : void 0) != null) && job.status === 'running') {
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);
    }
    num = this.update({
      _id: id
    }, mods);
    if (num === 1) {
      return true;
    } else {
      console.warn("jobLog failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobRerun = function(id, options) {
    var doc;
    check(id, Match.Where(_validId));
    check(options, Match.Optional({
      repeats: Match.Optional(Match.Where(_validIntGTEZero)),
      until: Match.Optional(Date),
      wait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj))
    }));
    doc = this.findOne({
      _id: id,
      status: "completed"
    }, {
      fields: {
        result: 0,
        failures: 0,
        log: 0,
        progress: 0,
        updated: 0,
        after: 0,
        status: 0
      },
      transform: null
    });
    if (doc != null) {
      if (options == null) {
        options = {};
      }
      if (options.repeats == null) {
        options.repeats = 0;
      }
      if (options.repeats > this.forever) {
        options.repeats = this.forever;
      }
      if (options.until == null) {
        options.until = doc.repeatUntil;
      }
      if (options.wait == null) {
        options.wait = 0;
      }
      return this._rerun_job(doc, options.repeats, options.wait, options.until);
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobDone = function(id, runId, result, options) {
    var after, d, doc, ids, jobId, logObj, mods, n, next, num, ref, time, wait;
    check(id, Match.Where(_validId));
    check(runId, Match.Where(_validId));
    check(result, Object);
    check(options, Match.Optional({
      repeatId: Match.Optional(Boolean),
      delayDeps: Match.Optional(Match.Where(_validIntGTEZero))
    }));
    if (options == null) {
      options = {
        repeatId: false
      };
    }
    time = new Date();
    doc = this.findOne({
      _id: id,
      runId: runId,
      status: "running"
    }, {
      fields: {
        log: 0,
        failures: 0,
        progress: 0,
        updated: 0,
        after: 0,
        status: 0
      },
      transform: null
    });
    if (doc == null) {
      if (!this.isSimulation) {
        console.warn("Running job not found", id, runId);
      }
      return false;
    }
    mods = {
      $set: {
        status: "completed",
        result: result,
        progress: {
          completed: 1,
          total: 1,
          percent: 100
        },
        updated: time
      }
    };
    if (logObj = this._logMessage.completed(runId)) {
      mods.$push = {
        log: logObj
      };
    }
    num = this.update({
      _id: id,
      runId: runId,
      status: "running"
    }, mods);
    if (num === 1) {
      if (doc.repeats > 0) {
        if (typeof doc.repeatWait === 'number') {
          if (doc.repeatUntil - doc.repeatWait >= time) {
            jobId = this._rerun_job(doc);
          }
        } else {
          next = (ref = this.later) != null ? ref.schedule(doc.repeatWait).next(2) : void 0;
          if (next && next.length > 0) {
            d = new Date(next[0]);
            if ((d - time > 500) || (next.length > 1)) {
              if (d - time <= 500) {
                d = new Date(next[1]);
              } else {

              }
              wait = d - time;
              if (doc.repeatUntil - wait >= time) {
                jobId = this._rerun_job(doc, doc.repeats - 1, wait);
              }
            }
          }
        }
      }
      ids = this.find({
        depends: {
          $all: [id]
        }
      }, {
        transform: null,
        fields: {
          _id: 1
        }
      }).fetch().map((function(_this) {
        return function(d) {
          return d._id;
        };
      })(this));
      if (ids.length > 0) {
        mods = {
          $pull: {
            depends: id
          },
          $push: {
            resolved: id
          }
        };
        if (options.delayDeps != null) {
          after = new Date(time.valueOf() + options.delayDeps);
          mods.$max = {
            after: after
          };
        }
        if (logObj = this._logMessage.resolved(id, runId)) {
          mods.$push.log = logObj;
        }
        n = this.update({
          _id: {
            $in: ids
          }
        }, mods, {
          multi: true
        });
        if (n !== ids.length) {
          console.warn("Not all dependent jobs were resolved " + ids.length + " > " + n);
        }
        this._DDPMethod_jobReady(ids);
      }
      if (options.repeatId && (jobId != null)) {
        return jobId;
      } else {
        return true;
      }
    } else {
      console.warn("jobDone failed");
    }
    return false;
  };

  JobCollectionBase.prototype._DDPMethod_jobFail = function(id, runId, err, options) {
    var after, doc, logObj, mods, newStatus, num, time;
    check(id, Match.Where(_validId));
    check(runId, Match.Where(_validId));
    check(err, Object);
    check(options, Match.Optional({
      fatal: Match.Optional(Boolean)
    }));
    if (options == null) {
      options = {};
    }
    if (options.fatal == null) {
      options.fatal = false;
    }
    time = new Date();
    doc = this.findOne({
      _id: id,
      runId: runId,
      status: "running"
    }, {
      fields: {
        log: 0,
        failures: 0,
        progress: 0,
        updated: 0,
        after: 0,
        runId: 0,
        status: 0
      },
      transform: null
    });
    if (doc == null) {
      if (!this.isSimulation) {
        console.warn("Running job not found", id, runId);
      }
      return false;
    }
    after = (function() {
      switch (doc.retryBackoff) {
        case 'exponential':
          return new Date(time.valueOf() + doc.retryWait * Math.pow(2, doc.retried - 1));
        default:
          return new Date(time.valueOf() + doc.retryWait);
      }
    })();
    newStatus = !options.fatal && doc.retries > 0 && doc.retryUntil >= after ? "waiting" : "failed";
    err.runId = runId;
    mods = {
      $set: {
        status: newStatus,
        runId: null,
        after: after,
        progress: {
          completed: 0,
          total: 1,
          percent: 0
        },
        updated: time
      },
      $push: {
        failures: err
      }
    };
    if (logObj = this._logMessage.failed(runId, newStatus === 'failed', err)) {
      mods.$push.log = logObj;
    }
    num = this.update({
      _id: id,
      runId: runId,
      status: "running"
    }, mods);
    if (newStatus === "failed" && num === 1) {
      this.find({
        depends: {
          $all: [id]
        }
      }, {
        transform: null
      }).forEach((function(_this) {
        return function(d) {
          return _this._DDPMethod_jobCancel(d._id);
        };
      })(this));
    }
    if (num === 1) {
      return true;
    } else {
      console.warn("jobFail failed");
    }
    return false;
  };

  return JobCollectionBase;

})(Mongo.Collection);

share.JobCollectionBase = JobCollectionBase;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/vsivsi_job-collection/src/server.coffee.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var eventEmitter, userHelper,               
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

if (Meteor.isServer) {
  eventEmitter = Npm.require('events').EventEmitter;
  userHelper = function(user, connection) {
    var ret;
    ret = user != null ? user : "[UNAUTHENTICATED]";
    if (!connection) {
      ret = "[SERVER]";
    }
    return ret;
  };
  JobCollection = (function(superClass) {
    extend(JobCollection, superClass);

    function JobCollection(root, options) {
      var foo, i, len, level, localMethods, methodFunction, methodName, ref;
      if (root == null) {
        root = 'queue';
      }
      if (options == null) {
        options = {};
      }
      this._emit = bind(this._emit, this);
      this._toLog = bind(this._toLog, this);
      this._onCall = bind(this._onCall, this);
      this._onError = bind(this._onError, this);
      if (!(this instanceof JobCollection)) {
        return new JobCollection(root, options);
      }
      JobCollection.__super__.constructor.call(this, root, options);
      this.events = new eventEmitter();
      this._errorListener = this.events.on('error', this._onError);
      this._methodErrorDispatch = this.events.on('error', (function(_this) {
        return function(msg) {
          return _this.events.emit(msg.method, msg);
        };
      })(this));
      this._callListener = this.events.on('call', this._onCall);
      this._methodEventDispatch = this.events.on('call', (function(_this) {
        return function(msg) {
          return _this.events.emit(msg.method, msg);
        };
      })(this));
      this.stopped = true;
      share.JobCollectionBase.__super__.deny.bind(this)({
        update: (function(_this) {
          return function() {
            return true;
          };
        })(this),
        insert: (function(_this) {
          return function() {
            return true;
          };
        })(this),
        remove: (function(_this) {
          return function() {
            return true;
          };
        })(this)
      });
      this.promote();
      this.logStream = null;
      this.allows = {};
      this.denys = {};
      ref = this.ddpPermissionLevels.concat(this.ddpMethods);
      for (i = 0, len = ref.length; i < len; i++) {
        level = ref[i];
        this.allows[level] = [];
        this.denys[level] = [];
      }
      if (options.connection == null) {
        this._ensureIndex({
          type: 1,
          status: 1
        });
        this._ensureIndex({
          priority: 1,
          retryUntil: 1,
          after: 1
        });
        this.isSimulation = false;
        localMethods = this._generateMethods();
        if (this._localServerMethods == null) {
          this._localServerMethods = {};
        }
        for (methodName in localMethods) {
          methodFunction = localMethods[methodName];
          this._localServerMethods[methodName] = methodFunction;
        }
        foo = this;
        this._ddp_apply = (function(_this) {
          return function(name, params, cb) {
            if (cb != null) {
              return Meteor.setTimeout((function() {
                var e, err, res;
                err = null;
                res = null;
                try {
                  res = _this._localServerMethods[name].apply(_this, params);
                } catch (_error) {
                  e = _error;
                  err = e;
                }
                return cb(err, res);
              }), 0);
            } else {
              return _this._localServerMethods[name].apply(_this, params);
            }
          };
        })(this);
        Job._setDDPApply(this._ddp_apply, root);
        Meteor.methods(localMethods);
      }
    }

    JobCollection.prototype._onError = function(msg) {
      var user;
      user = userHelper(msg.userId, msg.connection);
      return this._toLog(user, msg.method, "" + msg.error);
    };

    JobCollection.prototype._onCall = function(msg) {
      var user;
      user = userHelper(msg.userId, msg.connection);
      this._toLog(user, msg.method, "params: " + JSON.stringify(msg.params));
      return this._toLog(user, msg.method, "returned: " + JSON.stringify(msg.returnVal));
    };

    JobCollection.prototype._toLog = function(userId, method, message) {
      var ref;
      return (ref = this.logStream) != null ? ref.write((new Date()) + ", " + userId + ", " + method + ", " + message + "\n") : void 0;
    };

    JobCollection.prototype._emit = function() {
      var connection, err, method, params, ret, userId;
      method = arguments[0], connection = arguments[1], userId = arguments[2], err = arguments[3], ret = arguments[4], params = 6 <= arguments.length ? slice.call(arguments, 5) : [];
      if (err) {
        return this.events.emit('error', {
          error: err,
          method: method,
          connection: connection,
          userId: userId,
          params: params,
          returnVal: null
        });
      } else {
        return this.events.emit('call', {
          error: null,
          method: method,
          connection: connection,
          userId: userId,
          params: params,
          returnVal: ret
        });
      }
    };

    JobCollection.prototype._methodWrapper = function(method, func) {
      var myTypeof, permitted, self;
      self = this;
      myTypeof = function(val) {
        var type;
        type = typeof val;
        if (type === 'object' && type instanceof Array) {
          type = 'array';
        }
        return type;
      };
      permitted = (function(_this) {
        return function(userId, params) {
          var performAllTests, performTest;
          performTest = function(tests) {
            var i, len, result, test;
            result = false;
            for (i = 0, len = tests.length; i < len; i++) {
              test = tests[i];
              if (result === false) {
                result = result || (function() {
                  switch (myTypeof(test)) {
                    case 'array':
                      return indexOf.call(test, userId) >= 0;
                    case 'function':
                      return test(userId, method, params);
                    default:
                      return false;
                  }
                })();
              }
            }
            return result;
          };
          performAllTests = function(allTests) {
            var i, len, ref, result, t;
            result = false;
            ref = _this.ddpMethodPermissions[method];
            for (i = 0, len = ref.length; i < len; i++) {
              t = ref[i];
              if (result === false) {
                result = result || performTest(allTests[t]);
              }
            }
            return result;
          };
          return !performAllTests(_this.denys) && performAllTests(_this.allows);
        };
      })(this);
      return function() {
        var err, params, retval;
        params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        try {
          if (!(this.connection && !permitted(this.userId, params))) {
            retval = func.apply(null, params);
          } else {
            err = new Meteor.Error(403, "Method not authorized", "Authenticated user is not permitted to invoke this method.");
            throw err;
          }
        } catch (_error) {
          err = _error;
          self._emit(method, this.connection, this.userId, err);
          throw err;
        }
        self._emit.apply(self, [method, this.connection, this.userId, null, retval].concat(slice.call(params)));
        return retval;
      };
    };

    JobCollection.prototype.setLogStream = function(writeStream) {
      if (writeStream == null) {
        writeStream = null;
      }
      if (this.logStream) {
        throw new Error("logStream may only be set once per job-collection startup/shutdown cycle");
      }
      this.logStream = writeStream;
      if (!((this.logStream == null) || (this.logStream.write != null) && typeof this.logStream.write === 'function' && (this.logStream.end != null) && typeof this.logStream.end === 'function')) {
        throw new Error("logStream must be a valid writable node.js Stream");
      }
    };

    JobCollection.prototype.allow = function(allowOptions) {
      var func, results, type;
      results = [];
      for (type in allowOptions) {
        func = allowOptions[type];
        if (type in this.allows) {
          results.push(this.allows[type].push(func));
        }
      }
      return results;
    };

    JobCollection.prototype.deny = function(denyOptions) {
      var func, results, type;
      results = [];
      for (type in denyOptions) {
        func = denyOptions[type];
        if (type in this.denys) {
          results.push(this.denys[type].push(func));
        }
      }
      return results;
    };

    JobCollection.prototype.scrub = function(job) {
      return job;
    };

    JobCollection.prototype.promote = function(milliseconds) {
      if (milliseconds == null) {
        milliseconds = 15 * 1000;
      }
      if (typeof milliseconds === 'number' && milliseconds > 0) {
        if (this.interval) {
          Meteor.clearInterval(this.interval);
        }
        this._promote_jobs();
        return this.interval = Meteor.setInterval(this._promote_jobs.bind(this), milliseconds);
      } else {
        return console.warn("jobCollection.promote: invalid timeout: " + this.root + ", " + milliseconds);
      }
    };

    JobCollection.prototype._promote_jobs = function(ids) {
      if (ids == null) {
        ids = [];
      }
      if (this.stopped) {
        return;
      }
      this.find({
        status: 'running',
        expiresAfter: {
          $lt: new Date()
        }
      }).forEach((function(_this) {
        return function(job) {
          return new Job(_this.root, job).fail("Failed for exceeding worker set workTimeout");
        };
      })(this));
      return this.readyJobs();
    };

    return JobCollection;

  })(share.JobCollectionBase);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("vsivsi:job-collection", {
  Job: Job,
  JobCollection: JobCollection
});

})();

//# sourceURL=meteor://💻app/packages/vsivsi_job-collection.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdnNpdnNpX2pvYi1jb2xsZWN0aW9uL2pvYi9zcmMvam9iX2NsYXNzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdnNpdnNpX2pvYi1jb2xsZWN0aW9uL3NyYy9zaGFyZWQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy92c2l2c2lfam9iLWNvbGxlY3Rpb24vc3JjL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUE7RUFBQTtxSkFBQTs7QUFBQSxhQUFhLFNBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxNQUFmLEVBQXVCLEVBQXZCLEVBQTJCLEtBQTNCO0FBQ1g7O0lBRHNDLFFBQVEsQ0FBQyxTQUFDLEdBQUQ7YUFBUyxJQUFUO0lBQUEsQ0FBRDtHQUM5QztBQUFBLDRIQUE0QyxHQUFHLENBQUMsVUFBaEQ7QUFDQSxNQUFPLGlCQUFnQixVQUF2QjtBQUNHLFVBQVUsVUFBTSxpRUFBTixDQUFWLENBREg7R0FEQTtBQUFBLEVBR0EsT0FBUyxxQ0FBYSxJQUFiLElBQWtCLEdBQWxCLEdBQXFCLE1BSDlCO0FBSUEsTUFBRyxNQUFPLGNBQWEsVUFBdkI7V0FDRSxNQUFNLElBQU4sRUFBWSxNQUFaLEVBQW9CO2FBQUEsU0FBQyxHQUFELEVBQU0sR0FBTjtBQUNsQixZQUFpQixHQUFqQjtBQUFBLGlCQUFPLEdBQUcsR0FBSCxDQUFQO1NBQUE7ZUFDQSxHQUFHLElBQUgsRUFBUyxNQUFNLEdBQU4sQ0FBVCxFQUZrQjtNQUFBO0lBQUEsUUFBcEIsRUFERjtHQUFBO0FBS0UsV0FBTyxNQUFNLE1BQU0sSUFBTixFQUFZLE1BQVosQ0FBTixDQUFQLENBTEY7R0FMVztBQUFBLENBQWI7O0FBQUEsV0FZQSxHQUFjLFNBQUMsT0FBRCxFQUFVLEVBQVY7QUFFWjtBQUFBLE1BQUcsZ0JBQVEsY0FBZSxVQUExQjtBQUNFLGNBQVUs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QUFDLEtBQUwsRUFBVyxHQUFYLENBQWUsQ0FBQyxJQUFoQixDQUFxQiw2Q0FBckIsRUFERztRQUFBO01BQUEsUUFEWCxDQUhBO2FBUUEsSUFBQyxVQUFELEdBVGE7SUFBQSxDQXZLZjs7eUJBQUE7O0tBRjBCLEtBQUssQ0FBQyxrQkFYbEMsQ0FGRjtDQUFBIiwiZmlsZSI6Ii9wYWNrYWdlcy92c2l2c2lfam9iLWNvbGxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jICAgICBDb3B5cmlnaHQgKEMpIDIwMTQtMjAxNiBieSBWYXVnaG4gSXZlcnNvblxuIyAgICAgbWV0ZW9yLWpvYi1jbGFzcyBpcyBmcmVlIHNvZnR3YXJlIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQvWDExIGxpY2Vuc2UuXG4jICAgICBTZWUgaW5jbHVkZWQgTElDRU5TRSBmaWxlIGZvciBkZXRhaWxzLlxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIEV4cG9ydHMgSm9iIG9iamVjdFxuXG5tZXRob2RDYWxsID0gKHJvb3QsIG1ldGhvZCwgcGFyYW1zLCBjYiwgYWZ0ZXIgPSAoKHJldCkgLT4gcmV0KSkgLT5cbiAgYXBwbHkgPSBKb2IuX2RkcF9hcHBseT9bcm9vdC5yb290ID8gcm9vdF0gPyBKb2IuX2RkcF9hcHBseVxuICB1bmxlc3MgdHlwZW9mIGFwcGx5IGlzICdmdW5jdGlvbidcbiAgICAgdGhyb3cgbmV3IEVycm9yIFwiSm9iIHJlbW90ZSBtZXRob2QgY2FsbCBlcnJvciwgbm8gdmFsaWQgaW52b2NhdGlvbiBtZXRob2QgZm91bmQuXCJcbiAgbmFtZSA9IFwiI3tyb290LnJvb3QgPyByb290fV8je21ldGhvZH1cIlxuICBpZiBjYiBhbmQgdHlwZW9mIGNiIGlzICdmdW5jdGlvbidcbiAgICBhcHBseSBuYW1lLCBwYXJhbXMsIChlcnIsIHJlcykgPT5cbiAgICAgIHJldHVybiBjYiBlcnIgaWYgZXJyXG4gICAgICBjYiBudWxsLCBhZnRlcihyZXMpXG4gIGVsc2VcbiAgICByZXR1cm4gYWZ0ZXIoYXBwbHkgbmFtZSwgcGFyYW1zKVxuXG5vcHRpb25zSGVscCA9IChvcHRpb25zLCBjYikgLT5cbiAgIyBJZiBjYiBpc24ndCBhIGZ1bmN0aW9uLCBpdCdzIGFzc3VtZWQgdG8gYmUgb3B0aW9ucy4uLlxuICBpZiBjYj8gYW5kIHR5cGVvZiBjYiBpc250ICdmdW5jdGlvbidcbiAgICBvcHRpb25zID0gY2JcbiAgICBjYiA9IHVuZGVmaW5lZFxuICBlbHNlXG4gICAgdW5sZXNzICh0eXBlb2Ygb3B0aW9ucyBpcyAnb2JqZWN0JyBhbmRcbiAgICAgICAgICAgIG9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSBhbmRcbiAgICAgICAgICAgIG9wdGlvbnMubGVuZ3RoIDwgMilcbiAgICAgIHRocm93IG5ldyBFcnJvciAnb3B0aW9ucy4uLiBpbiBvcHRpb25zSGVscCBtdXN0IGJlIGFuIEFycmF5IHdpdGggemVybyBvciBvbmUgZWxlbWVudHMnXG4gICAgb3B0aW9ucyA9IG9wdGlvbnM/WzBdID8ge31cbiAgdW5sZXNzIHR5cGVvZiBvcHRpb25zIGlzICdvYmplY3QnXG4gICAgdGhyb3cgbmV3IEVycm9yICdpbiBvcHRpb25zSGVscCBvcHRpb25zIG5vdCBhbiBvYmplY3Qgb3IgYmFkIGNhbGxiYWNrJ1xuICByZXR1cm4gW29wdGlvbnMsIGNiXVxuXG5zcGxpdExvbmdBcnJheSA9IChhcnIsIG1heCkgLT5cbiAgdGhyb3cgbmV3IEVycm9yICdzcGxpdExvbmdBcnJheTogYmFkIHBhcmFtcycgdW5sZXNzIGFyciBpbnN0YW5jZW9mIEFycmF5IGFuZCBtYXggPiAwXG4gIGFyclsoaSptYXgpLi4uKChpKzEpKm1heCldIGZvciBpIGluIFswLi4uTWF0aC5jZWlsKGFyci5sZW5ndGgvbWF4KV1cblxuIyBUaGlzIGZ1bmN0aW9uIHNvYWtzIHVwIG51bSBjYWxsYmFja3MsIGJ5IGRlZmF1bHQgcmV0dXJuaW5nIHRoZSBkaXNqdW5jdGlvbiBvZiBCb29sZWFuIHJlc3VsdHNcbiMgb3IgcmV0dXJuaW5nIG9uIGZpcnN0IGVycm9yLi4uLiBSZWR1Y2UgZnVuY3Rpb24gY2F1c2VzIGRpZmZlcmVudCByZWR1Y2UgYmVoYXZpb3IsIHN1Y2ggYXMgY29uY2F0ZW5hdGlvblxucmVkdWNlQ2FsbGJhY2tzID0gKGNiLCBudW0sIHJlZHVjZSA9ICgoYSAsIGIpIC0+IChhIG9yIGIpKSwgaW5pdCA9IGZhbHNlKSAtPlxuICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBjYj9cbiAgdW5sZXNzIHR5cGVvZiBjYiBpcyAnZnVuY3Rpb24nIGFuZCBudW0gPiAwIGFuZCB0eXBlb2YgcmVkdWNlIGlzICdmdW5jdGlvbidcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ0JhZCBwYXJhbXMgZ2l2ZW4gdG8gcmVkdWNlQ2FsbGJhY2tzJ1xuICBjYlJldFZhbCA9IGluaXRcbiAgY2JDb3VudCA9IDBcbiAgY2JFcnIgPSBudWxsXG4gIHJldHVybiAoZXJyLCByZXMpIC0+XG4gICAgdW5sZXNzIGNiRXJyXG4gICAgICBpZiBlcnJcbiAgICAgICAgY2JFcnIgPSBlcnJcbiAgICAgICAgY2IgZXJyXG4gICAgICBlbHNlXG4gICAgICAgIGNiQ291bnQrK1xuICAgICAgICBjYlJldFZhbCA9IHJlZHVjZSBjYlJldFZhbCwgcmVzXG4gICAgICAgIGlmIGNiQ291bnQgaXMgbnVtXG4gICAgICAgICAgY2IgbnVsbCwgY2JSZXRWYWxcbiAgICAgICAgZWxzZSBpZiBjYkNvdW50ID4gbnVtXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwicmVkdWNlQ2FsbGJhY2tzIGNhbGxiYWNrIGludm9rZWQgbW9yZSB0aGFuIHJlcXVlc3RlZCAje251bX0gdGltZXNcIlxuXG5jb25jYXRSZWR1Y2UgPSAoYSwgYikgLT5cbiAgYSA9IFthXSB1bmxlc3MgYSBpbnN0YW5jZW9mIEFycmF5XG4gIGEuY29uY2F0IGJcblxuaXNJbnRlZ2VyID0gKGkpIC0+IHR5cGVvZiBpIGlzICdudW1iZXInIGFuZCBNYXRoLmZsb29yKGkpIGlzIGlcblxuaXNCb29sZWFuID0gKGIpIC0+IHR5cGVvZiBiIGlzICdib29sZWFuJ1xuXG4jIFRoaXMgc21vb3RocyBvdmVyIHRoZSB2YXJpb3VzIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnMuLi5cbl9zZXRJbW1lZGlhdGUgPSAoZnVuYywgYXJncy4uLikgLT5cbiAgaWYgTWV0ZW9yPy5zZXRUaW1lb3V0P1xuICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dCBmdW5jLCAwLCBhcmdzLi4uXG4gIGVsc2UgaWYgc2V0SW1tZWRpYXRlP1xuICAgIHJldHVybiBzZXRJbW1lZGlhdGUgZnVuYywgYXJncy4uLlxuICBlbHNlXG4gICAgIyBCcm93c2VyIGZhbGxiYWNrXG4gICAgcmV0dXJuIHNldFRpbWVvdXQgZnVuYywgMCwgYXJncy4uLlxuXG5fc2V0SW50ZXJ2YWwgPSAoZnVuYywgdGltZU91dCwgYXJncy4uLikgLT5cbiAgaWYgTWV0ZW9yPy5zZXRJbnRlcnZhbD9cbiAgICByZXR1cm4gTWV0ZW9yLnNldEludGVydmFsIGZ1bmMsIHRpbWVPdXQsIGFyZ3MuLi5cbiAgZWxzZVxuICAgICMgQnJvd3NlciAvIG5vZGUuanMgZmFsbGJhY2tcbiAgICByZXR1cm4gc2V0SW50ZXJ2YWwgZnVuYywgdGltZU91dCwgYXJncy4uLlxuXG5fY2xlYXJJbnRlcnZhbCA9IChpZCkgLT5cbiAgaWYgTWV0ZW9yPy5jbGVhckludGVydmFsP1xuICAgIHJldHVybiBNZXRlb3IuY2xlYXJJbnRlcnZhbCBpZFxuICBlbHNlXG4gICAgIyBCcm93c2VyIC8gbm9kZS5qcyBmYWxsYmFja1xuICAgIHJldHVybiBjbGVhckludGVydmFsIGlkXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuY2xhc3MgSm9iUXVldWVcblxuICBjb25zdHJ1Y3RvcjogKEByb290LCBAdHlwZSwgb3B0aW9ucy4uLiwgQHdvcmtlcikgLT5cbiAgICB1bmxlc3MgQCBpbnN0YW5jZW9mIEpvYlF1ZXVlXG4gICAgICByZXR1cm4gbmV3IEpvYlF1ZXVlIEByb290LCBAdHlwZSwgb3B0aW9ucy4uLiwgQHdvcmtlclxuICAgIFtvcHRpb25zLCBAd29ya2VyXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIEB3b3JrZXJcblxuICAgIEBwb2xsSW50ZXJ2YWwgPVxuICAgICAgaWYgb3B0aW9ucy5wb2xsSW50ZXJ2YWw/IGFuZCBub3Qgb3B0aW9ucy5wb2xsSW50ZXJ2YWxcbiAgICAgICAgSm9iLmZvcmV2ZXJcbiAgICAgIGVsc2UgaWYgbm90IChvcHRpb25zLnBvbGxJbnRlcnZhbD8gYW5kIGlzSW50ZWdlcihvcHRpb25zLnBvbGxJbnRlcnZhbCkpXG4gICAgICAgIDUwMDAgICMgbXNcbiAgICAgIGVsc2VcbiAgICAgICAgb3B0aW9ucy5wb2xsSW50ZXJ2YWxcbiAgICB1bmxlc3MgaXNJbnRlZ2VyKEBwb2xsSW50ZXJ2YWwpIGFuZCBAcG9sbEludGVydmFsID49IDBcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIkpvYlF1ZXVlOiBJbnZhbGlkIHBvbGxJbnRlcnZhbCwgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXJcIlxuXG4gICAgQGNvbmN1cnJlbmN5ID0gb3B0aW9ucy5jb25jdXJyZW5jeSA/IDFcbiAgICB1bmxlc3MgaXNJbnRlZ2VyKEBjb25jdXJyZW5jeSkgYW5kIEBjb25jdXJyZW5jeSA+PSAwXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJKb2JRdWV1ZTogSW52YWxpZCBjb25jdXJyZW5jeSwgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXJcIlxuXG4gICAgQHBheWxvYWQgPSBvcHRpb25zLnBheWxvYWQgPyAxXG4gICAgdW5sZXNzIGlzSW50ZWdlcihAcGF5bG9hZCkgYW5kIEBwYXlsb2FkID49IDBcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIkpvYlF1ZXVlOiBJbnZhbGlkIHBheWxvYWQsIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyXCJcblxuICAgIEBwcmVmZXRjaCA9IG9wdGlvbnMucHJlZmV0Y2ggPyAwXG4gICAgdW5sZXNzIGlzSW50ZWdlcihAcHJlZmV0Y2gpIGFuZCBAcHJlZmV0Y2ggPj0gMFxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiSm9iUXVldWU6IEludmFsaWQgcHJlZmV0Y2gsIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyXCJcblxuICAgIEB3b3JrVGltZW91dCA9IG9wdGlvbnMud29ya1RpbWVvdXQgICMgTm8gZGVmYXVsdFxuICAgIGlmIEB3b3JrVGltZW91dD8gYW5kIG5vdCAoaXNJbnRlZ2VyKEB3b3JrVGltZW91dCkgYW5kIEB3b3JrVGltZW91dCA+PSAwKVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiSm9iUXVldWU6IEludmFsaWQgd29ya1RpbWVvdXQsIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyXCJcblxuICAgIEBjYWxsYmFja1N0cmljdCA9IG9wdGlvbnMuY2FsbGJhY2tTdHJpY3RcbiAgICBpZiBAY2FsbGJhY2tTdHJpY3Q/IGFuZCBub3QgaXNCb29sZWFuKEBjYWxsYmFja1N0cmljdClcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIkpvYlF1ZXVlOiBJbnZhbGlkIGNhbGxiYWNrU3RyaWN0LCBtdXN0IGJlIGEgYm9vbGVhblwiXG5cbiAgICBAX3dvcmtlcnMgPSB7fVxuICAgIEBfdGFza3MgPSBbXVxuICAgIEBfdGFza051bWJlciA9IDBcbiAgICBAX3N0b3BwaW5nR2V0V29yayA9IHVuZGVmaW5lZFxuICAgIEBfc3RvcHBpbmdUYXNrcyA9IHVuZGVmaW5lZFxuICAgIEBfaW50ZXJ2YWwgPSBudWxsXG4gICAgQF9nZXRXb3JrT3V0c3RhbmRpbmcgPSBmYWxzZVxuICAgIEBwYXVzZWQgPSB0cnVlXG4gICAgQHJlc3VtZSgpXG5cbiAgX2dldFdvcms6ICgpIC0+XG4gICAgIyBEb24ndCByZWVudGVyLCBvciBydW4gd2hlbiBwYXVzZWQgb3Igc3RvcHBpbmdcbiAgICB1bmxlc3MgQF9nZXRXb3JrT3V0c3RhbmRpbmcgb3IgQHBhdXNlZFxuICAgICAgbnVtSm9ic1RvR2V0ID0gQHByZWZldGNoICsgQHBheWxvYWQqKEBjb25jdXJyZW5jeSAtIEBydW5uaW5nKCkpIC0gQGxlbmd0aCgpXG4gICAgICBpZiBudW1Kb2JzVG9HZXQgPiAwXG4gICAgICAgIEBfZ2V0V29ya091dHN0YW5kaW5nID0gdHJ1ZVxuICAgICAgICBvcHRpb25zID0geyBtYXhKb2JzOiBudW1Kb2JzVG9HZXQgfVxuICAgICAgICBvcHRpb25zLndvcmtUaW1lb3V0ID0gQHdvcmtUaW1lb3V0IGlmIEB3b3JrVGltZW91dD9cbiAgICAgICAgSm9iLmdldFdvcmsgQHJvb3QsIEB0eXBlLCBvcHRpb25zLCAoZXJyLCBqb2JzKSA9PlxuICAgICAgICAgIEBfZ2V0V29ya091dHN0YW5kaW5nID0gZmFsc2VcbiAgICAgICAgICBpZiBlcnJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJKb2JRdWV1ZTogUmVjZWl2ZWQgZXJyb3IgZnJvbSBnZXRXb3JrKCk6IFwiLCBlcnJcbiAgICAgICAgICBlbHNlIGlmIGpvYnM/IGFuZCBqb2JzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgIGlmIGpvYnMubGVuZ3RoID4gbnVtSm9ic1RvR2V0XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJKb2JRdWV1ZTogZ2V0V29yaygpIHJldHVybmVkIGpvYnMgKCN7am9icy5sZW5ndGh9KSBpbiBleGNlc3Mgb2YgbWF4Sm9icyAoI3tudW1Kb2JzVG9HZXR9KVwiXG4gICAgICAgICAgICBmb3IgaiBpbiBqb2JzXG4gICAgICAgICAgICAgIEBfdGFza3MucHVzaCBqXG4gICAgICAgICAgICAgIF9zZXRJbW1lZGlhdGUgQF9wcm9jZXNzLmJpbmQoQCkgdW5sZXNzIEBfc3RvcHBpbmdHZXRXb3JrP1xuICAgICAgICAgICAgQF9zdG9wcGluZ0dldFdvcmsoKSBpZiBAX3N0b3BwaW5nR2V0V29yaz9cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yIFwiSm9iUXVldWU6IE5vbmFycmF5IHJlc3BvbnNlIGZyb20gc2VydmVyIGZyb20gZ2V0V29yaygpXCJcblxuICBfb25seV9vbmNlOiAoZm4pIC0+XG4gICAgY2FsbGVkID0gZmFsc2VcbiAgICByZXR1cm4gKCkgPT5cbiAgICAgIGlmIGNhbGxlZFxuICAgICAgICBjb25zb2xlLmVycm9yIFwiV29ya2VyIGNhbGxiYWNrIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBpbiBKb2JRdWV1ZVwiXG4gICAgICAgIGlmIEBjYWxsYmFja1N0cmljdFxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkpvYlF1ZXVlIHdvcmtlciBjYWxsYmFjayB3YXMgaW52b2tlZCBtdWx0aXBsZSB0aW1lc1wiXG4gICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICBmbi5hcHBseSBALCBhcmd1bWVudHNcblxuICBfcHJvY2VzczogKCkgLT5cbiAgICBpZiBub3QgQHBhdXNlZCBhbmQgQHJ1bm5pbmcoKSA8IEBjb25jdXJyZW5jeSBhbmQgQGxlbmd0aCgpXG4gICAgICBpZiBAcGF5bG9hZCA+IDFcbiAgICAgICAgam9iID0gQF90YXNrcy5zcGxpY2UgMCwgQHBheWxvYWRcbiAgICAgIGVsc2VcbiAgICAgICAgam9iID0gQF90YXNrcy5zaGlmdCgpXG4gICAgICBqb2IuX3Rhc2tJZCA9IFwiVGFza18je0BfdGFza051bWJlcisrfVwiXG4gICAgICBAX3dvcmtlcnNbam9iLl90YXNrSWRdID0gam9iXG4gICAgICBuZXh0ID0gKCkgPT5cbiAgICAgICAgZGVsZXRlIEBfd29ya2Vyc1tqb2IuX3Rhc2tJZF1cbiAgICAgICAgaWYgQF9zdG9wcGluZ1Rhc2tzPyBhbmQgQHJ1bm5pbmcoKSBpcyAwIGFuZCBAbGVuZ3RoKCkgaXMgMFxuICAgICAgICAgIEBfc3RvcHBpbmdUYXNrcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfc2V0SW1tZWRpYXRlIEBfcHJvY2Vzcy5iaW5kKEApXG4gICAgICAgICAgX3NldEltbWVkaWF0ZSBAX2dldFdvcmsuYmluZChAKVxuICAgICAgY2IgPSBAX29ubHlfb25jZSBuZXh0XG4gICAgICBAd29ya2VyIGpvYiwgY2JcblxuICBfc3RvcEdldFdvcms6IChjYWxsYmFjaykgLT5cbiAgICBfY2xlYXJJbnRlcnZhbCBAX2ludGVydmFsXG4gICAgQF9pbnRlcnZhbCA9IG51bGxcbiAgICBpZiBAX2dldFdvcmtPdXRzdGFuZGluZ1xuICAgICAgQF9zdG9wcGluZ0dldFdvcmsgPSBjYWxsYmFja1xuICAgIGVsc2VcbiAgICAgIF9zZXRJbW1lZGlhdGUgY2FsbGJhY2sgICMgTm8gWmFsZ28sIHRoYW5rc1xuXG4gIF93YWl0Rm9yVGFza3M6IChjYWxsYmFjaykgLT5cbiAgICB1bmxlc3MgQHJ1bm5pbmcoKSBpcyAwXG4gICAgICBAX3N0b3BwaW5nVGFza3MgPSBjYWxsYmFja1xuICAgIGVsc2VcbiAgICAgIF9zZXRJbW1lZGlhdGUgY2FsbGJhY2sgICMgTm8gWmFsZ28sIHRoYW5rc1xuXG4gIF9mYWlsSm9iczogKHRhc2tzLCBjYWxsYmFjaykgLT5cbiAgICBfc2V0SW1tZWRpYXRlIGNhbGxiYWNrIGlmIHRhc2tzLmxlbmd0aCBpcyAwICAjIE5vIFphbGdvLCB0aGFua3NcbiAgICBjb3VudCA9IDBcbiAgICBmb3Igam9iIGluIHRhc2tzXG4gICAgICBqb2IuZmFpbCBcIldvcmtlciBzaHV0ZG93blwiLCAoZXJyLCByZXMpID0+XG4gICAgICAgIGNvdW50KytcbiAgICAgICAgaWYgY291bnQgaXMgdGFza3MubGVuZ3RoXG4gICAgICAgICAgY2FsbGJhY2soKVxuXG4gIF9oYXJkOiAoY2FsbGJhY2spIC0+XG4gICAgQHBhdXNlZCA9IHRydWVcbiAgICBAX3N0b3BHZXRXb3JrICgpID0+XG4gICAgICB0YXNrcyA9IEBfdGFza3NcbiAgICAgIEBfdGFza3MgPSBbXVxuICAgICAgZm9yIGksIHIgb2YgQF93b3JrZXJzXG4gICAgICAgIHRhc2tzID0gdGFza3MuY29uY2F0IHJcbiAgICAgIEBfZmFpbEpvYnMgdGFza3MsIGNhbGxiYWNrXG5cbiAgX3N0b3A6IChjYWxsYmFjaykgLT5cbiAgICBAcGF1c2VkID0gdHJ1ZVxuICAgIEBfc3RvcEdldFdvcmsgKCkgPT5cbiAgICAgIHRhc2tzID0gQF90YXNrc1xuICAgICAgQF90YXNrcyA9IFtdXG4gICAgICBAX3dhaXRGb3JUYXNrcyAoKSA9PlxuICAgICAgICBAX2ZhaWxKb2JzIHRhc2tzLCBjYWxsYmFja1xuXG4gIF9zb2Z0OiAoY2FsbGJhY2spIC0+XG4gICAgQF9zdG9wR2V0V29yayAoKSA9PlxuICAgICAgQF93YWl0Rm9yVGFza3MgY2FsbGJhY2tcblxuICBsZW5ndGg6ICgpIC0+IEBfdGFza3MubGVuZ3RoXG5cbiAgcnVubmluZzogKCkgLT4gT2JqZWN0LmtleXMoQF93b3JrZXJzKS5sZW5ndGhcblxuICBpZGxlOiAoKSAtPiBAbGVuZ3RoKCkgKyBAcnVubmluZygpIGlzIDBcblxuICBmdWxsOiAoKSAtPiBAcnVubmluZygpIGlzIEBjb25jdXJyZW5jeVxuXG4gIHBhdXNlOiAoKSAtPlxuICAgIHJldHVybiBpZiBAcGF1c2VkXG4gICAgdW5sZXNzIEBwb2xsSW50ZXJ2YWwgPj0gSm9iLmZvcmV2ZXJcbiAgICAgIF9jbGVhckludGVydmFsIEBfaW50ZXJ2YWxcbiAgICAgIEBfaW50ZXJ2YWwgPSBudWxsXG4gICAgQHBhdXNlZCA9IHRydWVcbiAgICBAXG5cbiAgcmVzdW1lOiAoKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQHBhdXNlZFxuICAgIEBwYXVzZWQgPSBmYWxzZVxuICAgIF9zZXRJbW1lZGlhdGUgQF9nZXRXb3JrLmJpbmQoQClcbiAgICB1bmxlc3MgQHBvbGxJbnRlcnZhbCA+PSBKb2IuZm9yZXZlclxuICAgICAgQF9pbnRlcnZhbCA9IF9zZXRJbnRlcnZhbCBAX2dldFdvcmsuYmluZChAKSwgQHBvbGxJbnRlcnZhbFxuICAgIGZvciB3IGluIFsxLi5AY29uY3VycmVuY3ldXG4gICAgICBfc2V0SW1tZWRpYXRlIEBfcHJvY2Vzcy5iaW5kKEApXG4gICAgQFxuXG4gIHRyaWdnZXI6ICgpIC0+XG4gICAgcmV0dXJuIGlmIEBwYXVzZWRcbiAgICBfc2V0SW1tZWRpYXRlIEBfZ2V0V29yay5iaW5kKEApXG4gICAgQFxuXG4gIHNodXRkb3duOiAob3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgb3B0aW9ucy5sZXZlbCA/PSAnbm9ybWFsJ1xuICAgIG9wdGlvbnMucXVpZXQgPz0gZmFsc2VcbiAgICB1bmxlc3MgY2I/XG4gICAgICBjb25zb2xlLndhcm4gXCJ1c2luZyBkZWZhdWx0IHNodXRkb3duIGNhbGxiYWNrIVwiIHVubGVzcyBvcHRpb25zLnF1aWV0XG4gICAgICBjYiA9ICgpID0+XG4gICAgICAgIGNvbnNvbGUud2FybiBcIlNodXRkb3duIGNvbXBsZXRlXCJcbiAgICBzd2l0Y2ggb3B0aW9ucy5sZXZlbFxuICAgICAgd2hlbiAnaGFyZCdcbiAgICAgICAgY29uc29sZS53YXJuIFwiU2h1dHRpbmcgZG93biBoYXJkXCIgdW5sZXNzIG9wdGlvbnMucXVpZXRcbiAgICAgICAgQF9oYXJkIGNiXG4gICAgICB3aGVuICdzb2Z0J1xuICAgICAgICBjb25zb2xlLndhcm4gXCJTaHV0dGluZyBkb3duIHNvZnRcIiB1bmxlc3Mgb3B0aW9ucy5xdWlldFxuICAgICAgICBAX3NvZnQgY2JcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiU2h1dHRpbmcgZG93biBub3JtYWxseVwiIHVubGVzcyBvcHRpb25zLnF1aWV0XG4gICAgICAgIEBfc3RvcCBjYlxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmNsYXNzIEpvYlxuXG4gICMgVGhpcyBpcyB0aGUgSlMgbWF4IGludCB2YWx1ZSA9IDJeNTNcbiAgQGZvcmV2ZXIgPSA5MDA3MTk5MjU0NzQwOTkyXG5cbiAgIyBUaGlzIGlzIHRoZSBtYXhpbXVtIGRhdGUgdmFsdWUgaW4gSlNcbiAgQGZvcmV2ZXJEYXRlID0gbmV3IERhdGUgODY0MDAwMDAwMDAwMDAwMFxuXG4gIEBqb2JQcmlvcml0aWVzOlxuICAgIGxvdzogMTBcbiAgICBub3JtYWw6IDBcbiAgICBtZWRpdW06IC01XG4gICAgaGlnaDogLTEwXG4gICAgY3JpdGljYWw6IC0xNVxuXG4gIEBqb2JSZXRyeUJhY2tvZmZNZXRob2RzOiBbICdjb25zdGFudCcsICdleHBvbmVudGlhbCcgXVxuXG4gIEBqb2JTdGF0dXNlczogWyAnd2FpdGluZycsICdwYXVzZWQnLCAncmVhZHknLCAncnVubmluZydcbiAgICAgICAgICAgICAgICAgICdmYWlsZWQnLCAnY2FuY2VsbGVkJywgJ2NvbXBsZXRlZCcgXVxuXG4gIEBqb2JMb2dMZXZlbHM6IFsgJ2luZm8nLCAnc3VjY2VzcycsICd3YXJuaW5nJywgJ2RhbmdlcicgXVxuXG4gIEBqb2JTdGF0dXNDYW5jZWxsYWJsZTogWyAncnVubmluZycsICdyZWFkeScsICd3YWl0aW5nJywgJ3BhdXNlZCcgXVxuICBAam9iU3RhdHVzUGF1c2FibGU6IFsgJ3JlYWR5JywgJ3dhaXRpbmcnIF1cbiAgQGpvYlN0YXR1c1JlbW92YWJsZTogICBbICdjYW5jZWxsZWQnLCAnY29tcGxldGVkJywgJ2ZhaWxlZCcgXVxuICBAam9iU3RhdHVzUmVzdGFydGFibGU6IFsgJ2NhbmNlbGxlZCcsICdmYWlsZWQnIF1cblxuICBAZGRwTWV0aG9kcyA9IFsgJ3N0YXJ0Sm9icycsICdzdG9wSm9icycsICAjIERlcHJlY2F0ZWQhXG4gICAgICAgICAgICAgICAgICAnc3RhcnRKb2JTZXJ2ZXInLCAnc2h1dGRvd25Kb2JTZXJ2ZXInLFxuICAgICAgICAgICAgICAgICAgJ2pvYlJlbW92ZScsICdqb2JQYXVzZScsICdqb2JSZXN1bWUnLCAnam9iUmVhZHknXG4gICAgICAgICAgICAgICAgICAnam9iQ2FuY2VsJywgJ2pvYlJlc3RhcnQnLCAnam9iU2F2ZScsICdqb2JSZXJ1bicsICdnZXRXb3JrJ1xuICAgICAgICAgICAgICAgICAgJ2dldEpvYicsICdqb2JMb2cnLCAnam9iUHJvZ3Jlc3MnLCAnam9iRG9uZScsICdqb2JGYWlsJyBdXG5cbiAgQGRkcFBlcm1pc3Npb25MZXZlbHMgPSBbICdhZG1pbicsICdtYW5hZ2VyJywgJ2NyZWF0b3InLCAnd29ya2VyJyBdXG5cbiAgIyBUaGVzZSBhcmUgdGhlIGZvdXIgbGV2ZWxzIG9mIHRoZSBhbGxvdy9kZW55IHBlcm1pc3Npb24gaGVpcmFyY2h5XG4gIEBkZHBNZXRob2RQZXJtaXNzaW9ucyA9XG4gICAgJ3N0YXJ0Sm9icyc6IFsnc3RhcnRKb2JzJywgJ2FkbWluJ10gICMgRGVwcmVjYXRlZCFcbiAgICAnc3RvcEpvYnMnOiBbJ3N0b3BKb2JzJywgJ2FkbWluJ10gICAgIyBEZXByZWNhdGVkIVxuICAgICdzdGFydEpvYlNlcnZlcic6IFsnc3RhcnRKb2JTZXJ2ZXInLCAnYWRtaW4nXVxuICAgICdzaHV0ZG93bkpvYlNlcnZlcic6IFsnc2h1dGRvd25Kb2JTZXJ2ZXInLCAnYWRtaW4nXVxuICAgICdqb2JSZW1vdmUnOiBbJ2pvYlJlbW92ZScsICdhZG1pbicsICdtYW5hZ2VyJ11cbiAgICAnam9iUGF1c2UnOiBbJ2pvYlBhdXNlJywgJ2FkbWluJywgJ21hbmFnZXInXVxuICAgICdqb2JSZXN1bWUnOiBbJ2pvYlJlc3VtZScsICdhZG1pbicsICdtYW5hZ2VyJ11cbiAgICAnam9iQ2FuY2VsJzogWydqb2JDYW5jZWwnLCAnYWRtaW4nLCAnbWFuYWdlciddXG4gICAgJ2pvYlJlYWR5JzogWydqb2JSZWFkeScsICdhZG1pbicsICdtYW5hZ2VyJ11cbiAgICAnam9iUmVzdGFydCc6IFsnam9iUmVzdGFydCcsICdhZG1pbicsICdtYW5hZ2VyJ11cbiAgICAnam9iU2F2ZSc6IFsnam9iU2F2ZScsICdhZG1pbicsICdjcmVhdG9yJ11cbiAgICAnam9iUmVydW4nOiBbJ2pvYlJlcnVuJywgJ2FkbWluJywgJ2NyZWF0b3InXVxuICAgICdnZXRXb3JrJzogWydnZXRXb3JrJywgJ2FkbWluJywgJ3dvcmtlciddXG4gICAgJ2dldEpvYic6IFsnZ2V0Sm9iJywgJ2FkbWluJywgJ3dvcmtlciddXG4gICAgJ2pvYkxvZyc6IFsgJ2pvYkxvZycsICdhZG1pbicsICd3b3JrZXInXVxuICAgICdqb2JQcm9ncmVzcyc6IFsnam9iUHJvZ3Jlc3MnLCAnYWRtaW4nLCAnd29ya2VyJ11cbiAgICAnam9iRG9uZSc6IFsnam9iRG9uZScsICdhZG1pbicsICd3b3JrZXInXVxuICAgICdqb2JGYWlsJzogWydqb2JGYWlsJywgJ2FkbWluJywgJ3dvcmtlciddXG5cbiAgIyBBdXRvbWF0aWNhbGx5IHdvcmsgd2l0aGluIE1ldGVvciwgb3RoZXJ3aXNlIHNlZSBAc2V0RERQIGJlbG93XG4gIEBfZGRwX2FwcGx5OiB1bmRlZmluZWRcblxuICAjIENsYXNzIG1ldGhvZHNcblxuICBAX3NldEREUEFwcGx5OiAoYXBwbHksIGNvbGxlY3Rpb25OYW1lKSAtPlxuICAgIGlmIHR5cGVvZiBhcHBseSBpcyAnZnVuY3Rpb24nXG4gICAgICBpZiB0eXBlb2YgY29sbGVjdGlvbk5hbWUgaXMgJ3N0cmluZydcbiAgICAgICAgIEBfZGRwX2FwcGx5ID89IHt9XG4gICAgICAgICBpZiB0eXBlb2YgQF9kZHBfYXBwbHkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiSm9iLnNldEREUCBtdXN0IHNwZWNpZnkgYSBjb2xsZWN0aW9uIG5hbWUgZWFjaCB0aW1lIGlmIGNhbGxlZCBtb3JlIHRoYW4gb25jZS5cIlxuICAgICAgICAgQF9kZHBfYXBwbHlbY29sbGVjdGlvbk5hbWVdID0gYXBwbHlcbiAgICAgIGVsc2UgdW5sZXNzIEBfZGRwX2FwcGx5XG4gICAgICAgICBAX2RkcF9hcHBseSA9IGFwcGx5XG4gICAgICBlbHNlXG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJKb2Iuc2V0RERQIG11c3Qgc3BlY2lmeSBhIGNvbGxlY3Rpb24gbmFtZSBlYWNoIHRpbWUgaWYgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLlwiXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQmFkIGZ1bmN0aW9uIGluIEpvYi5zZXRERFBBcHBseSgpXCJcblxuICAjIFRoaXMgbmVlZHMgdG8gYmUgY2FsbGVkIHdoZW4gbm90IHJ1bm5pbmcgaW4gTWV0ZW9yIHRvIHVzZSB0aGUgbG9jYWwgRERQIGNvbm5lY3Rpb24uXG4gIEBzZXRERFA6IChkZHAgPSBudWxsLCBjb2xsZWN0aW9uTmFtZXMgPSBudWxsLCBGaWJlciA9IG51bGwpIC0+XG4gICAgdW5sZXNzICh0eXBlb2YgY29sbGVjdGlvbk5hbWVzIGlzICdzdHJpbmcnKSBvciAoY29sbGVjdGlvbk5hbWVzIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAjIEhhbmRsZSBvcHRpb25hbCBjb2xsZWN0aW9uIHN0cmluZyB3aXRoIEZpYmVyIHByZXNlbnRcbiAgICAgIEZpYmVyID0gY29sbGVjdGlvbk5hbWVzXG4gICAgICBjb2xsZWN0aW9uTmFtZXMgPSBbIHVuZGVmaW5lZCBdXG4gICAgZWxzZSBpZiB0eXBlb2YgY29sbGVjdGlvbk5hbWVzIGlzICdzdHJpbmcnXG4gICAgICAjIElmIHN0cmluZywgY29udmVydCB0byBhcnJheSBvZiBzdHJpbmdzXG4gICAgICBjb2xsZWN0aW9uTmFtZXMgPSBbIGNvbGxlY3Rpb25OYW1lcyBdXG4gICAgZm9yIGNvbGxOYW1lIGluIGNvbGxlY3Rpb25OYW1lc1xuICAgICAgdW5sZXNzIGRkcD8gYW5kIGRkcC5jbG9zZT8gYW5kIGRkcC5zdWJzY3JpYmU/XG4gICAgICAgICMgTm90IHRoZSBERFAgbnBtIHBhY2thZ2VcbiAgICAgICAgaWYgZGRwIGlzIG51bGwgYW5kIE1ldGVvcj8uYXBwbHk/XG4gICAgICAgICAgIyBNZXRlb3IgbG9jYWwgc2VydmVyL2NsaWVudFxuICAgICAgICAgIEBfc2V0RERQQXBwbHkgTWV0ZW9yLmFwcGx5LCBjb2xsTmFtZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgIyBObyBvdGhlciBwb3NzaWJpbGl0aWVzLi4uXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQmFkIGRkcCBvYmplY3QgaW4gSm9iLnNldEREUCgpXCJcbiAgICAgIGVsc2UgdW5sZXNzIGRkcC5vYnNlcnZlPyAgIyBUaGlzIGlzIGEgTWV0ZW9yIEREUCBjb25uZWN0aW9uIG9iamVjdFxuICAgICAgICBAX3NldEREUEFwcGx5IGRkcC5hcHBseS5iaW5kKGRkcCksIGNvbGxOYW1lXG4gICAgICBlbHNlICMgVGhpcyBpcyB0aGUgbnBtIEREUCBwYWNrYWdlXG4gICAgICAgIHVubGVzcyBGaWJlcj9cbiAgICAgICAgICBAX3NldEREUEFwcGx5IGRkcC5jYWxsLmJpbmQoZGRwKSwgY29sbE5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgSWYgRmliZXJzIGluIHVzZSB1bmRlciBwdXJlIG5vZGUuanMsXG4gICAgICAgICAgIyBtYWtlIHN1cmUgdG8geWllbGQgYW5kIHRocm93IGVycm9ycyB3aGVuIG5vIGNhbGxiYWNrXG4gICAgICAgICAgQF9zZXRERFBBcHBseSgoKG5hbWUsIHBhcmFtcywgY2IpIC0+XG4gICAgICAgICAgICBmaWIgPSBGaWJlci5jdXJyZW50XG4gICAgICAgICAgICBkZHAuY2FsbCBuYW1lLCBwYXJhbXMsIChlcnIsIHJlcykgLT5cbiAgICAgICAgICAgICAgaWYgY2I/IGFuZCB0eXBlb2YgY2IgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgIGNiIGVyciwgcmVzXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBlcnJcbiAgICAgICAgICAgICAgICAgIGZpYi50aHJvd0ludG8gZXJyXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgZmliLnJ1biByZXNcbiAgICAgICAgICAgIGlmIGNiPyBhbmQgdHlwZW9mIGNiIGlzICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiBGaWJlci55aWVsZCgpXG4gICAgICAgICAgKSwgY29sbE5hbWUpXG5cbiAgIyBDcmVhdGVzIGEgam9iIG9iamVjdCBieSByZXNlcnZpbmcgdGhlIG5leHQgYXZhaWxhYmxlIGpvYiBvZlxuICAjIHRoZSBzcGVjaWZpZWQgJ3R5cGUnIGZyb20gdGhlIHNlcnZlciBxdWV1ZSByb290XG4gICMgcmV0dXJucyBudWxsIGlmIG5vIHN1Y2ggam9iIGV4aXN0c1xuICBAZ2V0V29yazogKHJvb3QsIHR5cGUsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIHR5cGUgPSBbdHlwZV0gaWYgdHlwZW9mIHR5cGUgaXMgJ3N0cmluZydcbiAgICBpZiBvcHRpb25zLndvcmtUaW1lb3V0P1xuICAgICAgdW5sZXNzIGlzSW50ZWdlcihvcHRpb25zLndvcmtUaW1lb3V0KSBhbmQgb3B0aW9ucy53b3JrVGltZW91dCA+IDBcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdnZXRXb3JrOiB3b3JrVGltZW91dCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlcidcbiAgICBtZXRob2RDYWxsIHJvb3QsIFwiZ2V0V29ya1wiLCBbdHlwZSwgb3B0aW9uc10sIGNiLCAocmVzKSA9PlxuICAgICAgam9icyA9IChuZXcgSm9iKHJvb3QsIGRvYykgZm9yIGRvYyBpbiByZXMpIG9yIFtdXG4gICAgICBpZiBvcHRpb25zLm1heEpvYnM/XG4gICAgICAgIHJldHVybiBqb2JzXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBqb2JzWzBdXG5cbiAgIyBUaGlzIGlzIGRlZmluZWQgYWJvdmVcbiAgQHByb2Nlc3NKb2JzOiBKb2JRdWV1ZVxuXG4gICMgTWFrZXMgYSBqb2Igb2JqZWN0IGZyb20gYSBqb2IgZG9jdW1lbnRcbiAgIyBUaGlzIG1ldGhvZCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWRcbiAgQG1ha2VKb2I6IGRvICgpIC0+XG4gICAgZGVwRmxhZyA9IGZhbHNlXG4gICAgKHJvb3QsIGRvYykgLT5cbiAgICAgIHVubGVzcyBkZXBGbGFnXG4gICAgICAgIGRlcEZsYWcgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIkpvYi5tYWtlSm9iKHJvb3QsIGpvYkRvYykgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHJlbGVhc2UsIHVzZSAnbmV3IEpvYihyb290LCBqb2JEb2MpJyBpbnN0ZWFkLlwiXG4gICAgICBuZXcgSm9iIHJvb3QsIGRvY1xuXG4gICMgQ3JlYXRlcyBhIGpvYiBvYmplY3QgYnkgaWQgZnJvbSB0aGUgc2VydmVyIHF1ZXVlIHJvb3RcbiAgIyByZXR1cm5zIG51bGwgaWYgbm8gc3VjaCBqb2IgZXhpc3RzXG4gIEBnZXRKb2I6IChyb290LCBpZCwgb3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgb3B0aW9ucy5nZXRMb2cgPz0gZmFsc2VcbiAgICBtZXRob2RDYWxsIHJvb3QsIFwiZ2V0Sm9iXCIsIFtpZCwgb3B0aW9uc10sIGNiLCAoZG9jKSA9PlxuICAgICAgaWYgZG9jXG4gICAgICAgIG5ldyBKb2Igcm9vdCwgZG9jXG4gICAgICBlbHNlXG4gICAgICAgIHVuZGVmaW5lZFxuXG4gICMgTGlrZSB0aGUgYWJvdmUsIGJ1dCB0YWtlcyBhbiBhcnJheSBvZiBpZHMsIHJldHVybnMgYXJyYXkgb2Ygam9ic1xuICBAZ2V0Sm9iczogKHJvb3QsIGlkcywgb3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgb3B0aW9ucy5nZXRMb2cgPz0gZmFsc2VcbiAgICByZXRWYWwgPSBbXVxuICAgIGNodW5rc09mSWRzID0gc3BsaXRMb25nQXJyYXkgaWRzLCAzMlxuICAgIG15Q2IgPSByZWR1Y2VDYWxsYmFja3MoY2IsIGNodW5rc09mSWRzLmxlbmd0aCwgY29uY2F0UmVkdWNlLCBbXSlcbiAgICBmb3IgY2h1bmtPZklkcyBpbiBjaHVua3NPZklkc1xuICAgICAgcmV0VmFsID0gcmV0VmFsLmNvbmNhdChtZXRob2RDYWxsIHJvb3QsIFwiZ2V0Sm9iXCIsIFtjaHVua09mSWRzLCBvcHRpb25zXSwgbXlDYiwgKGRvYykgPT5cbiAgICAgICAgaWYgZG9jXG4gICAgICAgICAgKG5ldyBKb2Iocm9vdCwgZC50eXBlLCBkLmRhdGEsIGQpIGZvciBkIGluIGRvYylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG51bGwpXG4gICAgcmV0dXJuIHJldFZhbFxuXG4gICMgUGF1c2UgdGhpcyBqb2IsIG9ubHkgUmVhZHkgYW5kIFdhaXRpbmcgam9icyBjYW4gYmUgcGF1c2VkXG4gICMgQ2FsbGluZyB0aGlzIHRvZ2dsZXMgdGhlIHBhdXNlZCBzdGF0ZS4gVW5wYXVzZWQgam9icyBnbyB0byB3YWl0aW5nXG4gIEBwYXVzZUpvYnM6IChyb290LCBpZHMsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIHJldFZhbCA9IGZhbHNlXG4gICAgY2h1bmtzT2ZJZHMgPSBzcGxpdExvbmdBcnJheSBpZHMsIDI1NlxuICAgIG15Q2IgPSByZWR1Y2VDYWxsYmFja3MoY2IsIGNodW5rc09mSWRzLmxlbmd0aClcbiAgICBmb3IgY2h1bmtPZklkcyBpbiBjaHVua3NPZklkc1xuICAgICAgcmV0VmFsID0gbWV0aG9kQ2FsbChyb290LCBcImpvYlBhdXNlXCIsIFtjaHVua09mSWRzLCBvcHRpb25zXSwgbXlDYikgfHwgcmV0VmFsXG4gICAgcmV0dXJuIHJldFZhbFxuXG4gICMgUmVzdW1lIHRoaXMgam9iLCBvbmx5IFBhdXNlZCBqb2JzIGNhbiBiZSByZXN1bWVkXG4gICMgQ2FsbGluZyB0aGlzIHRvZ2dsZXMgdGhlIHBhdXNlZCBzdGF0ZS4gVW5wYXVzZWQgam9icyBnbyB0byB3YWl0aW5nXG4gIEByZXN1bWVKb2JzOiAocm9vdCwgaWRzLCBvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICByZXRWYWwgPSBmYWxzZVxuICAgIGNodW5rc09mSWRzID0gc3BsaXRMb25nQXJyYXkgaWRzLCAyNTZcbiAgICBteUNiID0gcmVkdWNlQ2FsbGJhY2tzKGNiLCBjaHVua3NPZklkcy5sZW5ndGgpXG4gICAgZm9yIGNodW5rT2ZJZHMgaW4gY2h1bmtzT2ZJZHNcbiAgICAgIHJldFZhbCA9IG1ldGhvZENhbGwocm9vdCwgXCJqb2JSZXN1bWVcIiwgW2NodW5rT2ZJZHMsIG9wdGlvbnNdLCBteUNiKSB8fCByZXRWYWxcbiAgICByZXR1cm4gcmV0VmFsXG5cbiAgIyBNb3ZlIHdhaXRpbmcgam9icyB0byB0aGUgcmVhZHkgc3RhdGUsIGpvYnMgd2l0aCBkZXBlbmRlbmNpZXMgd2lsbCBub3RcbiAgIyBiZSBtYWRlIHJlYWR5IHVubGVzcyBmb3JjZSBpcyB1c2VkLlxuICBAcmVhZHlKb2JzOiAocm9vdCwgaWRzID0gW10sIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMuZm9yY2UgPz0gZmFsc2VcbiAgICByZXRWYWwgPSBmYWxzZVxuICAgIGNodW5rc09mSWRzID0gc3BsaXRMb25nQXJyYXkgaWRzLCAyNTZcbiAgICBjaHVua3NPZklkcyA9IFtbXV0gdW5sZXNzIGNodW5rc09mSWRzLmxlbmd0aCA+IDBcbiAgICBteUNiID0gcmVkdWNlQ2FsbGJhY2tzKGNiLCBjaHVua3NPZklkcy5sZW5ndGgpXG4gICAgZm9yIGNodW5rT2ZJZHMgaW4gY2h1bmtzT2ZJZHNcbiAgICAgIHJldFZhbCA9IG1ldGhvZENhbGwocm9vdCwgXCJqb2JSZWFkeVwiLCBbY2h1bmtPZklkcywgb3B0aW9uc10sIG15Q2IpIHx8IHJldFZhbFxuICAgIHJldHVybiByZXRWYWxcblxuICAjIENhbmNlbCB0aGlzIGpvYiBpZiBpdCBpcyBydW5uaW5nIG9yIGFibGUgdG8gcnVuICh3YWl0aW5nLCByZWFkeSlcbiAgQGNhbmNlbEpvYnM6IChyb290LCBpZHMsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMuYW50ZWNlZGVudHMgPz0gdHJ1ZVxuICAgIHJldFZhbCA9IGZhbHNlXG4gICAgY2h1bmtzT2ZJZHMgPSBzcGxpdExvbmdBcnJheSBpZHMsIDI1NlxuICAgIG15Q2IgPSByZWR1Y2VDYWxsYmFja3MoY2IsIGNodW5rc09mSWRzLmxlbmd0aClcbiAgICBmb3IgY2h1bmtPZklkcyBpbiBjaHVua3NPZklkc1xuICAgICAgcmV0VmFsID0gbWV0aG9kQ2FsbChyb290LCBcImpvYkNhbmNlbFwiLCBbY2h1bmtPZklkcywgb3B0aW9uc10sIG15Q2IpIHx8IHJldFZhbFxuICAgIHJldHVybiByZXRWYWxcblxuICAjIFJlc3RhcnQgYSBmYWlsZWQgb3IgY2FuY2VsbGVkIGpvYlxuICBAcmVzdGFydEpvYnM6IChyb290LCBpZHMsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMucmV0cmllcyA/PSAxXG4gICAgb3B0aW9ucy5kZXBlbmRlbnRzID89IHRydWVcbiAgICByZXRWYWwgPSBmYWxzZVxuICAgIGNodW5rc09mSWRzID0gc3BsaXRMb25nQXJyYXkgaWRzLCAyNTZcbiAgICBteUNiID0gcmVkdWNlQ2FsbGJhY2tzKGNiLCBjaHVua3NPZklkcy5sZW5ndGgpXG4gICAgZm9yIGNodW5rT2ZJZHMgaW4gY2h1bmtzT2ZJZHNcbiAgICAgIHJldFZhbCA9IG1ldGhvZENhbGwocm9vdCwgXCJqb2JSZXN0YXJ0XCIsIFtjaHVua09mSWRzLCBvcHRpb25zXSwgbXlDYikgfHwgcmV0VmFsXG4gICAgcmV0dXJuIHJldFZhbFxuXG4gICMgUmVtb3ZlIGEgam9iIHRoYXQgaXMgbm90IGFibGUgdG8gcnVuIChjb21wbGV0ZWQsIGNhbmNlbGxlZCwgZmFpbGVkKSBmcm9tIHRoZSBxdWV1ZVxuICBAcmVtb3ZlSm9iczogKHJvb3QsIGlkcywgb3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgcmV0VmFsID0gZmFsc2VcbiAgICBjaHVua3NPZklkcyA9IHNwbGl0TG9uZ0FycmF5IGlkcywgMjU2XG4gICAgbXlDYiA9IHJlZHVjZUNhbGxiYWNrcyhjYiwgY2h1bmtzT2ZJZHMubGVuZ3RoKVxuICAgIGZvciBjaHVua09mSWRzIGluIGNodW5rc09mSWRzXG4gICAgICByZXRWYWwgPSBtZXRob2RDYWxsKHJvb3QsIFwiam9iUmVtb3ZlXCIsIFtjaHVua09mSWRzLCBvcHRpb25zXSwgbXlDYikgfHwgcmV0VmFsXG4gICAgcmV0dXJuIHJldFZhbFxuXG4gICMgU3RhcnQgdGhlIGpvYiBxdWV1ZVxuICAjIERlcHJlY2F0ZWQhXG4gIEBzdGFydEpvYnM6IChyb290LCBvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBtZXRob2RDYWxsIHJvb3QsIFwic3RhcnRKb2JzXCIsIFtvcHRpb25zXSwgY2JcblxuICAjIFN0b3AgdGhlIGpvYiBxdWV1ZSwgc3RvcCBhbGwgcnVubmluZyBqb2JzXG4gICMgRGVwcmVjYXRlZCFcbiAgQHN0b3BKb2JzOiAocm9vdCwgb3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgb3B0aW9ucy50aW1lb3V0ID89IDYwKjEwMDBcbiAgICBtZXRob2RDYWxsIHJvb3QsIFwic3RvcEpvYnNcIiwgW29wdGlvbnNdLCBjYlxuXG4gICMgU3RhcnQgdGhlIGpvYiBxdWV1ZVxuICBAc3RhcnRKb2JTZXJ2ZXI6IChyb290LCBvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBtZXRob2RDYWxsIHJvb3QsIFwic3RhcnRKb2JTZXJ2ZXJcIiwgW29wdGlvbnNdLCBjYlxuXG4gICMgU2h1dGRvd24gdGhlIGpvYiBxdWV1ZSwgc3RvcCBhbGwgcnVubmluZyBqb2JzXG4gIEBzaHV0ZG93bkpvYlNlcnZlcjogKHJvb3QsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMudGltZW91dCA/PSA2MCoxMDAwXG4gICAgbWV0aG9kQ2FsbCByb290LCBcInNodXRkb3duSm9iU2VydmVyXCIsIFtvcHRpb25zXSwgY2JcblxuICAjIEpvYiBjbGFzcyBpbnN0YW5jZSBjb25zdHJ1Y3Rvci4gV2hlbiBcIm5ldyBKb2IoLi4uKVwiIGlzIHJ1blxuICBjb25zdHJ1Y3RvcjogKEByb290LCB0eXBlLCBkYXRhKSAtPlxuICAgIHVubGVzcyBAIGluc3RhbmNlb2YgSm9iXG4gICAgICByZXR1cm4gbmV3IEpvYiBAcm9vdCwgdHlwZSwgZGF0YVxuXG4gICAgIyBLZWVwIHRoZSBvcmlnaW5hbCByb290LCB3aGF0ZXZlciB0eXBlIHRoYXQgaXNcbiAgICBAX3Jvb3QgPSBAcm9vdFxuXG4gICAgIyBIYW5kbGUgcm9vdCBhcyBvYmplY3Qgd2l0aCBvYmoucm9vdCBhdHRyaWJ1dGVcbiAgICBpZiBAcm9vdD8ucm9vdD8gYW5kIHR5cGVvZiBAcm9vdC5yb290IGlzICdzdHJpbmcnXG4gICAgICBAcm9vdCA9IEBfcm9vdC5yb290XG5cbiAgICAjIEhhbmRsZSAocm9vdCwgZG9jKSBzaWduYXR1cmVcbiAgICBpZiBub3QgZGF0YT8gYW5kIHR5cGU/LmRhdGE/IGFuZCB0eXBlPy50eXBlP1xuICAgICAgaWYgdHlwZSBpbnN0YW5jZW9mIEpvYlxuICAgICAgICByZXR1cm4gdHlwZVxuXG4gICAgICBkb2MgPSB0eXBlXG4gICAgICBkYXRhID0gZG9jLmRhdGFcbiAgICAgIHR5cGUgPSBkb2MudHlwZVxuICAgIGVsc2VcbiAgICAgIGRvYyA9IHt9XG5cbiAgICB1bmxlc3MgdHlwZW9mIGRvYyBpcyAnb2JqZWN0JyBhbmRcbiAgICAgICAgICAgdHlwZW9mIGRhdGEgaXMgJ29iamVjdCcgYW5kXG4gICAgICAgICAgIHR5cGVvZiB0eXBlIGlzICdzdHJpbmcnIGFuZFxuICAgICAgICAgICB0eXBlb2YgQHJvb3QgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIm5ldyBKb2I6IGJhZCBwYXJhbWV0ZXIocyksICN7QHJvb3R9ICgje3R5cGVvZiBAcm9vdH0pLCAje3R5cGV9ICgje3R5cGVvZiB0eXBlfSksICN7ZGF0YX0gKCN7dHlwZW9mIGRhdGF9KSwgI3tkb2N9ICgje3R5cGVvZiBkb2N9KVwiXG5cbiAgICBlbHNlIGlmIGRvYy50eXBlPyBhbmQgZG9jLmRhdGE/ICMgVGhpcyBjYXNlIGlzIHVzZWQgdG8gY3JlYXRlIGxvY2FsIEpvYiBvYmplY3RzIGZyb20gRERQIGNhbGxzXG4gICAgICBAX2RvYyA9IGRvY1xuXG4gICAgZWxzZSAgIyBUaGlzIGlzIHRoZSBub3JtYWwgXCJjcmVhdGUgYSBuZXcgb2JqZWN0XCIgY2FzZVxuICAgICAgdGltZSA9IG5ldyBEYXRlKClcbiAgICAgIEBfZG9jID1cbiAgICAgICAgcnVuSWQ6IG51bGxcbiAgICAgICAgdHlwZSA6IHR5cGVcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICBzdGF0dXM6ICd3YWl0aW5nJ1xuICAgICAgICB1cGRhdGVkOiB0aW1lXG4gICAgICAgIGNyZWF0ZWQ6IHRpbWVcbiAgICAgIEBwcmlvcml0eSgpLnJldHJ5KCkucmVwZWF0KCkuYWZ0ZXIoKS5wcm9ncmVzcygpLmRlcGVuZHMoKS5sb2coXCJDb25zdHJ1Y3RlZFwiKVxuXG4gICAgcmV0dXJuIEBcblxuICAjIE92ZXJyaWRlIHBvaW50IGZvciBtZXRob2RzIHRoYXQgaGF2ZSBhbiBlY2hvIG9wdGlvblxuICBfZWNobzogKG1lc3NhZ2UsIGxldmVsID0gbnVsbCkgLT5cbiAgICBzd2l0Y2ggbGV2ZWxcbiAgICAgIHdoZW4gJ2RhbmdlcicgdGhlbiBjb25zb2xlLmVycm9yIG1lc3NhZ2VcbiAgICAgIHdoZW4gJ3dhcm5pbmcnIHRoZW4gY29uc29sZS53YXJuIG1lc3NhZ2VcbiAgICAgIHdoZW4gJ3N1Y2Nlc3MnIHRoZW4gY29uc29sZS5sb2cgbWVzc2FnZVxuICAgICAgZWxzZSBjb25zb2xlLmluZm8gbWVzc2FnZVxuICAgIHJldHVyblxuXG4gICMgQWRkcyBhIHJ1biBkZXBlbmRhbmN5IG9uIG9uZSBvciBtb3JlIGV4aXN0aW5nIGpvYnMgdG8gdGhpcyBqb2JcbiAgIyBDYWxsaW5nIHdpdGggYSBmYWxzeSB2YWx1ZSByZXNldHMgdGhlIGRlcGVuZGVuY2llcyB0byBbXVxuICBkZXBlbmRzOiAoam9icykgLT5cbiAgICBpZiBqb2JzXG4gICAgICBpZiBqb2JzIGluc3RhbmNlb2YgSm9iXG4gICAgICAgIGpvYnMgPSBbIGpvYnMgXVxuICAgICAgaWYgam9icyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgIGRlcGVuZHMgPSBAX2RvYy5kZXBlbmRzXG4gICAgICAgIGZvciBqIGluIGpvYnNcbiAgICAgICAgICB1bmxlc3MgaiBpbnN0YW5jZW9mIEpvYiBhbmQgai5fZG9jLl9pZD9cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciAnRWFjaCBwcm92aWRlZCBvYmplY3QgbXVzdCBiZSBhIHNhdmVkIEpvYiBpbnN0YW5jZSAod2l0aCBhbiBfaWQpJ1xuICAgICAgICAgIGRlcGVuZHMucHVzaCBqLl9kb2MuX2lkXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnQmFkIGlucHV0IHBhcmFtZXRlcjogZGVwZW5kcygpIGFjY2VwdHMgYSBmYWxzeSB2YWx1ZSwgb3IgSm9iIG9yIGFycmF5IG9mIEpvYnMnXG4gICAgZWxzZVxuICAgICAgZGVwZW5kcyA9IFtdXG4gICAgQF9kb2MuZGVwZW5kcyA9IGRlcGVuZHNcbiAgICBAX2RvYy5yZXNvbHZlZCA9IFtdICAjIFRoaXMgaXMgd2hlcmUgcHJpb3IgZGVwZW5kcyBnbyBhcyB0aGV5IGFyZSBzYXRpc2ZpZWRcbiAgICByZXR1cm4gQFxuXG4gICMgU2V0IHRoZSBydW4gcHJpb3JpdHkgb2YgdGhpcyBqb2JcbiAgcHJpb3JpdHk6IChsZXZlbCA9IDApIC0+XG4gICAgaWYgdHlwZW9mIGxldmVsIGlzICdzdHJpbmcnXG4gICAgICBwcmlvcml0eSA9IEpvYi5qb2JQcmlvcml0aWVzW2xldmVsXVxuICAgICAgdW5sZXNzIHByaW9yaXR5P1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgc3RyaW5nIHByaW9yaXR5IGxldmVsIHByb3ZpZGVkJ1xuICAgIGVsc2UgaWYgaXNJbnRlZ2VyKGxldmVsKVxuICAgICAgcHJpb3JpdHkgPSBsZXZlbFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciAncHJpb3JpdHkgbXVzdCBiZSBhbiBpbnRlZ2VyIG9yIHZhbGlkIHByaW9yaXR5IGxldmVsJ1xuICAgICAgcHJpb3JpdHkgPSAwXG4gICAgQF9kb2MucHJpb3JpdHkgPSBwcmlvcml0eVxuICAgIHJldHVybiBAXG5cbiAgIyBTZXRzIHRoZSBudW1iZXIgb2YgYXR0ZW1wdGVkIHJ1bnMgb2YgdGhpcyBqb2IgYW5kXG4gICMgdGhlIHRpbWUgdG8gd2FpdCBiZXR3ZWVuIHN1Y2Nlc3NpdmUgYXR0ZW1wdHNcbiAgIyBEZWZhdWx0LCBkbyBub3QgcmV0cnlcbiAgcmV0cnk6IChvcHRpb25zID0gMCkgLT5cbiAgICBpZiBpc0ludGVnZXIob3B0aW9ucykgYW5kIG9wdGlvbnMgPj0gMFxuICAgICAgb3B0aW9ucyA9IHsgcmV0cmllczogb3B0aW9ucyB9XG4gICAgaWYgdHlwZW9mIG9wdGlvbnMgaXNudCAnb2JqZWN0J1xuICAgICAgdGhyb3cgbmV3IEVycm9yICdiYWQgcGFyYW1ldGVyOiBhY2NlcHRzIGVpdGhlciBhbiBpbnRlZ2VyID49IDAgb3IgYW4gb3B0aW9ucyBvYmplY3QnXG4gICAgaWYgb3B0aW9ucy5yZXRyaWVzP1xuICAgICAgdW5sZXNzIGlzSW50ZWdlcihvcHRpb25zLnJldHJpZXMpIGFuZCBvcHRpb25zLnJldHJpZXMgPj0gMFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb246IHJldHJpZXMgbXVzdCBiZSBhbiBpbnRlZ2VyID49IDAnXG4gICAgICBvcHRpb25zLnJldHJpZXMrK1xuICAgIGVsc2VcbiAgICAgIG9wdGlvbnMucmV0cmllcyA9IEpvYi5mb3JldmVyXG4gICAgaWYgb3B0aW9ucy51bnRpbD9cbiAgICAgIHVubGVzcyBvcHRpb25zLnVudGlsIGluc3RhbmNlb2YgRGF0ZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb246IHVudGlsIG11c3QgYmUgYSBEYXRlIG9iamVjdCdcbiAgICBlbHNlXG4gICAgICBvcHRpb25zLnVudGlsID0gSm9iLmZvcmV2ZXJEYXRlXG4gICAgaWYgb3B0aW9ucy53YWl0P1xuICAgICAgdW5sZXNzIGlzSW50ZWdlcihvcHRpb25zLndhaXQpIGFuZCBvcHRpb25zLndhaXQgPj0gMFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb246IHdhaXQgbXVzdCBiZSBhbiBpbnRlZ2VyID49IDAnXG4gICAgZWxzZVxuICAgICAgb3B0aW9ucy53YWl0ID0gNSo2MCoxMDAwXG4gICAgaWYgb3B0aW9ucy5iYWNrb2ZmP1xuICAgICAgdW5sZXNzIG9wdGlvbnMuYmFja29mZiBpbiBKb2Iuam9iUmV0cnlCYWNrb2ZmTWV0aG9kc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb246IGludmFsaWQgcmV0cnkgYmFja29mZiBtZXRob2QnXG4gICAgZWxzZVxuICAgICAgb3B0aW9ucy5iYWNrb2ZmID0gJ2NvbnN0YW50J1xuXG4gICAgQF9kb2MucmV0cmllcyA9IG9wdGlvbnMucmV0cmllc1xuICAgIEBfZG9jLnJlcGVhdFJldHJpZXMgPSBvcHRpb25zLnJldHJpZXNcbiAgICBAX2RvYy5yZXRyeVdhaXQgPSBvcHRpb25zLndhaXRcbiAgICBAX2RvYy5yZXRyaWVkID89IDBcbiAgICBAX2RvYy5yZXRyeUJhY2tvZmYgPSBvcHRpb25zLmJhY2tvZmZcbiAgICBAX2RvYy5yZXRyeVVudGlsID0gb3B0aW9ucy51bnRpbFxuICAgIHJldHVybiBAXG5cbiAgIyBTZXRzIHRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0ZWRseSBydW4gdGhpcyBqb2JcbiAgIyBhbmQgdGhlIHRpbWUgdG8gd2FpdCBiZXR3ZWVuIHN1Y2Nlc3NpdmUgcnVuc1xuICAjIERlZmF1bHQ6IHJlcGVhdCBldmVyeSA1IG1pbnV0ZXMsIGZvcmV2ZXIuLi5cbiAgcmVwZWF0OiAob3B0aW9ucyA9IDApIC0+XG4gICAgaWYgaXNJbnRlZ2VyKG9wdGlvbnMpIGFuZCBvcHRpb25zID49IDBcbiAgICAgIG9wdGlvbnMgPSB7IHJlcGVhdHM6IG9wdGlvbnMgfVxuICAgIGlmIHR5cGVvZiBvcHRpb25zIGlzbnQgJ29iamVjdCdcbiAgICAgIHRocm93IG5ldyBFcnJvciAnYmFkIHBhcmFtZXRlcjogYWNjZXB0cyBlaXRoZXIgYW4gaW50ZWdlciA+PSAwIG9yIGFuIG9wdGlvbnMgb2JqZWN0J1xuICAgIGlmIG9wdGlvbnMud2FpdD8gYW5kIG9wdGlvbnMuc2NoZWR1bGU/XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb25zOiB3YWl0IGFuZCBzY2hlZHVsZSBvcHRpb25zIGFyZSBtdXR1YWxseSBleGNsdXNpdmUnXG4gICAgaWYgb3B0aW9ucy5yZXBlYXRzP1xuICAgICAgdW5sZXNzIGlzSW50ZWdlcihvcHRpb25zLnJlcGVhdHMpIGFuZCBvcHRpb25zLnJlcGVhdHMgPj0gMFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ2JhZCBvcHRpb246IHJlcGVhdHMgbXVzdCBiZSBhbiBpbnRlZ2VyID49IDAnXG4gICAgZWxzZVxuICAgICAgb3B0aW9ucy5yZXBlYXRzID0gSm9iLmZvcmV2ZXJcbiAgICBpZiBvcHRpb25zLnVudGlsP1xuICAgICAgdW5sZXNzIG9wdGlvbnMudW50aWwgaW5zdGFuY2VvZiBEYXRlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnYmFkIG9wdGlvbjogdW50aWwgbXVzdCBiZSBhIERhdGUgb2JqZWN0J1xuICAgIGVsc2VcbiAgICAgIG9wdGlvbnMudW50aWwgPSBKb2IuZm9yZXZlckRhdGVcbiAgICBpZiBvcHRpb25zLndhaXQ/XG4gICAgICB1bmxlc3MgaXNJbnRlZ2VyKG9wdGlvbnMud2FpdCkgYW5kIG9wdGlvbnMud2FpdCA+PSAwXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnYmFkIG9wdGlvbjogd2FpdCBtdXN0IGJlIGFuIGludGVnZXIgPj0gMCdcbiAgICBlbHNlXG4gICAgICBvcHRpb25zLndhaXQgPSA1KjYwKjEwMDBcbiAgICBpZiBvcHRpb25zLnNjaGVkdWxlP1xuICAgICAgdW5sZXNzIHR5cGVvZiBvcHRpb25zLnNjaGVkdWxlIGlzICdvYmplY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnYmFkIG9wdGlvbiwgc2NoZWR1bGUgb3B0aW9uIG11c3QgYmUgYW4gb2JqZWN0J1xuICAgICAgdW5sZXNzIG9wdGlvbnMuc2NoZWR1bGU/LnNjaGVkdWxlcz8gYW5kIG9wdGlvbnMuc2NoZWR1bGUuc2NoZWR1bGVzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdiYWQgb3B0aW9uLCBzY2hlZHVsZSBvYmplY3QgcmVxdWlyZXMgYSBzY2hlZHVsZXMgYXR0cmlidXRlIG9mIHR5cGUgQXJyYXkuJ1xuICAgICAgaWYgb3B0aW9ucy5zY2hlZHVsZS5leGNlcHRpb25zPyBhbmQgbm90IChvcHRpb25zLnNjaGVkdWxlLmV4Y2VwdGlvbnMgaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yICdiYWQgb3B0aW9uLCBzY2hlZHVsZSBvYmplY3QgZXhjZXB0aW9ucyBhdHRyaWJ1dGUgbXVzdCBiZSBhbiBBcnJheSdcbiAgICAgIG9wdGlvbnMud2FpdCA9XG4gICAgICAgIHNjaGVkdWxlczogb3B0aW9ucy5zY2hlZHVsZS5zY2hlZHVsZXNcbiAgICAgICAgZXhjZXB0aW9uczogb3B0aW9ucy5zY2hlZHVsZS5leGNlcHRpb25zXG5cbiAgICBAX2RvYy5yZXBlYXRzID0gb3B0aW9ucy5yZXBlYXRzXG4gICAgQF9kb2MucmVwZWF0V2FpdCA9IG9wdGlvbnMud2FpdFxuICAgIEBfZG9jLnJlcGVhdGVkID89IDBcbiAgICBAX2RvYy5yZXBlYXRVbnRpbCA9IG9wdGlvbnMudW50aWxcbiAgICByZXR1cm4gQFxuXG4gICMgU2V0cyB0aGUgZGVsYXkgYmVmb3JlIHRoaXMgam9iIGNhbiBydW4gYWZ0ZXIgaXQgaXMgc2F2ZWRcbiAgZGVsYXk6ICh3YWl0ID0gMCkgLT5cbiAgICB1bmxlc3MgaXNJbnRlZ2VyKHdhaXQpIGFuZCB3YWl0ID49IDBcbiAgICAgIHRocm93IG5ldyBFcnJvciAnQmFkIHBhcmFtZXRlciwgZGVsYXkgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgaW50ZWdlci4nXG4gICAgcmV0dXJuIEBhZnRlciBuZXcgRGF0ZShuZXcgRGF0ZSgpLnZhbHVlT2YoKSArIHdhaXQpXG5cbiAgIyBTZXRzIGEgdGltZSBhZnRlciB3aGljaCB0aGlzIGpvYiBjYW4gcnVuIG9uY2UgaXQgaXMgc2F2ZWRcbiAgYWZ0ZXI6ICh0aW1lID0gbmV3IERhdGUoMCkpIC0+XG4gICAgaWYgdHlwZW9mIHRpbWUgaXMgJ29iamVjdCcgYW5kIHRpbWUgaW5zdGFuY2VvZiBEYXRlXG4gICAgICBhZnRlciA9IHRpbWVcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ0JhZCBwYXJhbWV0ZXIsIGFmdGVyIHJlcXVpcmVzIGEgdmFsaWQgRGF0ZSBvYmplY3QnXG4gICAgQF9kb2MuYWZ0ZXIgPSBhZnRlclxuICAgIHJldHVybiBAXG5cbiAgIyBXcml0ZSBhIG1lc3NhZ2UgdG8gdGhpcyBqb2IncyBsb2cuXG4gIGxvZzogKG1lc3NhZ2UsIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMubGV2ZWwgPz0gJ2luZm8nXG4gICAgdW5sZXNzIHR5cGVvZiBtZXNzYWdlIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ0xvZyBtZXNzYWdlIG11c3QgYmUgYSBzdHJpbmcnXG4gICAgdW5sZXNzIHR5cGVvZiBvcHRpb25zLmxldmVsIGlzICdzdHJpbmcnIGFuZCBvcHRpb25zLmxldmVsIGluIEpvYi5qb2JMb2dMZXZlbHNcbiAgICAgIHRocm93IG5ldyBFcnJvciAnTG9nIGxldmVsIG9wdGlvbnMgbXVzdCBiZSBvbmUgb2YgSm9iLmpvYkxvZ0xldmVscydcbiAgICBpZiBvcHRpb25zLmVjaG8/XG4gICAgICBpZiBvcHRpb25zLmVjaG8gYW5kIEpvYi5qb2JMb2dMZXZlbHMuaW5kZXhPZihvcHRpb25zLmxldmVsKSA+PSBKb2Iuam9iTG9nTGV2ZWxzLmluZGV4T2Yob3B0aW9ucy5lY2hvKVxuICAgICAgICBAX2VjaG8gXCJMT0c6ICN7b3B0aW9ucy5sZXZlbH0sICN7QF9kb2MuX2lkfSAje0BfZG9jLnJ1bklkfTogI3ttZXNzYWdlfVwiLCBvcHRpb25zLmxldmVsXG4gICAgICBkZWxldGUgb3B0aW9ucy5lY2hvXG4gICAgaWYgQF9kb2MuX2lkP1xuICAgICAgcmV0dXJuIG1ldGhvZENhbGwgQF9yb290LCBcImpvYkxvZ1wiLCBbQF9kb2MuX2lkLCBAX2RvYy5ydW5JZCwgbWVzc2FnZSwgb3B0aW9uc10sIGNiXG4gICAgZWxzZSAgIyBMb2cgY2FuIGJlIGNhbGxlZCBvbiBhbiB1bnNhdmVkIGpvYlxuICAgICAgQF9kb2MubG9nID89IFtdXG4gICAgICBAX2RvYy5sb2cucHVzaCB7IHRpbWU6IG5ldyBEYXRlKCksIHJ1bklkOiBudWxsLCBsZXZlbDogb3B0aW9ucy5sZXZlbCwgbWVzc2FnZTogbWVzc2FnZSB9XG4gICAgICBpZiBjYj8gYW5kIHR5cGVvZiBjYiBpcyAnZnVuY3Rpb24nXG4gICAgICAgIF9zZXRJbW1lZGlhdGUgY2IsIG51bGwsIHRydWUgICAjIERPIE5PVCByZWxlYXNlIFphbGdvXG4gICAgICByZXR1cm4gQCAgIyBBbGxvdyBjYWxsIGNoYWluaW5nIGluIHRoaXMgY2FzZVxuXG4gICMgSW5kaWNhdGUgcHJvZ3Jlc3MgbWFkZSBmb3IgYSBydW5uaW5nIGpvYi4gVGhpcyBpcyBpbXBvcnRhbnQgZm9yXG4gICMgbG9uZyBydW5uaW5nIGpvYnMgc28gdGhlIHNjaGVkdWxlciBkb2Vzbid0IGFzc3VtZSB0aGV5IGFyZSBkZWFkXG4gIHByb2dyZXNzOiAoY29tcGxldGVkID0gMCwgdG90YWwgPSAxLCBvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCBpcyAnbnVtYmVyJyBhbmRcbiAgICAgICAgdHlwZW9mIHRvdGFsIGlzICdudW1iZXInIGFuZFxuICAgICAgICBjb21wbGV0ZWQgPj0gMCBhbmRcbiAgICAgICAgdG90YWwgPiAwIGFuZFxuICAgICAgICB0b3RhbCA+PSBjb21wbGV0ZWQpXG4gICAgICBwcm9ncmVzcyA9XG4gICAgICAgIGNvbXBsZXRlZDogY29tcGxldGVkXG4gICAgICAgIHRvdGFsOiB0b3RhbFxuICAgICAgICBwZXJjZW50OiAxMDAqY29tcGxldGVkL3RvdGFsXG4gICAgICBpZiBvcHRpb25zLmVjaG9cbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuZWNob1xuICAgICAgICBAX2VjaG8gXCJQUk9HUkVTUzogI3tAX2RvYy5faWR9ICN7QF9kb2MucnVuSWR9OiAje3Byb2dyZXNzLmNvbXBsZXRlZH0gb3V0IG9mICN7cHJvZ3Jlc3MudG90YWx9ICgje3Byb2dyZXNzLnBlcmNlbnR9JSlcIlxuICAgICAgaWYgQF9kb2MuX2lkPyBhbmQgQF9kb2MucnVuSWQ/XG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsIEBfcm9vdCwgXCJqb2JQcm9ncmVzc1wiLCBbQF9kb2MuX2lkLCBAX2RvYy5ydW5JZCwgY29tcGxldGVkLCB0b3RhbCwgb3B0aW9uc10sIGNiLCAocmVzKSA9PlxuICAgICAgICAgIGlmIHJlc1xuICAgICAgICAgICAgQF9kb2MucHJvZ3Jlc3MgPSBwcm9ncmVzc1xuICAgICAgICAgIHJlc1xuICAgICAgZWxzZSB1bmxlc3MgQF9kb2MuX2lkP1xuICAgICAgICBAX2RvYy5wcm9ncmVzcyA9IHByb2dyZXNzXG4gICAgICAgIGlmIGNiPyBhbmQgdHlwZW9mIGNiIGlzICdmdW5jdGlvbidcbiAgICAgICAgICBfc2V0SW1tZWRpYXRlIGNiLCBudWxsLCB0cnVlICAgIyBETyBOT1QgcmVsZWFzZSBaYWxnb1xuICAgICAgICByZXR1cm4gQFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciBcImpvYi5wcm9ncmVzczogc29tZXRoaW5nIGlzIHdyb25nIHdpdGggcHJvZ3Jlc3MgcGFyYW1zOiAje0BpZH0sICN7Y29tcGxldGVkfSBvdXQgb2YgI3t0b3RhbH1cIlxuICAgIHJldHVybiBudWxsXG5cbiAgIyBTYXZlIHRoaXMgam9iIHRvIHRoZSBzZXJ2ZXIgam9iIHF1ZXVlIENvbGxlY3Rpb24gaXQgd2lsbCBhbHNvIHJlc2F2ZSBhIG1vZGlmaWVkIGpvYiBpZiB0aGVcbiAgIyBqb2IgaXMgbm90IHJ1bm5pbmcgYW5kIGhhc24ndCBjb21wbGV0ZWQuXG4gIHNhdmU6IChvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iU2F2ZVwiLCBbQF9kb2MsIG9wdGlvbnNdLCBjYiwgKGlkKSA9PlxuICAgICAgaWYgaWRcbiAgICAgICAgQF9kb2MuX2lkID0gaWRcbiAgICAgIGlkXG5cbiAgIyBSZWZyZXNoIHRoZSBsb2NhbCBqb2Igc3RhdGUgd2l0aCB0aGUgc2VydmVyIGpvYiBxdWV1ZSdzIHZlcnNpb25cbiAgcmVmcmVzaDogKG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMuZ2V0TG9nID89IGZhbHNlXG4gICAgaWYgQF9kb2MuX2lkP1xuICAgICAgcmV0dXJuIG1ldGhvZENhbGwgQF9yb290LCBcImdldEpvYlwiLCBbQF9kb2MuX2lkLCBvcHRpb25zXSwgY2IsIChkb2MpID0+XG4gICAgICAgIGlmIGRvYz9cbiAgICAgICAgICBAX2RvYyA9IGRvY1xuICAgICAgICAgIEBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZhbHNlXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2FuJ3QgY2FsbCAucmVmcmVzaCgpIG9uIGFuIHVuc2F2ZWQgam9iXCJcblxuICAjIEluZGljYXRlIHRvIHRoZSBzZXJ2ZXIgdGhhdCB0aGlzIHJ1biBoYXMgc3VjY2Vzc2Z1bGx5IGZpbmlzaGVkLlxuICBkb25lOiAocmVzdWx0ID0ge30sIG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIGlmIHR5cGVvZiByZXN1bHQgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgY2IgPSByZXN1bHRcbiAgICAgIHJlc3VsdCA9IHt9XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgdW5sZXNzIHJlc3VsdD8gYW5kIHR5cGVvZiByZXN1bHQgaXMgJ29iamVjdCdcbiAgICAgIHJlc3VsdCA9IHsgdmFsdWU6IHJlc3VsdCB9XG4gICAgaWYgQF9kb2MuX2lkPyBhbmQgQF9kb2MucnVuSWQ/XG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iRG9uZVwiLCBbQF9kb2MuX2lkLCBAX2RvYy5ydW5JZCwgcmVzdWx0LCBvcHRpb25zXSwgY2JcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW4ndCBjYWxsIC5kb25lKCkgb24gYW4gdW5zYXZlZCBvciBub24tcnVubmluZyBqb2JcIlxuICAgIHJldHVybiBudWxsXG5cbiAgIyBJbmRpY2F0ZSB0byB0aGUgc2VydmVyIHRoYXQgdGhpcyBydW4gaGFzIGZhaWxlZCBhbmQgcHJvdmlkZSBhbiBlcnJvciBtZXNzYWdlLlxuICBmYWlsOiAocmVzdWx0ID0gXCJObyBlcnJvciBpbmZvcm1hdGlvbiBwcm92aWRlZFwiLCBvcHRpb25zLi4uLCBjYikgLT5cbiAgICBpZiB0eXBlb2YgcmVzdWx0IGlzICdmdW5jdGlvbidcbiAgICAgIGNiID0gcmVzdWx0XG4gICAgICByZXN1bHQgPSBcIk5vIGVycm9yIGluZm9ybWF0aW9uIHByb3ZpZGVkXCJcbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICB1bmxlc3MgcmVzdWx0PyBhbmQgdHlwZW9mIHJlc3VsdCBpcyAnb2JqZWN0J1xuICAgICAgcmVzdWx0ID0geyB2YWx1ZTogcmVzdWx0IH1cbiAgICBvcHRpb25zLmZhdGFsID89IGZhbHNlXG4gICAgaWYgQF9kb2MuX2lkPyBhbmQgQF9kb2MucnVuSWQ/XG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iRmFpbFwiLCBbQF9kb2MuX2lkLCBAX2RvYy5ydW5JZCwgcmVzdWx0LCBvcHRpb25zXSwgY2JcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW4ndCBjYWxsIC5mYWlsKCkgb24gYW4gdW5zYXZlZCBvciBub24tcnVubmluZyBqb2JcIlxuICAgIHJldHVybiBudWxsXG5cbiAgIyBQYXVzZSB0aGlzIGpvYiwgb25seSBSZWFkeSBhbmQgV2FpdGluZyBqb2JzIGNhbiBiZSBwYXVzZWRcbiAgcGF1c2U6IChvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBpZiBAX2RvYy5faWQ/XG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iUGF1c2VcIiwgW0BfZG9jLl9pZCwgb3B0aW9uc10sIGNiXG4gICAgZWxzZVxuICAgICAgQF9kb2Muc3RhdHVzID0gJ3BhdXNlZCdcbiAgICAgIGlmIGNiPyBhbmQgdHlwZW9mIGNiIGlzICdmdW5jdGlvbidcbiAgICAgICAgX3NldEltbWVkaWF0ZSBjYiwgbnVsbCwgdHJ1ZSAgIyBETyBOT1QgcmVsZWFzZSBaYWxnb1xuICAgICAgcmV0dXJuIEBcbiAgICByZXR1cm4gbnVsbFxuXG4gICMgUmVzdW1lIHRoaXMgam9iLCBvbmx5IFBhdXNlZCBqb2JzIGNhbiBiZSByZXN1bWVkXG4gICMgUmVzdW1lZCBqb2JzIGdvIHRvIHdhaXRpbmdcbiAgcmVzdW1lOiAob3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgaWYgQF9kb2MuX2lkP1xuICAgICAgcmV0dXJuIG1ldGhvZENhbGwgQF9yb290LCBcImpvYlJlc3VtZVwiLCBbQF9kb2MuX2lkLCBvcHRpb25zXSwgY2JcbiAgICBlbHNlXG4gICAgICBAX2RvYy5zdGF0dXMgPSAnd2FpdGluZydcbiAgICAgIGlmIGNiPyBhbmQgdHlwZW9mIGNiIGlzICdmdW5jdGlvbidcbiAgICAgICAgX3NldEltbWVkaWF0ZSBjYiwgbnVsbCwgdHJ1ZSAgIyBETyBOT1QgcmVsZWFzZSBaYWxnb1xuICAgICAgcmV0dXJuIEBcbiAgICByZXR1cm4gbnVsbFxuXG4gICMgTWFrZSBhIHdhaXRpbmcgam9iIHJlYWR5IHRvIHJ1bi4gSm9icyB3aXRoIGRlcGVuZGVuY2llcyBvbmx5IHdoZW4gZm9yY2VkXG4gIHJlYWR5OiAob3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgb3B0aW9ucy5mb3JjZSA/PSBmYWxzZVxuICAgIGlmIEBfZG9jLl9pZD9cbiAgICAgIHJldHVybiBtZXRob2RDYWxsIEBfcm9vdCwgXCJqb2JSZWFkeVwiLCBbQF9kb2MuX2lkLCBvcHRpb25zXSwgY2JcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW4ndCBjYWxsIC5yZWFkeSgpIG9uIGFuIHVuc2F2ZWQgam9iXCJcbiAgICByZXR1cm4gbnVsbFxuXG4gICMgQ2FuY2VsIHRoaXMgam9iIGlmIGl0IGlzIHJ1bm5pbmcgb3IgYWJsZSB0byBydW4gKHdhaXRpbmcsIHJlYWR5KVxuICBjYW5jZWw6IChvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBvcHRpb25zLmFudGVjZWRlbnRzID89IHRydWVcbiAgICBpZiBAX2RvYy5faWQ/XG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iQ2FuY2VsXCIsIFtAX2RvYy5faWQsIG9wdGlvbnNdLCBjYlxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbid0IGNhbGwgLmNhbmNlbCgpIG9uIGFuIHVuc2F2ZWQgam9iXCJcbiAgICByZXR1cm4gbnVsbFxuXG4gICMgUmVzdGFydCBhIGZhaWxlZCBvciBjYW5jZWxsZWQgam9iXG4gIHJlc3RhcnQ6IChvcHRpb25zLi4uLCBjYikgLT5cbiAgICBbb3B0aW9ucywgY2JdID0gb3B0aW9uc0hlbHAgb3B0aW9ucywgY2JcbiAgICBvcHRpb25zLnJldHJpZXMgPz0gMVxuICAgIG9wdGlvbnMuZGVwZW5kZW50cyA/PSB0cnVlXG4gICAgaWYgQF9kb2MuX2lkP1xuICAgICAgcmV0dXJuIG1ldGhvZENhbGwgQF9yb290LCBcImpvYlJlc3RhcnRcIiwgW0BfZG9jLl9pZCwgb3B0aW9uc10sIGNiXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2FuJ3QgY2FsbCAucmVzdGFydCgpIG9uIGFuIHVuc2F2ZWQgam9iXCJcbiAgICByZXR1cm4gbnVsbFxuXG4gICMgUnVuIGEgY29tcGxldGVkIGpvYiBhZ2FpbiBhcyBhIG5ldyBqb2IsIGVzc2VudGlhbGx5IGEgbWFudWFsIHJlcGVhdFxuICByZXJ1bjogKG9wdGlvbnMuLi4sIGNiKSAtPlxuICAgIFtvcHRpb25zLCBjYl0gPSBvcHRpb25zSGVscCBvcHRpb25zLCBjYlxuICAgIG9wdGlvbnMucmVwZWF0cyA/PSAwXG4gICAgb3B0aW9ucy53YWl0ID89IEBfZG9jLnJlcGVhdFdhaXRcbiAgICBpZiBAX2RvYy5faWQ/XG4gICAgICByZXR1cm4gbWV0aG9kQ2FsbCBAX3Jvb3QsIFwiam9iUmVydW5cIiwgW0BfZG9jLl9pZCwgb3B0aW9uc10sIGNiXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2FuJ3QgY2FsbCAucmVydW4oKSBvbiBhbiB1bnNhdmVkIGpvYlwiXG4gICAgcmV0dXJuIG51bGxcblxuICAjIFJlbW92ZSBhIGpvYiB0aGF0IGlzIG5vdCBhYmxlIHRvIHJ1biAoY29tcGxldGVkLCBjYW5jZWxsZWQsIGZhaWxlZCkgZnJvbSB0aGUgcXVldWVcbiAgcmVtb3ZlOiAob3B0aW9ucy4uLiwgY2IpIC0+XG4gICAgW29wdGlvbnMsIGNiXSA9IG9wdGlvbnNIZWxwIG9wdGlvbnMsIGNiXG4gICAgaWYgQF9kb2MuX2lkP1xuICAgICAgcmV0dXJuIG1ldGhvZENhbGwgQF9yb290LCBcImpvYlJlbW92ZVwiLCBbQF9kb2MuX2lkLCBvcHRpb25zXSwgY2JcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW4ndCBjYWxsIC5yZW1vdmUoKSBvbiBhbiB1bnNhdmVkIGpvYlwiXG4gICAgcmV0dXJuIG51bGxcblxuICAgICMgRGVmaW5lIGNvbnZlbmllbmNlIGdldHRlcnMgZm9yIHNvbWUgZG9jdW1lbnQgcHJvcGVydGllc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBAcHJvdG90eXBlLFxuICAgIGRvYzpcbiAgICAgIGdldDogKCkgLT4gQF9kb2NcbiAgICAgIHNldDogKCkgLT4gY29uc29sZS53YXJuIFwiSm9iLmRvYyBjYW5ub3QgYmUgZGlyZWN0bHkgYXNzaWduZWQuXCJcbiAgICB0eXBlOlxuICAgICAgZ2V0OiAoKSAtPiBAX2RvYy50eXBlXG4gICAgICBzZXQ6ICgpIC0+IGNvbnNvbGUud2FybiBcIkpvYi50eXBlIGNhbm5vdCBiZSBkaXJlY3RseSBhc3NpZ25lZC5cIlxuICAgIGRhdGE6XG4gICAgICBnZXQ6ICgpIC0+IEBfZG9jLmRhdGFcbiAgICAgIHNldDogKCkgLT4gY29uc29sZS53YXJuIFwiSm9iLmRhdGEgY2Fubm90IGJlIGRpcmVjdGx5IGFzc2lnbmVkLlwiXG5cbiMgRXhwb3J0IEpvYiBpbiBhIG5wbSBwYWNrYWdlXG5pZiBtb2R1bGU/LmV4cG9ydHM/XG4gIG1vZHVsZS5leHBvcnRzID0gSm9iXG4iLCIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jICAgICBDb3B5cmlnaHQgKEMpIDIwMTQtMjAxNiBieSBWYXVnaG4gSXZlcnNvblxuIyAgICAgam9iLWNvbGxlY3Rpb24gaXMgZnJlZSBzb2Z0d2FyZSByZWxlYXNlZCB1bmRlciB0aGUgTUlUL1gxMSBsaWNlbnNlLlxuIyAgICAgU2VlIGluY2x1ZGVkIExJQ0VOU0UgZmlsZSBmb3IgZGV0YWlscy5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuX3ZhbGlkTnVtR1RFWmVybyA9ICh2KSAtPlxuICBNYXRjaC50ZXN0KHYsIE51bWJlcikgYW5kIHYgPj0gMC4wXG5cbl92YWxpZE51bUdUWmVybyA9ICh2KSAtPlxuICBNYXRjaC50ZXN0KHYsIE51bWJlcikgYW5kIHYgPiAwLjBcblxuX3ZhbGlkTnVtR1RFT25lID0gKHYpIC0+XG4gIE1hdGNoLnRlc3QodiwgTnVtYmVyKSBhbmQgdiA+PSAxLjBcblxuX3ZhbGlkSW50R1RFWmVybyA9ICh2KSAtPlxuICBfdmFsaWROdW1HVEVaZXJvKHYpIGFuZCBNYXRoLmZsb29yKHYpIGlzIHZcblxuX3ZhbGlkSW50R1RFT25lID0gKHYpIC0+XG4gIF92YWxpZE51bUdURU9uZSh2KSBhbmQgTWF0aC5mbG9vcih2KSBpcyB2XG5cbl92YWxpZFN0YXR1cyA9ICh2KSAtPlxuICBNYXRjaC50ZXN0KHYsIFN0cmluZykgYW5kIHYgaW4gSm9iLmpvYlN0YXR1c2VzXG5cbl92YWxpZExvZ0xldmVsID0gKHYpIC0+XG4gIE1hdGNoLnRlc3QodiwgU3RyaW5nKSBhbmQgdiBpbiBKb2Iuam9iTG9nTGV2ZWxzXG5cbl92YWxpZFJldHJ5QmFja29mZiA9ICh2KSAtPlxuICBNYXRjaC50ZXN0KHYsIFN0cmluZykgYW5kIHYgaW4gSm9iLmpvYlJldHJ5QmFja29mZk1ldGhvZHNcblxuX3ZhbGlkSWQgPSAodikgLT5cbiAgTWF0Y2gudGVzdCh2LCBNYXRjaC5PbmVPZihTdHJpbmcsIE1vbmdvLkNvbGxlY3Rpb24uT2JqZWN0SUQpKVxuXG5fdmFsaWRMb2cgPSAoKSAtPlxuICBbe1xuICAgICAgdGltZTogRGF0ZVxuICAgICAgcnVuSWQ6IE1hdGNoLk9uZU9mKE1hdGNoLldoZXJlKF92YWxpZElkKSwgbnVsbClcbiAgICAgIGxldmVsOiBNYXRjaC5XaGVyZShfdmFsaWRMb2dMZXZlbClcbiAgICAgIG1lc3NhZ2U6IFN0cmluZ1xuICAgICAgZGF0YTogTWF0Y2guT3B0aW9uYWwgT2JqZWN0XG4gIH1dXG5cbl92YWxpZFByb2dyZXNzID0gKCkgLT5cbiAgY29tcGxldGVkOiBNYXRjaC5XaGVyZShfdmFsaWROdW1HVEVaZXJvKVxuICB0b3RhbDogTWF0Y2guV2hlcmUoX3ZhbGlkTnVtR1RFWmVybylcbiAgcGVyY2VudDogTWF0Y2guV2hlcmUoX3ZhbGlkTnVtR1RFWmVybylcblxuX3ZhbGlkTGF0ZXJKU09iaiA9ICgpIC0+XG4gIHNjaGVkdWxlczogWyBPYmplY3QgXVxuICBleGNlcHRpb25zOiBNYXRjaC5PcHRpb25hbCBbIE9iamVjdCBdXG5cbl92YWxpZEpvYkRvYyA9ICgpIC0+XG4gIF9pZDogTWF0Y2guT3B0aW9uYWwgTWF0Y2guT25lT2YoTWF0Y2guV2hlcmUoX3ZhbGlkSWQpLCBudWxsKVxuICBydW5JZDogTWF0Y2guT25lT2YoTWF0Y2guV2hlcmUoX3ZhbGlkSWQpLCBudWxsKVxuICB0eXBlOiBTdHJpbmdcbiAgc3RhdHVzOiBNYXRjaC5XaGVyZSBfdmFsaWRTdGF0dXNcbiAgZGF0YTogT2JqZWN0XG4gIHJlc3VsdDogTWF0Y2guT3B0aW9uYWwgT2JqZWN0XG4gIGZhaWx1cmVzOiBNYXRjaC5PcHRpb25hbCBbIE9iamVjdCBdXG4gIHByaW9yaXR5OiBNYXRjaC5JbnRlZ2VyXG4gIGRlcGVuZHM6IFsgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpIF1cbiAgcmVzb2x2ZWQ6IFsgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpIF1cbiAgYWZ0ZXI6IERhdGVcbiAgdXBkYXRlZDogRGF0ZVxuICB3b3JrVGltZW91dDogTWF0Y2guT3B0aW9uYWwgTWF0Y2guV2hlcmUoX3ZhbGlkSW50R1RFT25lKVxuICBleHBpcmVzQWZ0ZXI6IE1hdGNoLk9wdGlvbmFsIERhdGVcbiAgbG9nOiBNYXRjaC5PcHRpb25hbCBfdmFsaWRMb2coKVxuICBwcm9ncmVzczogX3ZhbGlkUHJvZ3Jlc3MoKVxuICByZXRyaWVzOiBNYXRjaC5XaGVyZSBfdmFsaWRJbnRHVEVaZXJvXG4gIHJldHJpZWQ6IE1hdGNoLldoZXJlIF92YWxpZEludEdURVplcm9cbiAgcmVwZWF0UmV0cmllczogTWF0Y2guT3B0aW9uYWwgTWF0Y2guV2hlcmUgX3ZhbGlkSW50R1RFWmVyb1xuICByZXRyeVVudGlsOiBEYXRlXG4gIHJldHJ5V2FpdDogTWF0Y2guV2hlcmUgX3ZhbGlkSW50R1RFWmVyb1xuICByZXRyeUJhY2tvZmY6IE1hdGNoLldoZXJlIF92YWxpZFJldHJ5QmFja29mZlxuICByZXBlYXRzOiBNYXRjaC5XaGVyZSBfdmFsaWRJbnRHVEVaZXJvXG4gIHJlcGVhdGVkOiBNYXRjaC5XaGVyZSBfdmFsaWRJbnRHVEVaZXJvXG4gIHJlcGVhdFVudGlsOiBEYXRlXG4gIHJlcGVhdFdhaXQ6IE1hdGNoLk9uZU9mKE1hdGNoLldoZXJlKF92YWxpZEludEdURVplcm8pLCBNYXRjaC5XaGVyZShfdmFsaWRMYXRlckpTT2JqKSlcbiAgY3JlYXRlZDogRGF0ZVxuXG5jbGFzcyBKb2JDb2xsZWN0aW9uQmFzZSBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb25cblxuICBjb25zdHJ1Y3RvcjogKEByb290ID0gJ3F1ZXVlJywgb3B0aW9ucyA9IHt9KSAtPlxuICAgIHVubGVzcyBAIGluc3RhbmNlb2YgSm9iQ29sbGVjdGlvbkJhc2VcbiAgICAgIHJldHVybiBuZXcgSm9iQ29sbGVjdGlvbkJhc2UoQHJvb3QsIG9wdGlvbnMpXG5cbiAgICB1bmxlc3MgQCBpbnN0YW5jZW9mIE1vbmdvLkNvbGxlY3Rpb25cbiAgICAgIHRocm93IG5ldyBFcnJvciAnVGhlIGdsb2JhbCBkZWZpbml0aW9uIG9mIE1vbmdvLkNvbGxlY3Rpb24gaGFzIGNoYW5nZWQgc2luY2UgdGhlIGpvYi1jb2xsZWN0aW9uIHBhY2thZ2Ugd2FzIGxvYWRlZC4gUGxlYXNlIGVuc3VyZSB0aGF0IGFueSBwYWNrYWdlcyB0aGF0IHJlZGVmaW5lIE1vbmdvLkNvbGxlY3Rpb24gYXJlIGxvYWRlZCBiZWZvcmUgam9iLWNvbGxlY3Rpb24uJ1xuXG4gICAgdW5sZXNzIE1vbmdvLkNvbGxlY3Rpb24gaXMgTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3JcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ1RoZSBnbG9iYWwgZGVmaW5pdGlvbiBvZiBNb25nby5Db2xsZWN0aW9uIGhhcyBiZWVuIHBhdGNoZWQgYnkgYW5vdGhlciBwYWNrYWdlLCBhbmQgdGhlIHByb3RvdHlwZSBjb25zdHJ1Y3RvciBoYXMgYmVlbiBsZWZ0IGluIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gUGxlYXNlIHNlZSB0aGlzIGxpbmsgZm9yIGEgd29ya2Fyb3VuZDogaHR0cHM6Ly9naXRodWIuY29tL3ZzaXZzaS9tZXRlb3ItZmlsZS1zYW1wbGUtYXBwL2lzc3Vlcy8yI2lzc3VlY29tbWVudC0xMjA3ODA1OTInXG5cbiAgICBAbGF0ZXIgPSBsYXRlciAgIyBsYXRlciBvYmplY3QsIGZvciBjb252ZW5pZW5jZVxuXG4gICAgb3B0aW9ucy5ub0NvbGxlY3Rpb25TdWZmaXggPz0gZmFsc2VcblxuICAgIGNvbGxlY3Rpb25OYW1lID0gQHJvb3RcblxuICAgIHVubGVzcyBvcHRpb25zLm5vQ29sbGVjdGlvblN1ZmZpeFxuICAgICAgY29sbGVjdGlvbk5hbWUgKz0gJy5qb2JzJ1xuXG4gICAgIyBSZW1vdmUgbm9uLXN0YW5kYXJkIG9wdGlvbnMgYmVmb3JlXG4gICAgIyBjYWxsaW5nIE1vbmdvLkNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBkZWxldGUgb3B0aW9ucy5ub0NvbGxlY3Rpb25TdWZmaXhcblxuICAgIEpvYi5zZXRERFAob3B0aW9ucy5jb25uZWN0aW9uLCBAcm9vdClcblxuICAgIEBfY3JlYXRlTG9nRW50cnkgPSAobWVzc2FnZSA9ICcnLCBydW5JZCA9IG51bGwsIGxldmVsID0gJ2luZm8nLCB0aW1lID0gbmV3IERhdGUoKSwgZGF0YSA9IG51bGwpIC0+XG4gICAgICBsID0geyB0aW1lOiB0aW1lLCBydW5JZDogcnVuSWQsIG1lc3NhZ2U6IG1lc3NhZ2UsIGxldmVsOiBsZXZlbCB9XG4gICAgICByZXR1cm4gbFxuXG4gICAgQF9sb2dNZXNzYWdlID1cbiAgICAgICdyZWFkaWVkJzogKCgpIC0+IEBfY3JlYXRlTG9nRW50cnkgXCJQcm9tb3RlZCB0byByZWFkeVwiKS5iaW5kKEApXG4gICAgICAnZm9yY2VkJzogKChpZCkgLT4gQF9jcmVhdGVMb2dFbnRyeSBcIkRlcGVuZGVuY2llcyBmb3JjZSByZXNvbHZlZFwiLCBudWxsLCAnd2FybmluZycpLmJpbmQoQClcbiAgICAgICdyZXJ1bic6ICgoaWQsIHJ1bklkKSAtPiBAX2NyZWF0ZUxvZ0VudHJ5IFwiUmVydW5uaW5nIGpvYlwiLCBudWxsLCAnaW5mbycsIG5ldyBEYXRlKCksIHtwcmV2aW91c0pvYjp7aWQ6aWQscnVuSWQ6cnVuSWR9fSkuYmluZChAKVxuICAgICAgJ3J1bm5pbmcnOiAoKHJ1bklkKSAtPiBAX2NyZWF0ZUxvZ0VudHJ5IFwiSm9iIFJ1bm5pbmdcIiwgcnVuSWQpLmJpbmQoQClcbiAgICAgICdwYXVzZWQnOiAoKCkgLT4gQF9jcmVhdGVMb2dFbnRyeSBcIkpvYiBQYXVzZWRcIikuYmluZChAKVxuICAgICAgJ3Jlc3VtZWQnOiAoKCkgLT4gQF9jcmVhdGVMb2dFbnRyeSBcIkpvYiBSZXN1bWVkXCIpLmJpbmQoQClcbiAgICAgICdjYW5jZWxsZWQnOiAoKCkgLT4gQF9jcmVhdGVMb2dFbnRyeSBcIkpvYiBDYW5jZWxsZWRcIiwgbnVsbCwgJ3dhcm5pbmcnKS5iaW5kKEApXG4gICAgICAncmVzdGFydGVkJzogKCgpIC0+IEBfY3JlYXRlTG9nRW50cnkgXCJKb2IgUmVzdGFydGVkXCIpLmJpbmQoQClcbiAgICAgICdyZXN1Ym1pdHRlZCc6ICgoKSAtPiBAX2NyZWF0ZUxvZ0VudHJ5IFwiSm9iIFJlc3VibWl0dGVkXCIpLmJpbmQoQClcbiAgICAgICdzdWJtaXR0ZWQnOiAoKCkgLT4gQF9jcmVhdGVMb2dFbnRyeSBcIkpvYiBTdWJtaXR0ZWRcIikuYmluZChAKVxuICAgICAgJ2NvbXBsZXRlZCc6ICgocnVuSWQpIC0+IEBfY3JlYXRlTG9nRW50cnkgXCJKb2IgQ29tcGxldGVkXCIsIHJ1bklkLCAnc3VjY2VzcycpLmJpbmQoQClcbiAgICAgICdyZXNvbHZlZCc6ICgoaWQsIHJ1bklkKSAtPiBAX2NyZWF0ZUxvZ0VudHJ5IFwiRGVwZW5kZW5jeSByZXNvbHZlZFwiLCBudWxsLCAnaW5mbycsIG5ldyBEYXRlKCksIHtkZXBlbmRlbmN5OntpZDppZCxydW5JZDpydW5JZH19KS5iaW5kKEApXG4gICAgICAnZmFpbGVkJzogKChydW5JZCwgZmF0YWwsIGVycikgLT5cbiAgICAgICAgdmFsdWUgPSBlcnIudmFsdWVcbiAgICAgICAgbXNnID0gXCJKb2IgRmFpbGVkIHdpdGgje2lmIGZhdGFsIHRoZW4gJyBGYXRhbCcgZWxzZSAnJ30gRXJyb3Ije2lmIHZhbHVlPyBhbmQgdHlwZW9mIHZhbHVlIGlzICdzdHJpbmcnIHRoZW4gJzogJyArIHZhbHVlIGVsc2UgJyd9LlwiXG4gICAgICAgIGxldmVsID0gaWYgZmF0YWwgdGhlbiAnZGFuZ2VyJyBlbHNlICd3YXJuaW5nJ1xuICAgICAgICBAX2NyZWF0ZUxvZ0VudHJ5IG1zZywgcnVuSWQsIGxldmVsKS5iaW5kKEApXG5cbiAgICAjIENhbGwgc3VwZXIncyBjb25zdHJ1Y3RvclxuICAgIHN1cGVyIGNvbGxlY3Rpb25OYW1lLCBvcHRpb25zXG5cbiAgX3ZhbGlkTnVtR1RFWmVybzogX3ZhbGlkTnVtR1RFWmVyb1xuICBfdmFsaWROdW1HVFplcm86IF92YWxpZE51bUdUWmVyb1xuICBfdmFsaWROdW1HVEVPbmU6IF92YWxpZE51bUdURU9uZVxuICBfdmFsaWRJbnRHVEVaZXJvOiBfdmFsaWRJbnRHVEVaZXJvXG4gIF92YWxpZEludEdURU9uZTogX3ZhbGlkSW50R1RFT25lXG4gIF92YWxpZFN0YXR1czogX3ZhbGlkU3RhdHVzXG4gIF92YWxpZExvZ0xldmVsOiBfdmFsaWRMb2dMZXZlbFxuICBfdmFsaWRSZXRyeUJhY2tvZmY6IF92YWxpZFJldHJ5QmFja29mZlxuICBfdmFsaWRJZDogX3ZhbGlkSWRcbiAgX3ZhbGlkTG9nOiBfdmFsaWRMb2dcbiAgX3ZhbGlkUHJvZ3Jlc3M6IF92YWxpZFByb2dyZXNzXG4gIF92YWxpZEpvYkRvYzogX3ZhbGlkSm9iRG9jXG5cbiAgam9iTG9nTGV2ZWxzOiBKb2Iuam9iTG9nTGV2ZWxzXG4gIGpvYlByaW9yaXRpZXM6IEpvYi5qb2JQcmlvcml0aWVzXG4gIGpvYlN0YXR1c2VzOiBKb2Iuam9iU3RhdHVzZXNcbiAgam9iU3RhdHVzQ2FuY2VsbGFibGU6IEpvYi5qb2JTdGF0dXNDYW5jZWxsYWJsZVxuICBqb2JTdGF0dXNQYXVzYWJsZTogSm9iLmpvYlN0YXR1c1BhdXNhYmxlXG4gIGpvYlN0YXR1c1JlbW92YWJsZTogSm9iLmpvYlN0YXR1c1JlbW92YWJsZVxuICBqb2JTdGF0dXNSZXN0YXJ0YWJsZTogSm9iLmpvYlN0YXR1c1Jlc3RhcnRhYmxlXG4gIGZvcmV2ZXI6IEpvYi5mb3JldmVyXG4gIGZvcmV2ZXJEYXRlOiBKb2IuZm9yZXZlckRhdGVcblxuICBkZHBNZXRob2RzOiBKb2IuZGRwTWV0aG9kc1xuICBkZHBQZXJtaXNzaW9uTGV2ZWxzOiBKb2IuZGRwUGVybWlzc2lvbkxldmVsc1xuICBkZHBNZXRob2RQZXJtaXNzaW9uczogSm9iLmRkcE1ldGhvZFBlcm1pc3Npb25zXG5cbiAgcHJvY2Vzc0pvYnM6IChwYXJhbXMuLi4pIC0+IG5ldyBKb2IucHJvY2Vzc0pvYnMgQHJvb3QsIHBhcmFtcy4uLlxuICBnZXRKb2I6IChwYXJhbXMuLi4pIC0+IEpvYi5nZXRKb2IgQHJvb3QsIHBhcmFtcy4uLlxuICBnZXRXb3JrOiAocGFyYW1zLi4uKSAtPiBKb2IuZ2V0V29yayBAcm9vdCwgcGFyYW1zLi4uXG4gIGdldEpvYnM6IChwYXJhbXMuLi4pIC0+IEpvYi5nZXRKb2JzIEByb290LCBwYXJhbXMuLi5cbiAgcmVhZHlKb2JzOiAocGFyYW1zLi4uKSAtPiBKb2IucmVhZHlKb2JzIEByb290LCBwYXJhbXMuLi5cbiAgY2FuY2VsSm9iczogKHBhcmFtcy4uLikgLT4gSm9iLmNhbmNlbEpvYnMgQHJvb3QsIHBhcmFtcy4uLlxuICBwYXVzZUpvYnM6IChwYXJhbXMuLi4pIC0+IEpvYi5wYXVzZUpvYnMgQHJvb3QsIHBhcmFtcy4uLlxuICByZXN1bWVKb2JzOiAocGFyYW1zLi4uKSAtPiBKb2IucmVzdW1lSm9icyBAcm9vdCwgcGFyYW1zLi4uXG4gIHJlc3RhcnRKb2JzOiAocGFyYW1zLi4uKSAtPiBKb2IucmVzdGFydEpvYnMgQHJvb3QsIHBhcmFtcy4uLlxuICByZW1vdmVKb2JzOiAocGFyYW1zLi4uKSAtPiBKb2IucmVtb3ZlSm9icyBAcm9vdCwgcGFyYW1zLi4uXG5cbiAgc2V0RERQOiAocGFyYW1zLi4uKSAtPiBKb2Iuc2V0RERQIHBhcmFtcy4uLlxuXG4gIHN0YXJ0Sm9iU2VydmVyOiAocGFyYW1zLi4uKSAtPiBKb2Iuc3RhcnRKb2JTZXJ2ZXIgQHJvb3QsIHBhcmFtcy4uLlxuICBzaHV0ZG93bkpvYlNlcnZlcjogKHBhcmFtcy4uLikgLT4gSm9iLnNodXRkb3duSm9iU2VydmVyIEByb290LCBwYXJhbXMuLi5cblxuICAjIFRoZXNlIGFyZSBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWRcbiAgc3RhcnRKb2JzOiAocGFyYW1zLi4uKSAtPiBKb2Iuc3RhcnRKb2JzIEByb290LCBwYXJhbXMuLi5cbiAgc3RvcEpvYnM6IChwYXJhbXMuLi4pIC0+IEpvYi5zdG9wSm9icyBAcm9vdCwgcGFyYW1zLi4uXG5cbiAgam9iRG9jUGF0dGVybjogX3ZhbGlkSm9iRG9jKClcblxuICAjIFdhcm5pbmcgU3R1YnMgZm9yIHNlcnZlci1vbmx5IGNhbGxzXG4gIGFsbG93OiAoKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJTZXJ2ZXItb25seSBmdW5jdGlvbiBqYy5hbGxvdygpIGludm9rZWQgb24gY2xpZW50LlwiXG4gIGRlbnk6ICgpIC0+IHRocm93IG5ldyBFcnJvciBcIlNlcnZlci1vbmx5IGZ1bmN0aW9uIGpjLmRlbnkoKSBpbnZva2VkIG9uIGNsaWVudC5cIlxuICBwcm9tb3RlOiAoKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJTZXJ2ZXItb25seSBmdW5jdGlvbiBqYy5wcm9tb3RlKCkgaW52b2tlZCBvbiBjbGllbnQuXCJcbiAgc2V0TG9nU3RyZWFtOiAoKSAtPiB0aHJvdyBuZXcgRXJyb3IgXCJTZXJ2ZXItb25seSBmdW5jdGlvbiBqYy5zZXRMb2dTdHJlYW0oKSBpbnZva2VkIG9uIGNsaWVudC5cIlxuXG4gICMgV2FybmluZyBTdHVicyBmb3IgY2xpZW50LW9ubHkgY2FsbHNcbiAgbG9nQ29uc29sZTogKCkgLT4gdGhyb3cgbmV3IEVycm9yIFwiQ2xpZW50LW9ubHkgZnVuY3Rpb24gamMubG9nQ29uc29sZSgpIGludm9rZWQgb24gc2VydmVyLlwiXG5cbiAgIyBEZXByZWNhdGVkLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uXG4gIG1ha2VKb2I6IGRvICgpIC0+XG4gICAgZGVwID0gZmFsc2VcbiAgICAocGFyYW1zLi4uKSAtPlxuICAgICAgdW5sZXNzIGRlcFxuICAgICAgICBkZXAgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIldBUk5JTkc6IGpjLm1ha2VKb2IoKSBoYXMgYmVlbiBkZXByZWNhdGVkLiBVc2UgbmV3IEpvYihqYywgZG9jKSBpbnN0ZWFkLlwiXG4gICAgICBuZXcgSm9iIEByb290LCBwYXJhbXMuLi5cblxuICAjIERlcHJlY2F0ZWQuIFJlbW92ZSBpbiBuZXh0IG1ham9yIHZlcnNpb25cbiAgY3JlYXRlSm9iOiBkbyAoKSAtPlxuICAgIGRlcCA9IGZhbHNlXG4gICAgKHBhcmFtcy4uLikgLT5cbiAgICAgIHVubGVzcyBkZXBcbiAgICAgICAgZGVwID0gdHJ1ZVxuICAgICAgICBjb25zb2xlLndhcm4gXCJXQVJOSU5HOiBqYy5jcmVhdGVKb2IoKSBoYXMgYmVlbiBkZXByZWNhdGVkLiBVc2UgbmV3IEpvYihqYywgdHlwZSwgZGF0YSkgaW5zdGVhZC5cIlxuICAgICAgbmV3IEpvYiBAcm9vdCwgcGFyYW1zLi4uXG5cbiAgX21ldGhvZFdyYXBwZXI6IChtZXRob2QsIGZ1bmMpIC0+XG4gICAgdG9Mb2cgPSBAX3RvTG9nXG4gICAgdW5ibG9ja0REUE1ldGhvZHMgPSBAX3VuYmxvY2tERFBNZXRob2RzID8gZmFsc2VcbiAgICAjIFJldHVybiB0aGUgd3JhcHBlciBmdW5jdGlvbiB0aGF0IHRoZSBNZXRlb3IgbWV0aG9kIHdpbGwgYWN0dWFsbHkgaW52b2tlXG4gICAgcmV0dXJuIChwYXJhbXMuLi4pIC0+XG4gICAgICB1c2VyID0gdGhpcy51c2VySWQgPyBcIltVTkFVVEhFTlRJQ0FURURdXCJcbiAgICAgIHRvTG9nIHVzZXIsIG1ldGhvZCwgXCJwYXJhbXM6IFwiICsgSlNPTi5zdHJpbmdpZnkocGFyYW1zKVxuICAgICAgdGhpcy51bmJsb2NrKCkgaWYgdW5ibG9ja0REUE1ldGhvZHNcbiAgICAgIHJldHZhbCA9IGZ1bmMocGFyYW1zLi4uKVxuICAgICAgdG9Mb2cgdXNlciwgbWV0aG9kLCBcInJldHVybmVkOiBcIiArIEpTT04uc3RyaW5naWZ5KHJldHZhbClcbiAgICAgIHJldHVybiByZXR2YWxcblxuICBfZ2VuZXJhdGVNZXRob2RzOiAoKSAtPlxuICAgIG1ldGhvZHNPdXQgPSB7fVxuICAgIG1ldGhvZFByZWZpeCA9ICdfRERQTWV0aG9kXydcbiAgICBmb3IgbWV0aG9kTmFtZSwgbWV0aG9kRnVuYyBvZiBAIHdoZW4gbWV0aG9kTmFtZVswLi4ubWV0aG9kUHJlZml4Lmxlbmd0aF0gaXMgbWV0aG9kUHJlZml4XG4gICAgICBiYXNlTWV0aG9kTmFtZSA9IG1ldGhvZE5hbWVbbWV0aG9kUHJlZml4Lmxlbmd0aC4uXVxuICAgICAgbWV0aG9kc091dFtcIiN7QHJvb3R9XyN7YmFzZU1ldGhvZE5hbWV9XCJdID0gQF9tZXRob2RXcmFwcGVyKGJhc2VNZXRob2ROYW1lLCBtZXRob2RGdW5jLmJpbmQoQCkpXG4gICAgcmV0dXJuIG1ldGhvZHNPdXRcblxuICBfaWRzT2ZEZXBzOiAoaWRzLCBhbnRlY2VkZW50cywgZGVwZW5kZW50cywgam9iU3RhdHVzZXMpIC0+XG4gICAgIyBDYW5jZWwgdGhlIGVudGlyZSB0cmVlIG9mIGFudGVjZWRlbnRzIGFuZC9vciBkZXBlbmRlbnRzXG4gICAgIyBEZXBlbmRlbnRzOiBqb2JzIHRoYXQgbGlzdCBvbmUgb2YgdGhlIGlkcyBpbiB0aGVpciBkZXBlbmRzIGxpc3RcbiAgICAjIEFudGVjZWRlbnRzOiBqb2JzIHdpdGggYW4gaWQgbGlzdGVkIGluIHRoZSBkZXBlbmRzIGxpc3Qgb2Ygb25lIG9mIHRoZSBqb2JzIGluIGlkc1xuICAgIGRlcGVuZHNRdWVyeSA9IFtdXG4gICAgaWYgZGVwZW5kZW50c1xuICAgICAgZGVwZW5kc1F1ZXJ5LnB1c2hcbiAgICAgICAgZGVwZW5kczpcbiAgICAgICAgICAkZWxlbU1hdGNoOlxuICAgICAgICAgICAgJGluOiBpZHNcbiAgICBpZiBhbnRlY2VkZW50c1xuICAgICAgYW50c0FycmF5ID0gW11cbiAgICAgIEBmaW5kKFxuICAgICAgICB7XG4gICAgICAgICAgX2lkOlxuICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgZmllbGRzOlxuICAgICAgICAgICAgZGVwZW5kczogMVxuICAgICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgICB9XG4gICAgICApLmZvckVhY2ggKGQpIC0+IGFudHNBcnJheS5wdXNoKGkpIGZvciBpIGluIGQuZGVwZW5kcyB1bmxlc3MgaSBpbiBhbnRzQXJyYXlcbiAgICAgIGlmIGFudHNBcnJheS5sZW5ndGggPiAwXG4gICAgICAgIGRlcGVuZHNRdWVyeS5wdXNoXG4gICAgICAgICAgX2lkOlxuICAgICAgICAgICAgJGluOiBhbnRzQXJyYXlcbiAgICBpZiBkZXBlbmRzUXVlcnlcbiAgICAgIGRlcGVuZHNJZHMgPSBbXVxuICAgICAgQGZpbmQoXG4gICAgICAgIHtcbiAgICAgICAgICBzdGF0dXM6XG4gICAgICAgICAgICAkaW46IGpvYlN0YXR1c2VzXG4gICAgICAgICAgJG9yOiBkZXBlbmRzUXVlcnlcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgZmllbGRzOlxuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgICAgIH1cbiAgICAgICkuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgZGVwZW5kc0lkcy5wdXNoIGQuX2lkIHVubGVzcyBkLl9pZCBpbiBkZXBlbmRzSWRzXG4gICAgcmV0dXJuIGRlcGVuZHNJZHNcblxuICBfcmVydW5fam9iOiAoZG9jLCByZXBlYXRzID0gZG9jLnJlcGVhdHMgLSAxLCB3YWl0ID0gZG9jLnJlcGVhdFdhaXQsIHJlcGVhdFVudGlsID0gZG9jLnJlcGVhdFVudGlsKSAtPlxuICAgICMgUmVwZWF0PyBpZiBzbywgbWFrZSBhIG5ldyBqb2IgZnJvbSB0aGUgb2xkIG9uZVxuICAgIGlkID0gZG9jLl9pZFxuICAgIHJ1bklkID0gZG9jLnJ1bklkXG4gICAgdGltZSA9IG5ldyBEYXRlKClcbiAgICBkZWxldGUgZG9jLl9pZFxuICAgIGRlbGV0ZSBkb2MucmVzdWx0XG4gICAgZGVsZXRlIGRvYy5mYWlsdXJlc1xuICAgIGRlbGV0ZSBkb2MuZXhwaXJlc0FmdGVyXG4gICAgZGVsZXRlIGRvYy53b3JrVGltZW91dFxuICAgIGRvYy5ydW5JZCA9IG51bGxcbiAgICBkb2Muc3RhdHVzID0gXCJ3YWl0aW5nXCJcbiAgICBkb2MucmVwZWF0UmV0cmllcyA9IGlmIGRvYy5yZXBlYXRSZXRyaWVzPyB0aGVuIGRvYy5yZXBlYXRSZXRyaWVzIGVsc2UgZG9jLnJldHJpZXMgKyBkb2MucmV0cmllZFxuICAgIGRvYy5yZXRyaWVzID0gZG9jLnJlcGVhdFJldHJpZXNcbiAgICBkb2MucmV0cmllcyA9IEBmb3JldmVyIGlmIGRvYy5yZXRyaWVzID4gQGZvcmV2ZXJcbiAgICBkb2MucmV0cnlVbnRpbCA9IHJlcGVhdFVudGlsXG4gICAgZG9jLnJldHJpZWQgPSAwXG4gICAgZG9jLnJlcGVhdHMgPSByZXBlYXRzXG4gICAgZG9jLnJlcGVhdHMgPSBAZm9yZXZlciBpZiBkb2MucmVwZWF0cyA+IEBmb3JldmVyXG4gICAgZG9jLnJlcGVhdFVudGlsID0gcmVwZWF0VW50aWxcbiAgICBkb2MucmVwZWF0ZWQgPSBkb2MucmVwZWF0ZWQgKyAxXG4gICAgZG9jLnVwZGF0ZWQgPSB0aW1lXG4gICAgZG9jLmNyZWF0ZWQgPSB0aW1lXG4gICAgZG9jLnByb2dyZXNzID1cbiAgICAgIGNvbXBsZXRlZDogMFxuICAgICAgdG90YWw6IDFcbiAgICAgIHBlcmNlbnQ6IDBcbiAgICBpZiBsb2dPYmogPSBAX2xvZ01lc3NhZ2UucmVydW4gaWQsIHJ1bklkXG4gICAgICBkb2MubG9nID0gW2xvZ09ial1cbiAgICBlbHNlXG4gICAgICBkb2MubG9nID0gW11cblxuICAgIGRvYy5hZnRlciA9IG5ldyBEYXRlKHRpbWUudmFsdWVPZigpICsgd2FpdClcbiAgICBpZiBqb2JJZCA9IEBpbnNlcnQgZG9jXG4gICAgICBAX0REUE1ldGhvZF9qb2JSZWFkeSBqb2JJZFxuICAgICAgcmV0dXJuIGpvYklkXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuIFwiSm9iIHJlcnVuL3JlcGVhdCBmYWlsZWQgdG8gcmVzY2hlZHVsZSFcIiwgaWQsIHJ1bklkXG4gICAgcmV0dXJuIG51bGxcblxuICBfRERQTWV0aG9kX3N0YXJ0Sm9iU2VydmVyOiAob3B0aW9ucykgLT5cbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbCB7fVxuICAgIG9wdGlvbnMgPz0ge31cbiAgICAjIFRoZSBjbGllbnQgY2FuJ3QgYWN0dWFsbHkgZG8gdGhpcywgc28gc2tpcCBpdFxuICAgIHVubGVzcyBAaXNTaW11bGF0aW9uXG4gICAgICBNZXRlb3IuY2xlYXJUaW1lb3V0KEBzdG9wcGVkKSBpZiBAc3RvcHBlZCBhbmQgQHN0b3BwZWQgaXNudCB0cnVlXG4gICAgICBAc3RvcHBlZCA9IGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBfRERQTWV0aG9kX3N0YXJ0Sm9iczogZG8gKCkgPT5cbiAgICBkZXBGbGFnID0gZmFsc2VcbiAgICAob3B0aW9ucykgLT5cbiAgICAgIHVubGVzcyBkZXBGbGFnXG4gICAgICAgIGRlcEZsYWcgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIkRlcHJlY2F0aW9uIFdhcm5pbmc6IGpjLnN0YXJ0Sm9icygpIGhhcyBiZWVuIHJlbmFtZWQgdG8gamMuc3RhcnRKb2JTZXJ2ZXIoKVwiXG4gICAgICByZXR1cm4gQF9ERFBNZXRob2Rfc3RhcnRKb2JTZXJ2ZXIgb3B0aW9uc1xuXG4gIF9ERFBNZXRob2Rfc2h1dGRvd25Kb2JTZXJ2ZXI6IChvcHRpb25zKSAtPlxuICAgIGNoZWNrIG9wdGlvbnMsIE1hdGNoLk9wdGlvbmFsXG4gICAgICB0aW1lb3V0OiBNYXRjaC5PcHRpb25hbChNYXRjaC5XaGVyZSBfdmFsaWRJbnRHVEVPbmUpXG4gICAgb3B0aW9ucyA/PSB7fVxuICAgIG9wdGlvbnMudGltZW91dCA/PSA2MCoxMDAwXG5cbiAgICAjIFRoZSBjbGllbnQgY2FuJ3QgYWN0dWFsbHkgZG8gYW55IG9mIHRoaXMsIHNvIHNraXAgaXRcbiAgICB1bmxlc3MgQGlzU2ltdWxhdGlvblxuICAgICAgTWV0ZW9yLmNsZWFyVGltZW91dChAc3RvcHBlZCkgaWYgQHN0b3BwZWQgYW5kIEBzdG9wcGVkIGlzbnQgdHJ1ZVxuICAgICAgQHN0b3BwZWQgPSBNZXRlb3Iuc2V0VGltZW91dChcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICBjdXJzb3IgPSBAZmluZChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAncnVubmluZydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICBmYWlsZWRKb2JzID0gY3Vyc29yLmNvdW50KClcbiAgICAgICAgICBjb25zb2xlLndhcm4gXCJGYWlsaW5nICN7ZmFpbGVkSm9ic30gam9icyBvbiBxdWV1ZSBzdG9wLlwiIGlmIGZhaWxlZEpvYnMgaXNudCAwXG4gICAgICAgICAgY3Vyc29yLmZvckVhY2ggKGQpID0+IEBfRERQTWV0aG9kX2pvYkZhaWwgZC5faWQsIGQucnVuSWQsIFwiUnVubmluZyBhdCBKb2IgU2VydmVyIHNodXRkb3duLlwiXG4gICAgICAgICAgaWYgQGxvZ1N0cmVhbT8gIyBTaHV0dGluZyBkb3duIGNsb3NlcyB0aGUgbG9nU3RyZWFtIVxuICAgICAgICAgICAgQGxvZ1N0cmVhbS5lbmQoKVxuICAgICAgICAgICAgQGxvZ1N0cmVhbSA9IG51bGxcbiAgICAgICAgb3B0aW9ucy50aW1lb3V0XG4gICAgICApXG4gICAgcmV0dXJuIHRydWVcblxuICBfRERQTWV0aG9kX3N0b3BKb2JzOiBkbyAoKSA9PlxuICAgIGRlcEZsYWcgPSBmYWxzZVxuICAgIChvcHRpb25zKSAtPlxuICAgICAgdW5sZXNzIGRlcEZsYWdcbiAgICAgICAgZGVwRmxhZyA9IHRydWVcbiAgICAgICAgY29uc29sZS53YXJuIFwiRGVwcmVjYXRpb24gV2FybmluZzogamMuc3RvcEpvYnMoKSBoYXMgYmVlbiByZW5hbWVkIHRvIGpjLnNodXRkb3duSm9iU2VydmVyKClcIlxuICAgICAgcmV0dXJuIEBfRERQTWV0aG9kX3NodXRkb3duSm9iU2VydmVyIG9wdGlvbnNcblxuICBfRERQTWV0aG9kX2dldEpvYjogKGlkcywgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZHMsIE1hdGNoLk9uZU9mKE1hdGNoLldoZXJlKF92YWxpZElkKSwgWyBNYXRjaC5XaGVyZShfdmFsaWRJZCkgXSlcbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbFxuICAgICAgZ2V0TG9nOiBNYXRjaC5PcHRpb25hbCBCb29sZWFuXG4gICAgICBnZXRGYWlsdXJlczogTWF0Y2guT3B0aW9uYWwgQm9vbGVhblxuICAgIG9wdGlvbnMgPz0ge31cbiAgICBvcHRpb25zLmdldExvZyA/PSBmYWxzZVxuICAgIG9wdGlvbnMuZ2V0RmFpbHVyZXMgPz0gZmFsc2VcbiAgICBzaW5nbGUgPSBmYWxzZVxuICAgIGlmIF92YWxpZElkKGlkcylcbiAgICAgIGlkcyA9IFtpZHNdXG4gICAgICBzaW5nbGUgPSB0cnVlXG4gICAgcmV0dXJuIG51bGwgaWYgaWRzLmxlbmd0aCBpcyAwXG4gICAgZmllbGRzID0ge19wcml2YXRlOjB9XG4gICAgZmllbGRzLmxvZyA9IDAgaWYgIW9wdGlvbnMuZ2V0TG9nXG4gICAgZmllbGRzLmZhaWx1cmVzID0gMCBpZiAhb3B0aW9ucy5nZXRGYWlsdXJlc1xuICAgIGRvY3MgPSBAZmluZChcbiAgICAgIHtcbiAgICAgICAgX2lkOlxuICAgICAgICAgICRpbjogaWRzXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgfVxuICAgICkuZmV0Y2goKVxuICAgIGlmIGRvY3M/Lmxlbmd0aFxuICAgICAgaWYgQHNjcnViP1xuICAgICAgICBkb2NzID0gKEBzY3J1YiBkIGZvciBkIGluIGRvY3MpXG4gICAgICBjaGVjayBkb2NzLCBbX3ZhbGlkSm9iRG9jKCldXG4gICAgICBpZiBzaW5nbGVcbiAgICAgICAgcmV0dXJuIGRvY3NbMF1cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGRvY3NcbiAgICByZXR1cm4gbnVsbFxuXG4gIF9ERFBNZXRob2RfZ2V0V29yazogKHR5cGUsIG9wdGlvbnMpIC0+XG4gICAgY2hlY2sgdHlwZSwgTWF0Y2guT25lT2YgU3RyaW5nLCBbIFN0cmluZyBdXG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWxcbiAgICAgIG1heEpvYnM6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLldoZXJlIF92YWxpZEludEdURU9uZSlcbiAgICAgIHdvcmtUaW1lb3V0OiBNYXRjaC5PcHRpb25hbChNYXRjaC5XaGVyZSBfdmFsaWRJbnRHVEVPbmUpXG5cbiAgICAjIERvbid0IHNpbXVsYXRlIGdldFdvcmshXG4gICAgaWYgQGlzU2ltdWxhdGlvblxuICAgICAgcmV0dXJuXG5cbiAgICBvcHRpb25zID89IHt9XG4gICAgb3B0aW9ucy5tYXhKb2JzID89IDFcbiAgICAjIERvbid0IHB1dCBvdXQgYW55IG1vcmUgam9icyB3aGlsZSBzaHV0dGluZyBkb3duXG4gICAgaWYgQHN0b3BwZWRcbiAgICAgIHJldHVybiBbXVxuXG4gICAgIyBTdXBwb3J0IHN0cmluZyB0eXBlcyBvciBhcnJheXMgb2Ygc3RyaW5nIHR5cGVzXG4gICAgaWYgdHlwZW9mIHR5cGUgaXMgJ3N0cmluZydcbiAgICAgIHR5cGUgPSBbIHR5cGUgXVxuICAgIHRpbWUgPSBuZXcgRGF0ZSgpXG4gICAgZG9jcyA9IFtdXG4gICAgcnVuSWQgPSBAX21ha2VOZXdJRCgpICMgVGhpcyBpcyBtZXRlb3IgaW50ZXJuYWwsIGJ1dCBpdCB3aWxsIGZhaWwgaGFyZCBpZiBpdCBnb2VzIGF3YXkuXG5cbiAgICB3aGlsZSBkb2NzLmxlbmd0aCA8IG9wdGlvbnMubWF4Sm9ic1xuXG4gICAgICBpZHMgPSBAZmluZChcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6XG4gICAgICAgICAgICAkaW46IHR5cGVcbiAgICAgICAgICBzdGF0dXM6ICdyZWFkeSdcbiAgICAgICAgICBydW5JZDogbnVsbFxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICBzb3J0OlxuICAgICAgICAgICAgcHJpb3JpdHk6IDFcbiAgICAgICAgICAgIHJldHJ5VW50aWw6IDFcbiAgICAgICAgICAgIGFmdGVyOiAxXG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnMubWF4Sm9icyAtIGRvY3MubGVuZ3RoICMgbmV2ZXIgYXNrIGZvciBtb3JlIHRoYW4gaXMgbmVlZGVkXG4gICAgICAgICAgZmllbGRzOlxuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgICAgIH0pLm1hcCAoZCkgLT4gZC5faWRcblxuICAgICAgdW5sZXNzIGlkcz8ubGVuZ3RoID4gMFxuICAgICAgICBicmVhayAgIyBEb24ndCBrZWVwIGxvb3Bpbmcgd2hlbiB0aGVyZSdzIG5vIGF2YWlsYWJsZSB3b3JrXG5cbiAgICAgIG1vZHMgPVxuICAgICAgICAkc2V0OlxuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnXG4gICAgICAgICAgcnVuSWQ6IHJ1bklkXG4gICAgICAgICAgdXBkYXRlZDogdGltZVxuICAgICAgICAkaW5jOlxuICAgICAgICAgIHJldHJpZXM6IC0xXG4gICAgICAgICAgcmV0cmllZDogMVxuXG4gICAgICBpZiBsb2dPYmogPSBAX2xvZ01lc3NhZ2UucnVubmluZyBydW5JZFxuICAgICAgICBtb2RzLiRwdXNoID1cbiAgICAgICAgICBsb2c6IGxvZ09ialxuXG4gICAgICBpZiBvcHRpb25zLndvcmtUaW1lb3V0P1xuICAgICAgICBtb2RzLiRzZXQud29ya1RpbWVvdXQgPSBvcHRpb25zLndvcmtUaW1lb3V0XG4gICAgICAgIG1vZHMuJHNldC5leHBpcmVzQWZ0ZXIgPSBuZXcgRGF0ZSh0aW1lLnZhbHVlT2YoKSArIG9wdGlvbnMud29ya1RpbWVvdXQpXG4gICAgICBlbHNlXG4gICAgICAgIG1vZHMuJHVuc2V0ID89IHt9XG4gICAgICAgIG1vZHMuJHVuc2V0LndvcmtUaW1lb3V0ID0gXCJcIlxuICAgICAgICBtb2RzLiR1bnNldC5leHBpcmVzQWZ0ZXIgPSBcIlwiXG5cbiAgICAgIG51bSA9IEB1cGRhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICBfaWQ6XG4gICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIHN0YXR1czogJ3JlYWR5J1xuICAgICAgICAgIHJ1bklkOiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgbW9kc1xuICAgICAgICB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgICAgKVxuXG4gICAgICBpZiBudW0gPiAwXG4gICAgICAgIGZvdW5kRG9jcyA9IEBmaW5kKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIF9pZDpcbiAgICAgICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgICAgIHJ1bklkOiBydW5JZFxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZHM6XG4gICAgICAgICAgICAgIGxvZzogMFxuICAgICAgICAgICAgICBmYWlsdXJlczogMFxuICAgICAgICAgICAgICBfcHJpdmF0ZTogMFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICApLmZldGNoKClcblxuICAgICAgICBpZiBmb3VuZERvY3M/Lmxlbmd0aCA+IDBcbiAgICAgICAgICBpZiBAc2NydWI/XG4gICAgICAgICAgICBmb3VuZERvY3MgPSAoQHNjcnViIGQgZm9yIGQgaW4gZm91bmREb2NzKVxuICAgICAgICAgIGNoZWNrIGRvY3MsIFsgX3ZhbGlkSm9iRG9jKCkgXVxuICAgICAgICAgIGRvY3MgPSBkb2NzLmNvbmNhdCBmb3VuZERvY3NcbiAgICAgICAgIyBlbHNlXG4gICAgICAgICMgICBjb25zb2xlLndhcm4gXCJnZXRXb3JrOiBmaW5kIGFmdGVyIHVwZGF0ZSBmYWlsZWRcIlxuICAgIHJldHVybiBkb2NzXG5cbiAgX0REUE1ldGhvZF9qb2JSZW1vdmU6IChpZHMsIG9wdGlvbnMpIC0+XG4gICAgY2hlY2sgaWRzLCBNYXRjaC5PbmVPZihNYXRjaC5XaGVyZShfdmFsaWRJZCksIFsgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpIF0pXG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWwge31cbiAgICBvcHRpb25zID89IHt9XG4gICAgaWYgX3ZhbGlkSWQoaWRzKVxuICAgICAgaWRzID0gW2lkc11cbiAgICByZXR1cm4gZmFsc2UgaWYgaWRzLmxlbmd0aCBpcyAwXG4gICAgbnVtID0gQHJlbW92ZShcbiAgICAgIHtcbiAgICAgICAgX2lkOlxuICAgICAgICAgICRpbjogaWRzXG4gICAgICAgIHN0YXR1czpcbiAgICAgICAgICAkaW46IEBqb2JTdGF0dXNSZW1vdmFibGVcbiAgICAgIH1cbiAgICApXG4gICAgaWYgbnVtID4gMFxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gXCJqb2JSZW1vdmUgZmFpbGVkXCJcbiAgICByZXR1cm4gZmFsc2VcblxuICBfRERQTWV0aG9kX2pvYlBhdXNlOiAoaWRzLCBvcHRpb25zKSAtPlxuICAgIGNoZWNrIGlkcywgTWF0Y2guT25lT2YoTWF0Y2guV2hlcmUoX3ZhbGlkSWQpLCBbIE1hdGNoLldoZXJlKF92YWxpZElkKSBdKVxuICAgIGNoZWNrIG9wdGlvbnMsIE1hdGNoLk9wdGlvbmFsIHt9XG4gICAgb3B0aW9ucyA/PSB7fVxuICAgIGlmIF92YWxpZElkKGlkcylcbiAgICAgIGlkcyA9IFtpZHNdXG4gICAgcmV0dXJuIGZhbHNlIGlmIGlkcy5sZW5ndGggaXMgMFxuICAgIHRpbWUgPSBuZXcgRGF0ZSgpXG5cbiAgICBtb2RzID1cbiAgICAgICRzZXQ6XG4gICAgICAgIHN0YXR1czogXCJwYXVzZWRcIlxuICAgICAgICB1cGRhdGVkOiB0aW1lXG5cbiAgICBpZiBsb2dPYmogPSBAX2xvZ01lc3NhZ2UucGF1c2VkKClcbiAgICAgIG1vZHMuJHB1c2ggPVxuICAgICAgICBsb2c6IGxvZ09ialxuXG4gICAgbnVtID0gQHVwZGF0ZShcbiAgICAgIHtcbiAgICAgICAgX2lkOlxuICAgICAgICAgICRpbjogaWRzXG4gICAgICAgIHN0YXR1czpcbiAgICAgICAgICAkaW46IEBqb2JTdGF0dXNQYXVzYWJsZVxuICAgICAgfVxuICAgICAgbW9kc1xuICAgICAge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfVxuICAgIClcbiAgICBpZiBudW0gPiAwXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiBcImpvYlBhdXNlIGZhaWxlZFwiXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX0REUE1ldGhvZF9qb2JSZXN1bWU6IChpZHMsIG9wdGlvbnMpIC0+XG4gICAgY2hlY2sgaWRzLCBNYXRjaC5PbmVPZihNYXRjaC5XaGVyZShfdmFsaWRJZCksIFsgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpIF0pXG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWwge31cbiAgICBvcHRpb25zID89IHt9XG4gICAgaWYgX3ZhbGlkSWQoaWRzKVxuICAgICAgaWRzID0gW2lkc11cbiAgICByZXR1cm4gZmFsc2UgaWYgaWRzLmxlbmd0aCBpcyAwXG4gICAgdGltZSA9IG5ldyBEYXRlKClcbiAgICBtb2RzID1cbiAgICAgICRzZXQ6XG4gICAgICAgIHN0YXR1czogXCJ3YWl0aW5nXCJcbiAgICAgICAgdXBkYXRlZDogdGltZVxuXG4gICAgaWYgbG9nT2JqID0gQF9sb2dNZXNzYWdlLnJlc3VtZWQoKVxuICAgICAgbW9kcy4kcHVzaCA9XG4gICAgICAgIGxvZzogbG9nT2JqXG5cbiAgICBudW0gPSBAdXBkYXRlKFxuICAgICAge1xuICAgICAgICBfaWQ6XG4gICAgICAgICAgJGluOiBpZHNcbiAgICAgICAgc3RhdHVzOiBcInBhdXNlZFwiXG4gICAgICAgIHVwZGF0ZWQ6XG4gICAgICAgICAgJG5lOiB0aW1lXG4gICAgICB9XG4gICAgICBtb2RzXG4gICAgICB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9XG4gICAgKVxuICAgIGlmIG51bSA+IDBcbiAgICAgIEBfRERQTWV0aG9kX2pvYlJlYWR5IGlkc1xuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gXCJqb2JSZXN1bWUgZmFpbGVkXCJcbiAgICByZXR1cm4gZmFsc2VcblxuICBfRERQTWV0aG9kX2pvYlJlYWR5OiAoaWRzLCBvcHRpb25zKSAtPlxuICAgIGNoZWNrIGlkcywgTWF0Y2guT25lT2YoTWF0Y2guV2hlcmUoX3ZhbGlkSWQpLCBbIE1hdGNoLldoZXJlKF92YWxpZElkKSBdKVxuICAgIGNoZWNrIG9wdGlvbnMsIE1hdGNoLk9wdGlvbmFsXG4gICAgICBmb3JjZTogTWF0Y2guT3B0aW9uYWwgQm9vbGVhblxuICAgICAgdGltZTogTWF0Y2guT3B0aW9uYWwgRGF0ZVxuXG4gICAgIyBEb24ndCBzaW11bGF0ZSBqb2JSZWFkeS4gSXQgaGFzIGEgc3Ryb25nIGNoYW5jZSBvZiBjYXVzaW5nIGlzc3VlcyB3aXRoXG4gICAgIyBNZXRlb3Igb24gdGhlIGNsaWVudCwgcGFydGljdWxhcmx5IGlmIGFuIG9ic2VydmVDaGFuZ2VzKCkgaXMgdHJpZ2dlcmluZ1xuICAgICMgYSBwcm9jZXNzSm9icyBxdWV1ZSAod2hpY2ggaW4gdHVybiBzZXRzIHRpbWVycy4pXG4gICAgaWYgQGlzU2ltdWxhdGlvblxuICAgICAgcmV0dXJuXG5cbiAgICBub3cgPSBuZXcgRGF0ZSgpXG5cbiAgICBvcHRpb25zID89IHt9XG4gICAgb3B0aW9ucy5mb3JjZSA/PSBmYWxzZVxuICAgIG9wdGlvbnMudGltZSA/PSBub3dcblxuICAgIGlmIF92YWxpZElkKGlkcylcbiAgICAgIGlkcyA9IFtpZHNdXG5cbiAgICBxdWVyeSA9XG4gICAgICBzdGF0dXM6IFwid2FpdGluZ1wiXG4gICAgICBhZnRlcjpcbiAgICAgICAgJGx0ZTogb3B0aW9ucy50aW1lXG5cbiAgICBtb2RzID1cbiAgICAgICRzZXQ6XG4gICAgICAgIHN0YXR1czogXCJyZWFkeVwiXG4gICAgICAgIHVwZGF0ZWQ6IG5vd1xuXG4gICAgaWYgaWRzLmxlbmd0aCA+IDBcbiAgICAgIHF1ZXJ5Ll9pZCA9XG4gICAgICAgICRpbjogaWRzXG4gICAgICBtb2RzLiRzZXQuYWZ0ZXIgPSBub3dcblxuICAgIGxvZ09iaiA9IFtdXG5cbiAgICBpZiBvcHRpb25zLmZvcmNlXG4gICAgICBtb2RzLiRzZXQuZGVwZW5kcyA9IFtdICAjIERvbid0IG1vdmUgdG8gcmVzb2x2ZWQsIGJlY2F1c2UgdGhleSB3ZXJlbid0IVxuICAgICAgbCA9IEBfbG9nTWVzc2FnZS5mb3JjZWQoKVxuICAgICAgbG9nT2JqLnB1c2ggbCBpZiBsXG4gICAgZWxzZVxuICAgICAgcXVlcnkuZGVwZW5kcyA9XG4gICAgICAgICRzaXplOiAwXG5cbiAgICBsID0gQF9sb2dNZXNzYWdlLnJlYWRpZWQoKVxuICAgIGxvZ09iai5wdXNoIGwgaWYgbFxuXG4gICAgaWYgbG9nT2JqLmxlbmd0aCA+IDBcbiAgICAgIG1vZHMuJHB1c2ggPVxuICAgICAgICBsb2c6XG4gICAgICAgICAgJGVhY2g6IGxvZ09ialxuXG4gICAgbnVtID0gQHVwZGF0ZShcbiAgICAgIHF1ZXJ5XG4gICAgICBtb2RzXG4gICAgICB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9XG4gICAgKVxuXG4gICAgaWYgbnVtID4gMFxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBfRERQTWV0aG9kX2pvYkNhbmNlbDogKGlkcywgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZHMsIE1hdGNoLk9uZU9mKE1hdGNoLldoZXJlKF92YWxpZElkKSwgWyBNYXRjaC5XaGVyZShfdmFsaWRJZCkgXSlcbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbFxuICAgICAgYW50ZWNlZGVudHM6IE1hdGNoLk9wdGlvbmFsIEJvb2xlYW5cbiAgICAgIGRlcGVuZGVudHM6IE1hdGNoLk9wdGlvbmFsIEJvb2xlYW5cbiAgICBvcHRpb25zID89IHt9XG4gICAgb3B0aW9ucy5hbnRlY2VkZW50cyA/PSBmYWxzZVxuICAgIG9wdGlvbnMuZGVwZW5kZW50cyA/PSB0cnVlXG4gICAgaWYgX3ZhbGlkSWQoaWRzKVxuICAgICAgaWRzID0gW2lkc11cbiAgICByZXR1cm4gZmFsc2UgaWYgaWRzLmxlbmd0aCBpcyAwXG4gICAgdGltZSA9IG5ldyBEYXRlKClcblxuICAgIG1vZHMgPVxuICAgICAgJHNldDpcbiAgICAgICAgc3RhdHVzOiBcImNhbmNlbGxlZFwiXG4gICAgICAgIHJ1bklkOiBudWxsXG4gICAgICAgIHByb2dyZXNzOlxuICAgICAgICAgIGNvbXBsZXRlZDogMFxuICAgICAgICAgIHRvdGFsOiAxXG4gICAgICAgICAgcGVyY2VudDogMFxuICAgICAgICB1cGRhdGVkOiB0aW1lXG5cbiAgICBpZiBsb2dPYmogPSBAX2xvZ01lc3NhZ2UuY2FuY2VsbGVkKClcbiAgICAgIG1vZHMuJHB1c2ggPVxuICAgICAgICBsb2c6IGxvZ09ialxuXG4gICAgbnVtID0gQHVwZGF0ZShcbiAgICAgIHtcbiAgICAgICAgX2lkOlxuICAgICAgICAgICRpbjogaWRzXG4gICAgICAgIHN0YXR1czpcbiAgICAgICAgICAkaW46IEBqb2JTdGF0dXNDYW5jZWxsYWJsZVxuICAgICAgfVxuICAgICAgbW9kc1xuICAgICAge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfVxuICAgIClcbiAgICAjIENhbmNlbCB0aGUgZW50aXJlIHRyZWUgb2YgZGVwZW5kZW50c1xuICAgIGNhbmNlbElkcyA9IEBfaWRzT2ZEZXBzIGlkcywgb3B0aW9ucy5hbnRlY2VkZW50cywgb3B0aW9ucy5kZXBlbmRlbnRzLCBAam9iU3RhdHVzQ2FuY2VsbGFibGVcblxuICAgIGRlcHNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIGlmIGNhbmNlbElkcy5sZW5ndGggPiAwXG4gICAgICBkZXBzQ2FuY2VsbGVkID0gQF9ERFBNZXRob2Rfam9iQ2FuY2VsIGNhbmNlbElkcywgb3B0aW9uc1xuXG4gICAgaWYgbnVtID4gMCBvciBkZXBzQ2FuY2VsbGVkXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiBcImpvYkNhbmNlbCBmYWlsZWRcIlxuICAgIHJldHVybiBmYWxzZVxuXG4gIF9ERFBNZXRob2Rfam9iUmVzdGFydDogKGlkcywgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZHMsIE1hdGNoLk9uZU9mKE1hdGNoLldoZXJlKF92YWxpZElkKSwgWyBNYXRjaC5XaGVyZShfdmFsaWRJZCkgXSlcbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbFxuICAgICAgcmV0cmllczogTWF0Y2guT3B0aW9uYWwoTWF0Y2guV2hlcmUgX3ZhbGlkSW50R1RFWmVybylcbiAgICAgIHVudGlsOiBNYXRjaC5PcHRpb25hbCBEYXRlXG4gICAgICBhbnRlY2VkZW50czogTWF0Y2guT3B0aW9uYWwgQm9vbGVhblxuICAgICAgZGVwZW5kZW50czogTWF0Y2guT3B0aW9uYWwgQm9vbGVhblxuICAgIG9wdGlvbnMgPz0ge31cbiAgICBvcHRpb25zLnJldHJpZXMgPz0gMVxuICAgIG9wdGlvbnMucmV0cmllcyA9IEBmb3JldmVyIGlmIG9wdGlvbnMucmV0cmllcyA+IEBmb3JldmVyXG4gICAgb3B0aW9ucy5kZXBlbmRlbnRzID89IGZhbHNlXG4gICAgb3B0aW9ucy5hbnRlY2VkZW50cyA/PSB0cnVlXG4gICAgaWYgX3ZhbGlkSWQoaWRzKVxuICAgICAgaWRzID0gW2lkc11cbiAgICByZXR1cm4gZmFsc2UgaWYgaWRzLmxlbmd0aCBpcyAwXG4gICAgdGltZSA9IG5ldyBEYXRlKClcblxuICAgIHF1ZXJ5ID1cbiAgICAgIF9pZDpcbiAgICAgICAgJGluOiBpZHNcbiAgICAgIHN0YXR1czpcbiAgICAgICAgJGluOiBAam9iU3RhdHVzUmVzdGFydGFibGVcblxuICAgIG1vZHMgPVxuICAgICAgJHNldDpcbiAgICAgICAgc3RhdHVzOiBcIndhaXRpbmdcIlxuICAgICAgICBwcm9ncmVzczpcbiAgICAgICAgICBjb21wbGV0ZWQ6IDBcbiAgICAgICAgICB0b3RhbDogMVxuICAgICAgICAgIHBlcmNlbnQ6IDBcbiAgICAgICAgdXBkYXRlZDogdGltZVxuICAgICAgJGluYzpcbiAgICAgICAgcmV0cmllczogb3B0aW9ucy5yZXRyaWVzXG5cbiAgICBpZiBsb2dPYmogPSBAX2xvZ01lc3NhZ2UucmVzdGFydGVkKClcbiAgICAgIG1vZHMuJHB1c2ggPVxuICAgICAgICBsb2c6IGxvZ09ialxuXG4gICAgaWYgb3B0aW9ucy51bnRpbD9cbiAgICAgIG1vZHMuJHNldC5yZXRyeVVudGlsID0gb3B0aW9ucy51bnRpbFxuXG4gICAgbnVtID0gQHVwZGF0ZSBxdWVyeSwgbW9kcywge211bHRpOiB0cnVlfVxuXG4gICAgIyBSZXN0YXJ0IHRoZSBlbnRpcmUgdHJlZSBvZiBkZXBlbmRlbnRzXG4gICAgcmVzdGFydElkcyA9IEBfaWRzT2ZEZXBzIGlkcywgb3B0aW9ucy5hbnRlY2VkZW50cywgb3B0aW9ucy5kZXBlbmRlbnRzLCBAam9iU3RhdHVzUmVzdGFydGFibGVcblxuICAgIGRlcHNSZXN0YXJ0ZWQgPSBmYWxzZVxuICAgIGlmIHJlc3RhcnRJZHMubGVuZ3RoID4gMFxuICAgICAgZGVwc1Jlc3RhcnRlZCA9IEBfRERQTWV0aG9kX2pvYlJlc3RhcnQgcmVzdGFydElkcywgb3B0aW9uc1xuXG4gICAgaWYgbnVtID4gMCBvciBkZXBzUmVzdGFydGVkXG4gICAgICBAX0REUE1ldGhvZF9qb2JSZWFkeSBpZHNcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuIFwiam9iUmVzdGFydCBmYWlsZWRcIlxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgSm9iIGNyZWF0b3IgbWV0aG9kc1xuXG4gIF9ERFBNZXRob2Rfam9iU2F2ZTogKGRvYywgb3B0aW9ucykgLT5cbiAgICBjaGVjayBkb2MsIF92YWxpZEpvYkRvYygpXG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWxcbiAgICAgIGNhbmNlbFJlcGVhdHM6IE1hdGNoLk9wdGlvbmFsIEJvb2xlYW5cbiAgICBjaGVjayBkb2Muc3RhdHVzLCBNYXRjaC5XaGVyZSAodikgLT5cbiAgICAgIE1hdGNoLnRlc3QodiwgU3RyaW5nKSBhbmQgdiBpbiBbICd3YWl0aW5nJywgJ3BhdXNlZCcgXVxuICAgIG9wdGlvbnMgPz0ge31cbiAgICBvcHRpb25zLmNhbmNlbFJlcGVhdHMgPz0gZmFsc2VcbiAgICBkb2MucmVwZWF0cyA9IEBmb3JldmVyIGlmIGRvYy5yZXBlYXRzID4gQGZvcmV2ZXJcbiAgICBkb2MucmV0cmllcyA9IEBmb3JldmVyIGlmIGRvYy5yZXRyaWVzID4gQGZvcmV2ZXJcblxuICAgIHRpbWUgPSBuZXcgRGF0ZSgpXG5cbiAgICAjIFRoaXMgZW5hYmxlcyB0aGUgZGVmYXVsdCBjYXNlIG9mIFwicnVuIGltbWVkaWF0ZWx5XCIgdG9cbiAgICAjIG5vdCBiZSBpbXBhY3RlZCBieSBhIGNsaWVudCdzIGNsb2NrXG4gICAgZG9jLmFmdGVyID0gdGltZSBpZiBkb2MuYWZ0ZXIgPCB0aW1lXG4gICAgZG9jLnJldHJ5VW50aWwgPSB0aW1lIGlmIGRvYy5yZXRyeVVudGlsIDwgdGltZVxuICAgIGRvYy5yZXBlYXRVbnRpbCA9IHRpbWUgaWYgZG9jLnJlcGVhdFVudGlsIDwgdGltZVxuXG4gICAgIyBJZiBkb2MucmVwZWF0V2FpdCBpcyBhIGxhdGVyLmpzIG9iamVjdCwgdGhlbiBkb24ndCBydW4gYmVmb3JlXG4gICAgIyB0aGUgZmlyc3QgdmFsaWQgc2NoZWR1bGVkIHRpbWUgdGhhdCBvY2N1cnMgYWZ0ZXIgZG9jLmFmdGVyXG4gICAgaWYgQGxhdGVyPyBhbmQgdHlwZW9mIGRvYy5yZXBlYXRXYWl0IGlzbnQgJ251bWJlcidcbiAgICAgIHVubGVzcyBuZXh0ID0gQGxhdGVyPy5zY2hlZHVsZShkb2MucmVwZWF0V2FpdCkubmV4dCgxLCBkb2MuYWZ0ZXIpXG4gICAgICAgIGNvbnNvbGUud2FybiBcIk5vIHZhbGlkIGF2YWlsYWJsZSBsYXRlci5qcyB0aW1lcyBpbiBzY2hlZHVsZSBhZnRlciAje2RvYy5hZnRlcn1cIlxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgbmV4dERhdGUgPSBuZXcgRGF0ZShuZXh0KVxuICAgICAgdW5sZXNzIG5leHREYXRlIDw9IGRvYy5yZXBlYXRVbnRpbFxuICAgICAgICBjb25zb2xlLndhcm4gXCJObyB2YWxpZCBhdmFpbGFibGUgbGF0ZXIuanMgdGltZXMgaW4gc2NoZWR1bGUgYmVmb3JlICN7ZG9jLnJlcGVhdFVudGlsfVwiXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICBkb2MuYWZ0ZXIgPSBuZXh0RGF0ZVxuICAgIGVsc2UgaWYgbm90IEBsYXRlcj8gYW5kIGRvYy5yZXBlYXRXYWl0IGlzbnQgJ251bWJlcidcbiAgICAgIGNvbnNvbGUud2FybiBcIkxhdGVyLmpzIG5vdCBsb2FkZWQuLi5cIlxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGlmIGRvYy5faWRcblxuICAgICAgbW9kcyA9XG4gICAgICAgICRzZXQ6XG4gICAgICAgICAgc3RhdHVzOiAnd2FpdGluZydcbiAgICAgICAgICBkYXRhOiBkb2MuZGF0YVxuICAgICAgICAgIHJldHJpZXM6IGRvYy5yZXRyaWVzXG4gICAgICAgICAgcmVwZWF0UmV0cmllczogaWYgZG9jLnJlcGVhdFJldHJpZXM/IHRoZW4gZG9jLnJlcGVhdFJldHJpZXMgZWxzZSBkb2MucmV0cmllcyArIGRvYy5yZXRyaWVkXG4gICAgICAgICAgcmV0cnlVbnRpbDogZG9jLnJldHJ5VW50aWxcbiAgICAgICAgICByZXRyeVdhaXQ6IGRvYy5yZXRyeVdhaXRcbiAgICAgICAgICByZXRyeUJhY2tvZmY6IGRvYy5yZXRyeUJhY2tvZmZcbiAgICAgICAgICByZXBlYXRzOiBkb2MucmVwZWF0c1xuICAgICAgICAgIHJlcGVhdFVudGlsOiBkb2MucmVwZWF0VW50aWxcbiAgICAgICAgICByZXBlYXRXYWl0OiBkb2MucmVwZWF0V2FpdFxuICAgICAgICAgIGRlcGVuZHM6IGRvYy5kZXBlbmRzXG4gICAgICAgICAgcHJpb3JpdHk6IGRvYy5wcmlvcml0eVxuICAgICAgICAgIGFmdGVyOiBkb2MuYWZ0ZXJcbiAgICAgICAgICB1cGRhdGVkOiB0aW1lXG5cbiAgICAgIGlmIGxvZ09iaiA9IEBfbG9nTWVzc2FnZS5yZXN1Ym1pdHRlZCgpXG4gICAgICAgIG1vZHMuJHB1c2ggPVxuICAgICAgICAgIGxvZzogbG9nT2JqXG5cbiAgICAgIG51bSA9IEB1cGRhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICBfaWQ6IGRvYy5faWRcbiAgICAgICAgICBzdGF0dXM6ICdwYXVzZWQnXG4gICAgICAgICAgcnVuSWQ6IG51bGxcbiAgICAgICAgfVxuICAgICAgICBtb2RzXG4gICAgICApXG5cbiAgICAgIGlmIG51bVxuICAgICAgICBAX0REUE1ldGhvZF9qb2JSZWFkeSBkb2MuX2lkXG4gICAgICAgIHJldHVybiBkb2MuX2lkXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgZWxzZVxuICAgICAgaWYgZG9jLnJlcGVhdHMgaXMgQGZvcmV2ZXIgYW5kIG9wdGlvbnMuY2FuY2VsUmVwZWF0c1xuICAgICAgICAjIElmIHRoaXMgaXMgdW5saW1pdGVkIHJlcGVhdGluZyBqb2IsIHRoZW4gY2FuY2VsIGFueSBleGlzdGluZyBqb2JzIG9mIHRoZSBzYW1lIHR5cGVcbiAgICAgICAgQGZpbmQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogZG9jLnR5cGVcbiAgICAgICAgICAgIHN0YXR1czpcbiAgICAgICAgICAgICAgJGluOiBAam9iU3RhdHVzQ2FuY2VsbGFibGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgKS5mb3JFYWNoIChkKSA9PiBAX0REUE1ldGhvZF9qb2JDYW5jZWwgZC5faWQsIHt9XG4gICAgICBkb2MuY3JlYXRlZCA9IHRpbWVcbiAgICAgIGRvYy5sb2cucHVzaCBAX2xvZ01lc3NhZ2Uuc3VibWl0dGVkKClcbiAgICAgIG5ld0lkID0gQGluc2VydCBkb2NcbiAgICAgIEBfRERQTWV0aG9kX2pvYlJlYWR5IG5ld0lkXG4gICAgICByZXR1cm4gbmV3SWRcblxuICAjIFdvcmtlciBtZXRob2RzXG5cbiAgX0REUE1ldGhvZF9qb2JQcm9ncmVzczogKGlkLCBydW5JZCwgY29tcGxldGVkLCB0b3RhbCwgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZCwgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpXG4gICAgY2hlY2sgcnVuSWQsIE1hdGNoLldoZXJlKF92YWxpZElkKVxuICAgIGNoZWNrIGNvbXBsZXRlZCwgTWF0Y2guV2hlcmUgX3ZhbGlkTnVtR1RFWmVyb1xuICAgIGNoZWNrIHRvdGFsLCBNYXRjaC5XaGVyZSBfdmFsaWROdW1HVFplcm9cbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbCB7fVxuICAgIG9wdGlvbnMgPz0ge31cblxuICAgICMgTm90aWZ5IHRoZSB3b3JrZXIgdG8gc3RvcCBydW5uaW5nIGlmIHdlIGFyZSBzaHV0dGluZyBkb3duXG4gICAgaWYgQHN0b3BwZWRcbiAgICAgIHJldHVybiBudWxsXG5cbiAgICBwcm9ncmVzcyA9XG4gICAgICBjb21wbGV0ZWQ6IGNvbXBsZXRlZFxuICAgICAgdG90YWw6IHRvdGFsXG4gICAgICBwZXJjZW50OiAxMDAqY29tcGxldGVkL3RvdGFsXG5cbiAgICBjaGVjayBwcm9ncmVzcywgTWF0Y2guV2hlcmUgKHYpIC0+XG4gICAgICB2LnRvdGFsID49IHYuY29tcGxldGVkIGFuZCAwIDw9IHYucGVyY2VudCA8PSAxMDBcblxuICAgIHRpbWUgPSBuZXcgRGF0ZSgpXG5cbiAgICBqb2IgPSBAZmluZE9uZSB7IF9pZDogaWQgfSwgeyBmaWVsZHM6IHsgd29ya1RpbWVvdXQ6IDEgfSB9XG5cbiAgICBtb2RzID1cbiAgICAgICRzZXQ6XG4gICAgICAgIHByb2dyZXNzOiBwcm9ncmVzc1xuICAgICAgICB1cGRhdGVkOiB0aW1lXG5cbiAgICBpZiBqb2I/LndvcmtUaW1lb3V0P1xuICAgICAgbW9kcy4kc2V0LmV4cGlyZXNBZnRlciA9IG5ldyBEYXRlKHRpbWUudmFsdWVPZigpICsgam9iLndvcmtUaW1lb3V0KVxuXG4gICAgbnVtID0gQHVwZGF0ZShcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpZFxuICAgICAgICBydW5JZDogcnVuSWRcbiAgICAgICAgc3RhdHVzOiBcInJ1bm5pbmdcIlxuICAgICAgfVxuICAgICAgbW9kc1xuICAgIClcblxuICAgIGlmIG51bSBpcyAxXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiBcImpvYlByb2dyZXNzIGZhaWxlZFwiXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX0REUE1ldGhvZF9qb2JMb2c6IChpZCwgcnVuSWQsIG1lc3NhZ2UsIG9wdGlvbnMpIC0+XG4gICAgY2hlY2sgaWQsIE1hdGNoLldoZXJlKF92YWxpZElkKVxuICAgIGNoZWNrIHJ1bklkLCBNYXRjaC5PbmVPZihNYXRjaC5XaGVyZShfdmFsaWRJZCksIG51bGwpXG4gICAgY2hlY2sgbWVzc2FnZSwgU3RyaW5nXG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWxcbiAgICAgIGxldmVsOiBNYXRjaC5PcHRpb25hbChNYXRjaC5XaGVyZSBfdmFsaWRMb2dMZXZlbClcbiAgICAgIGRhdGE6IE1hdGNoLk9wdGlvbmFsIE9iamVjdFxuICAgIG9wdGlvbnMgPz0ge31cbiAgICB0aW1lID0gbmV3IERhdGUoKVxuICAgIGxvZ09iaiA9XG4gICAgICAgIHRpbWU6IHRpbWVcbiAgICAgICAgcnVuSWQ6IHJ1bklkXG4gICAgICAgIGxldmVsOiBvcHRpb25zLmxldmVsID8gJ2luZm8nXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICBsb2dPYmouZGF0YSA9IG9wdGlvbnMuZGF0YSBpZiBvcHRpb25zLmRhdGE/XG5cbiAgICBqb2IgPSBAZmluZE9uZSB7IF9pZDogaWQgfSwgeyBmaWVsZHM6IHsgc3RhdHVzOiAxLCB3b3JrVGltZW91dDogMSB9IH1cblxuICAgIG1vZHMgPVxuICAgICAgJHB1c2g6XG4gICAgICAgIGxvZzogbG9nT2JqXG4gICAgICAkc2V0OlxuICAgICAgICB1cGRhdGVkOiB0aW1lXG5cbiAgICBpZiBqb2I/LndvcmtUaW1lb3V0PyBhbmQgam9iLnN0YXR1cyBpcyAncnVubmluZydcbiAgICAgIG1vZHMuJHNldC5leHBpcmVzQWZ0ZXIgPSBuZXcgRGF0ZSh0aW1lLnZhbHVlT2YoKSArIGpvYi53b3JrVGltZW91dClcblxuICAgIG51bSA9IEB1cGRhdGUoXG4gICAgICB7XG4gICAgICAgIF9pZDogaWRcbiAgICAgIH1cbiAgICAgIG1vZHNcbiAgICApXG4gICAgaWYgbnVtIGlzIDFcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuIFwiam9iTG9nIGZhaWxlZFwiXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX0REUE1ldGhvZF9qb2JSZXJ1bjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNoZWNrIGlkLCBNYXRjaC5XaGVyZShfdmFsaWRJZClcbiAgICBjaGVjayBvcHRpb25zLCBNYXRjaC5PcHRpb25hbFxuICAgICAgcmVwZWF0czogTWF0Y2guT3B0aW9uYWwoTWF0Y2guV2hlcmUgX3ZhbGlkSW50R1RFWmVybylcbiAgICAgIHVudGlsOiBNYXRjaC5PcHRpb25hbCBEYXRlXG4gICAgICB3YWl0OiBNYXRjaC5PbmVPZihNYXRjaC5XaGVyZShfdmFsaWRJbnRHVEVaZXJvKSwgTWF0Y2guV2hlcmUoX3ZhbGlkTGF0ZXJKU09iaikpXG5cbiAgICBkb2MgPSBAZmluZE9uZShcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpZFxuICAgICAgICBzdGF0dXM6IFwiY29tcGxldGVkXCJcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgZmllbGRzOlxuICAgICAgICAgIHJlc3VsdDogMFxuICAgICAgICAgIGZhaWx1cmVzOiAwXG4gICAgICAgICAgbG9nOiAwXG4gICAgICAgICAgcHJvZ3Jlc3M6IDBcbiAgICAgICAgICB1cGRhdGVkOiAwXG4gICAgICAgICAgYWZ0ZXI6IDBcbiAgICAgICAgICBzdGF0dXM6IDBcbiAgICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgICB9XG4gICAgKVxuXG4gICAgaWYgZG9jP1xuICAgICAgb3B0aW9ucyA/PSB7fVxuICAgICAgb3B0aW9ucy5yZXBlYXRzID89IDBcbiAgICAgIG9wdGlvbnMucmVwZWF0cyA9IEBmb3JldmVyIGlmIG9wdGlvbnMucmVwZWF0cyA+IEBmb3JldmVyXG4gICAgICBvcHRpb25zLnVudGlsID89IGRvYy5yZXBlYXRVbnRpbFxuICAgICAgb3B0aW9ucy53YWl0ID89IDBcbiAgICAgIHJldHVybiBAX3JlcnVuX2pvYiBkb2MsIG9wdGlvbnMucmVwZWF0cywgb3B0aW9ucy53YWl0LCBvcHRpb25zLnVudGlsXG5cbiAgICByZXR1cm4gZmFsc2VcblxuICBfRERQTWV0aG9kX2pvYkRvbmU6IChpZCwgcnVuSWQsIHJlc3VsdCwgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZCwgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpXG4gICAgY2hlY2sgcnVuSWQsIE1hdGNoLldoZXJlKF92YWxpZElkKVxuICAgIGNoZWNrIHJlc3VsdCwgT2JqZWN0XG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWxcbiAgICAgIHJlcGVhdElkOiBNYXRjaC5PcHRpb25hbCBCb29sZWFuXG4gICAgICBkZWxheURlcHM6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLldoZXJlKF92YWxpZEludEdURVplcm8pKVxuXG4gICAgb3B0aW9ucyA/PSB7IHJlcGVhdElkOiBmYWxzZSB9XG4gICAgdGltZSA9IG5ldyBEYXRlKClcbiAgICBkb2MgPSBAZmluZE9uZShcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpZFxuICAgICAgICBydW5JZDogcnVuSWRcbiAgICAgICAgc3RhdHVzOiBcInJ1bm5pbmdcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBmaWVsZHM6XG4gICAgICAgICAgbG9nOiAwXG4gICAgICAgICAgZmFpbHVyZXM6IDBcbiAgICAgICAgICBwcm9ncmVzczogMFxuICAgICAgICAgIHVwZGF0ZWQ6IDBcbiAgICAgICAgICBhZnRlcjogMFxuICAgICAgICAgIHN0YXR1czogMFxuICAgICAgICB0cmFuc2Zvcm06IG51bGxcbiAgICAgIH1cbiAgICApXG4gICAgdW5sZXNzIGRvYz9cbiAgICAgIHVubGVzcyBAaXNTaW11bGF0aW9uXG4gICAgICAgIGNvbnNvbGUud2FybiBcIlJ1bm5pbmcgam9iIG5vdCBmb3VuZFwiLCBpZCwgcnVuSWRcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgbW9kcyA9XG4gICAgICAkc2V0OlxuICAgICAgICBzdGF0dXM6IFwiY29tcGxldGVkXCJcbiAgICAgICAgcmVzdWx0OiByZXN1bHRcbiAgICAgICAgcHJvZ3Jlc3M6XG4gICAgICAgICAgY29tcGxldGVkOiAxXG4gICAgICAgICAgdG90YWw6IDFcbiAgICAgICAgICBwZXJjZW50OiAxMDBcbiAgICAgICAgdXBkYXRlZDogdGltZVxuXG4gICAgaWYgbG9nT2JqID0gQF9sb2dNZXNzYWdlLmNvbXBsZXRlZCBydW5JZFxuICAgICAgbW9kcy4kcHVzaCA9XG4gICAgICAgIGxvZzogbG9nT2JqXG5cbiAgICBudW0gPSBAdXBkYXRlKFxuICAgICAge1xuICAgICAgICBfaWQ6IGlkXG4gICAgICAgIHJ1bklkOiBydW5JZFxuICAgICAgICBzdGF0dXM6IFwicnVubmluZ1wiXG4gICAgICB9XG4gICAgICBtb2RzXG4gICAgKVxuICAgIGlmIG51bSBpcyAxXG4gICAgICBpZiBkb2MucmVwZWF0cyA+IDBcbiAgICAgICAgaWYgdHlwZW9mIGRvYy5yZXBlYXRXYWl0IGlzICdudW1iZXInXG4gICAgICAgICAgaWYgZG9jLnJlcGVhdFVudGlsIC0gZG9jLnJlcGVhdFdhaXQgPj0gdGltZVxuICAgICAgICAgICAgam9iSWQgPSBAX3JlcnVuX2pvYiBkb2NcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgVGhpcyBjb2RlIHByZXZlbnRzIGEgam9iIHRoYXQganVzdCByYW4gYW5kIGZpbmlzaGVkXG4gICAgICAgICAgIyBpbnN0YW50bHkgZnJvbSBiZWluZyBpbW1lZGlhdGVseSByZXJ1biBvbiB0aGUgc2FtZSBvY2N1cmFuY2VcbiAgICAgICAgICBuZXh0ID0gQGxhdGVyPy5zY2hlZHVsZShkb2MucmVwZWF0V2FpdCkubmV4dCgyKVxuICAgICAgICAgIGlmIG5leHQgYW5kIG5leHQubGVuZ3RoID4gMFxuICAgICAgICAgICAgZCA9IG5ldyBEYXRlKG5leHRbMF0pXG4gICAgICAgICAgICBpZiAoZCAtIHRpbWUgPiA1MDApIG9yIChuZXh0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgIGlmIGQgLSB0aW1lIDw9IDUwMFxuICAgICAgICAgICAgICAgIGQgPSBuZXcgRGF0ZShuZXh0WzFdKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHdhaXQgPSBkIC0gdGltZVxuICAgICAgICAgICAgICBpZiBkb2MucmVwZWF0VW50aWwgLSB3YWl0ID49IHRpbWVcbiAgICAgICAgICAgICAgICBqb2JJZCA9IEBfcmVydW5fam9iIGRvYywgZG9jLnJlcGVhdHMgLSAxLCB3YWl0XG5cbiAgICAgICMgUmVzb2x2ZSBkZXBlbmRzXG4gICAgICBpZHMgPSBAZmluZChcbiAgICAgICAge1xuICAgICAgICAgIGRlcGVuZHM6XG4gICAgICAgICAgICAkYWxsOiBbIGlkIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgICAgIGZpZWxkczpcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICApLmZldGNoKCkubWFwIChkKSA9PiBkLl9pZFxuXG4gICAgICBpZiBpZHMubGVuZ3RoID4gMFxuXG4gICAgICAgIG1vZHMgPVxuICAgICAgICAgICRwdWxsOlxuICAgICAgICAgICAgZGVwZW5kczogaWRcbiAgICAgICAgICAkcHVzaDpcbiAgICAgICAgICAgIHJlc29sdmVkOiBpZFxuXG4gICAgICAgIGlmIG9wdGlvbnMuZGVsYXlEZXBzP1xuICAgICAgICAgIGFmdGVyID0gbmV3IERhdGUodGltZS52YWx1ZU9mKCkgKyBvcHRpb25zLmRlbGF5RGVwcylcbiAgICAgICAgICBtb2RzLiRtYXggPVxuICAgICAgICAgICAgYWZ0ZXI6IGFmdGVyXG5cbiAgICAgICAgaWYgbG9nT2JqID0gQF9sb2dNZXNzYWdlLnJlc29sdmVkIGlkLCBydW5JZFxuICAgICAgICAgIG1vZHMuJHB1c2gubG9nID0gbG9nT2JqXG5cbiAgICAgICAgbiA9IEB1cGRhdGUoXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOlxuICAgICAgICAgICAgICAkaW46IGlkc1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb2RzXG4gICAgICAgICAge1xuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgaWYgbiBpc250IGlkcy5sZW5ndGhcbiAgICAgICAgICBjb25zb2xlLndhcm4gXCJOb3QgYWxsIGRlcGVuZGVudCBqb2JzIHdlcmUgcmVzb2x2ZWQgI3tpZHMubGVuZ3RofSA+ICN7bn1cIlxuICAgICAgICAjIFRyeSB0byBwcm9tb3RlIGFueSBqb2JzIHRoYXQganVzdCBoYWQgYSBkZXBlbmRlbmN5IHJlc29sdmVkXG4gICAgICAgIEBfRERQTWV0aG9kX2pvYlJlYWR5IGlkc1xuICAgICAgaWYgb3B0aW9ucy5yZXBlYXRJZCBhbmQgam9iSWQ/XG4gICAgICAgIHJldHVybiBqb2JJZFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiBcImpvYkRvbmUgZmFpbGVkXCJcbiAgICByZXR1cm4gZmFsc2VcblxuICBfRERQTWV0aG9kX2pvYkZhaWw6IChpZCwgcnVuSWQsIGVyciwgb3B0aW9ucykgLT5cbiAgICBjaGVjayBpZCwgTWF0Y2guV2hlcmUoX3ZhbGlkSWQpXG4gICAgY2hlY2sgcnVuSWQsIE1hdGNoLldoZXJlKF92YWxpZElkKVxuICAgIGNoZWNrIGVyciwgT2JqZWN0XG4gICAgY2hlY2sgb3B0aW9ucywgTWF0Y2guT3B0aW9uYWxcbiAgICAgIGZhdGFsOiBNYXRjaC5PcHRpb25hbCBCb29sZWFuXG5cbiAgICBvcHRpb25zID89IHt9XG4gICAgb3B0aW9ucy5mYXRhbCA/PSBmYWxzZVxuXG4gICAgdGltZSA9IG5ldyBEYXRlKClcbiAgICBkb2MgPSBAZmluZE9uZShcbiAgICAgIHtcbiAgICAgICAgX2lkOiBpZFxuICAgICAgICBydW5JZDogcnVuSWRcbiAgICAgICAgc3RhdHVzOiBcInJ1bm5pbmdcIlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBmaWVsZHM6XG4gICAgICAgICAgbG9nOiAwXG4gICAgICAgICAgZmFpbHVyZXM6IDBcbiAgICAgICAgICBwcm9ncmVzczogMFxuICAgICAgICAgIHVwZGF0ZWQ6IDBcbiAgICAgICAgICBhZnRlcjogMFxuICAgICAgICAgIHJ1bklkOiAwXG4gICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgICAgfVxuICAgIClcbiAgICB1bmxlc3MgZG9jP1xuICAgICAgdW5sZXNzIEBpc1NpbXVsYXRpb25cbiAgICAgICAgY29uc29sZS53YXJuIFwiUnVubmluZyBqb2Igbm90IGZvdW5kXCIsIGlkLCBydW5JZFxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBhZnRlciA9IHN3aXRjaCBkb2MucmV0cnlCYWNrb2ZmXG4gICAgICB3aGVuICdleHBvbmVudGlhbCdcbiAgICAgICAgbmV3IERhdGUodGltZS52YWx1ZU9mKCkgKyBkb2MucmV0cnlXYWl0Kk1hdGgucG93KDIsIGRvYy5yZXRyaWVkLTEpKVxuICAgICAgZWxzZVxuICAgICAgICBuZXcgRGF0ZSh0aW1lLnZhbHVlT2YoKSArIGRvYy5yZXRyeVdhaXQpICAjICdjb25zdGFudCdcblxuICAgIG5ld1N0YXR1cyA9IGlmIChub3Qgb3B0aW9ucy5mYXRhbCBhbmRcbiAgICAgICAgICAgICAgICAgICAgZG9jLnJldHJpZXMgPiAwIGFuZFxuICAgICAgICAgICAgICAgICAgICBkb2MucmV0cnlVbnRpbCA+PSBhZnRlcikgdGhlbiBcIndhaXRpbmdcIiBlbHNlIFwiZmFpbGVkXCJcblxuICAgIGVyci5ydW5JZCA9IHJ1bklkICAjIExpbmsgZWFjaCBmYWlsdXJlIHRvIHRoZSBydW4gdGhhdCBnZW5lcmF0ZWQgaXQuXG5cbiAgICBtb2RzID1cbiAgICAgICRzZXQ6XG4gICAgICAgIHN0YXR1czogbmV3U3RhdHVzXG4gICAgICAgIHJ1bklkOiBudWxsXG4gICAgICAgIGFmdGVyOiBhZnRlclxuICAgICAgICBwcm9ncmVzczpcbiAgICAgICAgICBjb21wbGV0ZWQ6IDBcbiAgICAgICAgICB0b3RhbDogMVxuICAgICAgICAgIHBlcmNlbnQ6IDBcbiAgICAgICAgdXBkYXRlZDogdGltZVxuICAgICAgJHB1c2g6XG4gICAgICAgIGZhaWx1cmVzOlxuICAgICAgICAgIGVyclxuXG4gICAgaWYgbG9nT2JqID0gQF9sb2dNZXNzYWdlLmZhaWxlZCBydW5JZCwgbmV3U3RhdHVzIGlzICdmYWlsZWQnLCBlcnJcbiAgICAgIG1vZHMuJHB1c2gubG9nID0gbG9nT2JqXG5cbiAgICBudW0gPSBAdXBkYXRlKFxuICAgICAge1xuICAgICAgICBfaWQ6IGlkXG4gICAgICAgIHJ1bklkOiBydW5JZFxuICAgICAgICBzdGF0dXM6IFwicnVubmluZ1wiXG4gICAgICB9XG4gICAgICBtb2RzXG4gICAgKVxuICAgIGlmIG5ld1N0YXR1cyBpcyBcImZhaWxlZFwiIGFuZCBudW0gaXMgMVxuICAgICAgIyBDYW5jZWwgYW55IGRlcGVuZGVudCBqb2JzIHRvb1xuICAgICAgQGZpbmQoXG4gICAgICAgIHtcbiAgICAgICAgICBkZXBlbmRzOlxuICAgICAgICAgICAgJGFsbDogWyBpZCBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0cmFuc2Zvcm06IG51bGxcbiAgICAgICAgfVxuICAgICAgKS5mb3JFYWNoIChkKSA9PiBAX0REUE1ldGhvZF9qb2JDYW5jZWwgZC5faWRcbiAgICBpZiBudW0gaXMgMVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gXCJqb2JGYWlsIGZhaWxlZFwiXG4gICAgcmV0dXJuIGZhbHNlXG5cbiMgU2hhcmUgdGhlc2UgbWV0aG9kcyBzbyB0aGV5J2xsIGJlIGF2YWlsYWJsZSBvbiBzZXJ2ZXIgYW5kIGNsaWVudFxuXG5zaGFyZS5Kb2JDb2xsZWN0aW9uQmFzZSA9IEpvYkNvbGxlY3Rpb25CYXNlXG4iLCIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jICAgICBDb3B5cmlnaHQgKEMpIDIwMTQtMjAxNiBieSBWYXVnaG4gSXZlcnNvblxuIyAgICAgam9iLWNvbGxlY3Rpb24gaXMgZnJlZSBzb2Z0d2FyZSByZWxlYXNlZCB1bmRlciB0aGUgTUlUL1gxMSBsaWNlbnNlLlxuIyAgICAgU2VlIGluY2x1ZGVkIExJQ0VOU0UgZmlsZSBmb3IgZGV0YWlscy5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cbiAgZXZlbnRFbWl0dGVyID0gTnBtLnJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuXG4gIHVzZXJIZWxwZXIgPSAodXNlciwgY29ubmVjdGlvbikgLT5cbiAgICByZXQgPSB1c2VyID8gXCJbVU5BVVRIRU5USUNBVEVEXVwiXG4gICAgdW5sZXNzIGNvbm5lY3Rpb25cbiAgICAgIHJldCA9IFwiW1NFUlZFUl1cIlxuICAgIHJldFxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyMgam9iLWNvbGxlY3Rpb24gc2VydmVyIGNsYXNzXG5cbiAgY2xhc3MgSm9iQ29sbGVjdGlvbiBleHRlbmRzIHNoYXJlLkpvYkNvbGxlY3Rpb25CYXNlXG5cbiAgICBjb25zdHJ1Y3RvcjogKHJvb3QgPSAncXVldWUnLCBvcHRpb25zID0ge30pIC0+XG4gICAgICB1bmxlc3MgQCBpbnN0YW5jZW9mIEpvYkNvbGxlY3Rpb25cbiAgICAgICAgcmV0dXJuIG5ldyBKb2JDb2xsZWN0aW9uKHJvb3QsIG9wdGlvbnMpXG5cbiAgICAgICMgQ2FsbCBzdXBlcidzIGNvbnN0cnVjdG9yXG4gICAgICBzdXBlciByb290LCBvcHRpb25zXG5cbiAgICAgIEBldmVudHMgPSBuZXcgZXZlbnRFbWl0dGVyKClcblxuICAgICAgQF9lcnJvckxpc3RlbmVyID0gQGV2ZW50cy5vbiAnZXJyb3InLCBAX29uRXJyb3JcblxuICAgICAgIyBBZGQgZXZlbnRzIGZvciBhbGwgaW5kaXZpZHVhbCBzdWNjZXNzZnVsIEREUCBtZXRob2RzXG4gICAgICBAX21ldGhvZEVycm9yRGlzcGF0Y2ggPSBAZXZlbnRzLm9uICdlcnJvcicsIChtc2cpID0+XG4gICAgICAgIEBldmVudHMuZW1pdCBtc2cubWV0aG9kLCBtc2dcblxuICAgICAgQF9jYWxsTGlzdGVuZXIgPSBAZXZlbnRzLm9uICdjYWxsJywgQF9vbkNhbGxcblxuICAgICAgIyBBZGQgZXZlbnRzIGZvciBhbGwgaW5kaXZpZHVhbCBzdWNjZXNzZnVsIEREUCBtZXRob2RzXG4gICAgICBAX21ldGhvZEV2ZW50RGlzcGF0Y2ggPSBAZXZlbnRzLm9uICdjYWxsJywgKG1zZykgPT5cbiAgICAgICAgQGV2ZW50cy5lbWl0IG1zZy5tZXRob2QsIG1zZ1xuXG4gICAgICBAc3RvcHBlZCA9IHRydWVcblxuICAgICAgIyBObyBjbGllbnQgbXV0YXRvcnMgYWxsb3dlZFxuICAgICAgc2hhcmUuSm9iQ29sbGVjdGlvbkJhc2UuX19zdXBlcl9fLmRlbnkuYmluZChAKVxuICAgICAgICB1cGRhdGU6ICgpID0+IHRydWVcbiAgICAgICAgaW5zZXJ0OiAoKSA9PiB0cnVlXG4gICAgICAgIHJlbW92ZTogKCkgPT4gdHJ1ZVxuXG4gICAgICBAcHJvbW90ZSgpXG5cbiAgICAgIEBsb2dTdHJlYW0gPSBudWxsXG5cbiAgICAgIEBhbGxvd3MgPSB7fVxuICAgICAgQGRlbnlzID0ge31cblxuICAgICAgIyBJbml0aWFsaXplIGFsbG93L2RlbnkgbGlzdHMgZm9yIHBlcm1pc3Npb24gbGV2ZWxzIGFuZCBkZHAgbWV0aG9kc1xuICAgICAgZm9yIGxldmVsIGluIEBkZHBQZXJtaXNzaW9uTGV2ZWxzLmNvbmNhdCBAZGRwTWV0aG9kc1xuICAgICAgICBAYWxsb3dzW2xldmVsXSA9IFtdXG4gICAgICAgIEBkZW55c1tsZXZlbF0gPSBbXVxuXG4gICAgICAjIElmIGEgY29ubmVjdGlvbiBvcHRpb24gaXMgZ2l2ZW4sIHRoZW4gdGhpcyBKb2JDb2xsZWN0aW9uIGlzIGFjdHVhbGx5IGhvc3RlZFxuICAgICAgIyByZW1vdGVseSwgc28gZG9uJ3QgZXN0YWJsaXNoIGxvY2FsIGFuZCByZW1vdGVseSBjYWxsYWJsZSBzZXJ2ZXIgbWV0aG9kcyBpbiB0aGF0IGNhc2VcbiAgICAgIHVubGVzcyBvcHRpb25zLmNvbm5lY3Rpb24/XG4gICAgICAgICMgRGVmYXVsdCBpbmRleGVzLCBvbmx5IHdoZW4gbm90IHJlbW90ZWx5IGNvbm5lY3RlZCFcbiAgICAgICAgQF9lbnN1cmVJbmRleCB7IHR5cGUgOiAxLCBzdGF0dXMgOiAxIH1cbiAgICAgICAgQF9lbnN1cmVJbmRleCB7IHByaW9yaXR5IDogMSwgcmV0cnlVbnRpbCA6IDEsIGFmdGVyIDogMSB9XG4gICAgICAgIEBpc1NpbXVsYXRpb24gPSBmYWxzZVxuICAgICAgICBsb2NhbE1ldGhvZHMgPSBAX2dlbmVyYXRlTWV0aG9kcygpXG4gICAgICAgIEBfbG9jYWxTZXJ2ZXJNZXRob2RzID89IHt9XG4gICAgICAgIEBfbG9jYWxTZXJ2ZXJNZXRob2RzW21ldGhvZE5hbWVdID0gbWV0aG9kRnVuY3Rpb24gZm9yIG1ldGhvZE5hbWUsIG1ldGhvZEZ1bmN0aW9uIG9mIGxvY2FsTWV0aG9kc1xuICAgICAgICBmb28gPSB0aGlzXG4gICAgICAgIEBfZGRwX2FwcGx5ID0gKG5hbWUsIHBhcmFtcywgY2IpID0+XG4gICAgICAgICAgaWYgY2I/XG4gICAgICAgICAgICBNZXRlb3Iuc2V0VGltZW91dCAoKCkgPT5cbiAgICAgICAgICAgICAgZXJyID0gbnVsbFxuICAgICAgICAgICAgICByZXMgPSBudWxsXG4gICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHJlcyA9IEBfbG9jYWxTZXJ2ZXJNZXRob2RzW25hbWVdLmFwcGx5KHRoaXMsIHBhcmFtcylcbiAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGVyciA9IGVcbiAgICAgICAgICAgICAgY2IgZXJyLCByZXMpLCAwXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQF9sb2NhbFNlcnZlck1ldGhvZHNbbmFtZV0uYXBwbHkodGhpcywgcGFyYW1zKVxuXG4gICAgICAgIEpvYi5fc2V0RERQQXBwbHkgQF9kZHBfYXBwbHksIHJvb3RcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyBsb2NhbE1ldGhvZHNcblxuICAgIF9vbkVycm9yOiAobXNnKSA9PlxuICAgICAgdXNlciA9IHVzZXJIZWxwZXIgbXNnLnVzZXJJZCwgbXNnLmNvbm5lY3Rpb25cbiAgICAgIEBfdG9Mb2cgdXNlciwgbXNnLm1ldGhvZCwgXCIje21zZy5lcnJvcn1cIlxuXG4gICAgX29uQ2FsbDogKG1zZykgPT5cbiAgICAgIHVzZXIgPSB1c2VySGVscGVyIG1zZy51c2VySWQsIG1zZy5jb25uZWN0aW9uXG4gICAgICBAX3RvTG9nIHVzZXIsIG1zZy5tZXRob2QsIFwicGFyYW1zOiBcIiArIEpTT04uc3RyaW5naWZ5KG1zZy5wYXJhbXMpXG4gICAgICBAX3RvTG9nIHVzZXIsIG1zZy5tZXRob2QsIFwicmV0dXJuZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkobXNnLnJldHVyblZhbClcblxuICAgIF90b0xvZzogKHVzZXJJZCwgbWV0aG9kLCBtZXNzYWdlKSA9PlxuICAgICAgQGxvZ1N0cmVhbT8ud3JpdGUgXCIje25ldyBEYXRlKCl9LCAje3VzZXJJZH0sICN7bWV0aG9kfSwgI3ttZXNzYWdlfVxcblwiXG4gICAgICAjIHByb2Nlc3Muc3Rkb3V0LndyaXRlIFwiI3tuZXcgRGF0ZSgpfSwgI3t1c2VySWR9LCAje21ldGhvZH0sICN7bWVzc2FnZX1cXG5cIlxuXG4gICAgX2VtaXQ6IChtZXRob2QsIGNvbm5lY3Rpb24sIHVzZXJJZCwgZXJyLCByZXQsIHBhcmFtcy4uLikgPT5cbiAgICAgIGlmIGVyclxuICAgICAgICBAZXZlbnRzLmVtaXQgJ2Vycm9yJyxcbiAgICAgICAgICBlcnJvcjogZXJyXG4gICAgICAgICAgbWV0aG9kOiBtZXRob2RcbiAgICAgICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgIHJldHVyblZhbDogbnVsbFxuICAgICAgZWxzZVxuICAgICAgICBAZXZlbnRzLmVtaXQgJ2NhbGwnLFxuICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgICAgbWV0aG9kOiBtZXRob2RcbiAgICAgICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgIHJldHVyblZhbDogcmV0XG5cbiAgICBfbWV0aG9kV3JhcHBlcjogKG1ldGhvZCwgZnVuYykgLT5cbiAgICAgIHNlbGYgPSB0aGlzXG4gICAgICBteVR5cGVvZiA9ICh2YWwpIC0+XG4gICAgICAgIHR5cGUgPSB0eXBlb2YgdmFsXG4gICAgICAgIHR5cGUgPSAnYXJyYXknIGlmIHR5cGUgaXMgJ29iamVjdCcgYW5kIHR5cGUgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICByZXR1cm4gdHlwZVxuICAgICAgcGVybWl0dGVkID0gKHVzZXJJZCwgcGFyYW1zKSA9PlxuICAgICAgICBwZXJmb3JtVGVzdCA9ICh0ZXN0cykgPT5cbiAgICAgICAgICByZXN1bHQgPSBmYWxzZVxuICAgICAgICAgIGZvciB0ZXN0IGluIHRlc3RzIHdoZW4gcmVzdWx0IGlzIGZhbHNlXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgb3Igc3dpdGNoIG15VHlwZW9mKHRlc3QpXG4gICAgICAgICAgICAgIHdoZW4gJ2FycmF5JyB0aGVuIHVzZXJJZCBpbiB0ZXN0XG4gICAgICAgICAgICAgIHdoZW4gJ2Z1bmN0aW9uJyB0aGVuIHRlc3QodXNlcklkLCBtZXRob2QsIHBhcmFtcylcbiAgICAgICAgICAgICAgZWxzZSBmYWxzZVxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgcGVyZm9ybUFsbFRlc3RzID0gKGFsbFRlc3RzKSA9PlxuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlXG4gICAgICAgICAgZm9yIHQgaW4gQGRkcE1ldGhvZFBlcm1pc3Npb25zW21ldGhvZF0gd2hlbiByZXN1bHQgaXMgZmFsc2VcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCBvciBwZXJmb3JtVGVzdChhbGxUZXN0c1t0XSlcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIHJldHVybiBub3QgcGVyZm9ybUFsbFRlc3RzKEBkZW55cykgYW5kIHBlcmZvcm1BbGxUZXN0cyhAYWxsb3dzKVxuICAgICAgIyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24gdGhhdCB0aGUgTWV0ZW9yIG1ldGhvZCB3aWxsIGFjdHVhbGx5IGludm9rZVxuICAgICAgcmV0dXJuIChwYXJhbXMuLi4pIC0+XG4gICAgICAgIHRyeVxuICAgICAgICAgIHVubGVzcyB0aGlzLmNvbm5lY3Rpb24gYW5kIG5vdCBwZXJtaXR0ZWQodGhpcy51c2VySWQsIHBhcmFtcylcbiAgICAgICAgICAgIHJldHZhbCA9IGZ1bmMocGFyYW1zLi4uKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVyciA9IG5ldyBNZXRlb3IuRXJyb3IgNDAzLCBcIk1ldGhvZCBub3QgYXV0aG9yaXplZFwiLCBcIkF1dGhlbnRpY2F0ZWQgdXNlciBpcyBub3QgcGVybWl0dGVkIHRvIGludm9rZSB0aGlzIG1ldGhvZC5cIlxuICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgIHNlbGYuX2VtaXQgbWV0aG9kLCB0aGlzLmNvbm5lY3Rpb24sIHRoaXMudXNlcklkLCBlcnJcbiAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgc2VsZi5fZW1pdCBtZXRob2QsIHRoaXMuY29ubmVjdGlvbiwgdGhpcy51c2VySWQsIG51bGwsIHJldHZhbCwgcGFyYW1zLi4uXG4gICAgICAgIHJldHVybiByZXR2YWxcblxuICAgIHNldExvZ1N0cmVhbTogKHdyaXRlU3RyZWFtID0gbnVsbCkgLT5cbiAgICAgIGlmIEBsb2dTdHJlYW1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwibG9nU3RyZWFtIG1heSBvbmx5IGJlIHNldCBvbmNlIHBlciBqb2ItY29sbGVjdGlvbiBzdGFydHVwL3NodXRkb3duIGN5Y2xlXCJcbiAgICAgIEBsb2dTdHJlYW0gPSB3cml0ZVN0cmVhbVxuICAgICAgdW5sZXNzIG5vdCBAbG9nU3RyZWFtPyBvclxuICAgICAgICAgICAgIEBsb2dTdHJlYW0ud3JpdGU/IGFuZFxuICAgICAgICAgICAgIHR5cGVvZiBAbG9nU3RyZWFtLndyaXRlIGlzICdmdW5jdGlvbicgYW5kXG4gICAgICAgICAgICAgQGxvZ1N0cmVhbS5lbmQ/IGFuZFxuICAgICAgICAgICAgIHR5cGVvZiBAbG9nU3RyZWFtLmVuZCBpcyAnZnVuY3Rpb24nXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcImxvZ1N0cmVhbSBtdXN0IGJlIGEgdmFsaWQgd3JpdGFibGUgbm9kZS5qcyBTdHJlYW1cIlxuXG4gICAgIyBSZWdpc3RlciBhcHBsaWNhdGlvbiBhbGxvdyBydWxlc1xuICAgIGFsbG93OiAoYWxsb3dPcHRpb25zKSAtPlxuICAgICAgQGFsbG93c1t0eXBlXS5wdXNoKGZ1bmMpIGZvciB0eXBlLCBmdW5jIG9mIGFsbG93T3B0aW9ucyB3aGVuIHR5cGUgb2YgQGFsbG93c1xuXG4gICAgIyBSZWdpc3RlciBhcHBsaWNhdGlvbiBkZW55IHJ1bGVzXG4gICAgZGVueTogKGRlbnlPcHRpb25zKSAtPlxuICAgICAgQGRlbnlzW3R5cGVdLnB1c2goZnVuYykgZm9yIHR5cGUsIGZ1bmMgb2YgZGVueU9wdGlvbnMgd2hlbiB0eXBlIG9mIEBkZW55c1xuXG4gICAgIyBIb29rIGZ1bmN0aW9uIHRvIHNhbml0aXplIGRvY3VtZW50cyBiZWZvcmUgdmFsaWRhdGluZyB0aGVtIGluIGdldFdvcmsoKSBhbmQgZ2V0Sm9iKClcbiAgICBzY3J1YjogKGpvYikgLT5cbiAgICAgIGpvYlxuXG4gICAgcHJvbW90ZTogKG1pbGxpc2Vjb25kcyA9IDE1KjEwMDApIC0+XG4gICAgICBpZiB0eXBlb2YgbWlsbGlzZWNvbmRzIGlzICdudW1iZXInIGFuZCBtaWxsaXNlY29uZHMgPiAwXG4gICAgICAgIGlmIEBpbnRlcnZhbFxuICAgICAgICAgIE1ldGVvci5jbGVhckludGVydmFsIEBpbnRlcnZhbFxuICAgICAgICBAX3Byb21vdGVfam9icygpXG4gICAgICAgIEBpbnRlcnZhbCA9IE1ldGVvci5zZXRJbnRlcnZhbCBAX3Byb21vdGVfam9icy5iaW5kKEApLCBtaWxsaXNlY29uZHNcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiam9iQ29sbGVjdGlvbi5wcm9tb3RlOiBpbnZhbGlkIHRpbWVvdXQ6ICN7QHJvb3R9LCAje21pbGxpc2Vjb25kc31cIlxuXG4gICAgX3Byb21vdGVfam9iczogKGlkcyA9IFtdKSAtPlxuICAgICAgaWYgQHN0b3BwZWRcbiAgICAgICAgcmV0dXJuXG4gICAgICAjIFRoaXMgbG9va3MgZm9yIHpvbWJpZSBydW5uaW5nIGpvYnMgYW5kIGF1dG9mYWlscyB0aGVtXG4gICAgICBAZmluZCh7c3RhdHVzOiAncnVubmluZycsIGV4cGlyZXNBZnRlcjogeyAkbHQ6IG5ldyBEYXRlKCkgfX0pXG4gICAgICAgIC5mb3JFYWNoIChqb2IpID0+XG4gICAgICAgICAgbmV3IEpvYihAcm9vdCwgam9iKS5mYWlsKFwiRmFpbGVkIGZvciBleGNlZWRpbmcgd29ya2VyIHNldCB3b3JrVGltZW91dFwiKTtcbiAgICAgICMgQ2hhbmdlIGpvYnMgZnJvbSB3YWl0aW5nIHRvIHJlYWR5IHdoZW4gdGhlaXIgdGltZSBoYXMgY29tZVxuICAgICAgIyBhbmQgZGVwZW5kZW5jaWVzIGhhdmUgYmVlbiBzYXRpc2ZpZWRcbiAgICAgIEByZWFkeUpvYnMoKVxuIl19
