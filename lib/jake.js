var file = require("file"),
    Task = require("jake/task").Task,
    FileTask = require("jake/filetask").FileTask,
    Rule = require("jake/rule").Rule;

var contexts = [],
    contextMap = {};

exports.currentContext = function() {
    return contexts[contexts.length-1];
}

exports.load = function(path) {
    // TODO: should we really be reusing these?
    // if not then figure out how to force reload a Jakefile
    // TODO: use kris' method of a custom factory?
    
    if (!contextMap.hasOwnProperty(path)) {
        contextMap[path] = new Jake(path);

        contexts.push(contextMap[path]);
        require(file.absolute(path));
        contexts.pop();
    }
    
    return contextMap[path];
}

exports.abort = function(message) {
    print("jake aborted!" + (message ? "\n" + message : ""));
    require("os").exit(1);
}

exports.methods = ["task", "file", "file_d", "directory", "rule"];

exports.methods.forEach(function(method) {
    exports[method] = function() {
        var context = exports.currentContext();
        return context[method].apply(context, arguments);
    };
});


var Jake = exports.Jake = function(path) {
    this.path = path;
    this.tasks = {};
    this.rules = [];
}

Jake.prototype.task = function(name, dep, action) {
    return this.addTask(new Task(name, dep, action));
}

Jake.prototype.file = function(name, dep, action) {
    return this.addTask(new FileTask(name, dep, action));
}

Jake.prototype.file_d = function(name, dep, action) {
    return this.addTaskAndParent(new FileTask(name, dep, action));
}

Jake.prototype.directory = function(dest) {
    var components = file.split(dest);
    for (var i = 0; i <  components.length; i++) {
        var path = file.join.apply(null, components.slice(0, i+1));
        this.file(path).action((function(p) { return function() { file.mkdirs(p) }; })(path));
    }
}

Jake.prototype.rule = function(target) {
    return this.addRule(new Rule(target));
}

Jake.prototype.run = function(name) {
    this._stack = [];
    this._completed = {};
    
    this._run(name);
}

Jake.prototype._run = function(name) {
    if (this.checkCircular(name))
        exports.abort("Circular dependency detected: " + this._stack.concat(name).join(" => "));
    
    var task = this.lookupTask(name);
    if (!task)
        exports.abort("Don't know how to build task '"+name+"'");
    
    if (exports.trace) print("** Invoke "+task.name)
    
    this._stack.push(task.name);
    task.dependencies.forEach(function(dependency) {
        this._run(dependency);
    }, this);
    this._stack.pop();
    
    if (this._completed[task.name] !== true && task.isNeeded()) {
        if (exports.trace) print("** Execute "+task.name)
        task.invoke();
    }
    
    this._completed[task.name] = true;
}

Jake.prototype.checkCircular = function(name) {
    for (var i = 0; i < this._stack.length; i++)
        if (this._stack[i] === name)
            return true;
    return false;
}

Jake.prototype.addTask = function(task) {
    //if (this.tasks.hasOwnProperty(task.name))
    //    print("Warning: overriding task named " + task.name);
        
    this.tasks[task.name] = task;
    
    return task;
}

Jake.prototype.addTaskAndParent = function(task) {
    this.addTask(task);
    
    var parent = file.dirname(task.name);
    this.directory(parent);
    task.depends(parent);
    
    return task;
}

Jake.prototype.addRule = function(rule) {
    this.rules.push(rule);
    
    return rule;
}

Jake.prototype.lookupTask = function(name) {
    if (!this.tasks.hasOwnProperty(name)) {
        var rule = this.lookupRule(name);
        if (rule) {
            this.addTask(rule.generateTask(name));
        }
        // FIXME: this doens't feel right
        else if (file.exists(name)) {
            this.file(name);
        }
    }
    
    return this.tasks[name] || null;
}

Jake.prototype.lookupRule = function(path) {
    for (var i = 0; i < this.rules.length; i++)
        if (this.rules[i].checkMatch(path))
            return this.rules[i];
            
    return null;
}
