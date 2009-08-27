var file = require("file"),
    Task = require("jake/task").Task,
    FileTask = require("jake/filetask").FileTask,
    Rule = require("jake/rule").Rule;

var tasks = exports.tasks = {};
var rules = exports.rules = [];

exports.trace = false;

exports.abort = function(message) {
    print("jake aborted!" + (message ? "\n" + message : ""));
    require("os").exit(1);
}

exports.task = function(name) {
    return addTask(new Task(name));
}

exports.file = function(name) {
    print("asdf:"+name)
    return addTask(new FileTask(name));
}

exports.directory = function(path) {
    var components = file.split(path),
        path = null;
    while (components.length) {
        path = path ? file.join(path, components.shift()) : components.shift();
        exports.file(path).action((function(p) { return function() { file.mkdirs(p) }; })(path));
    }
}

exports.rule = function(target) {
    return addRule(new Rule(target));
}


exports.run = function(name) {
    run(name, [], {});
}

function run(name, stack, completed) {
    if (!tasks.hasOwnProperty(name)) {
        var rule = lookupRule(name);
        if (rule) {
            addTask(rule.generateTask(name));
        }
        else if (file.exists(name)) {
            print("FIXME");
            return;
        }
        else {
            exports.abort("Don't know how to build task '"+name+"'");
        }
    }
    
    if (checkCircular(name, stack))
        exports.abort("Circular dependency detected: " + stack.concat(name).join(" => "));
    
    var task = tasks[name];
    
    if (exports.trace) print("** Invoke "+task.name)
    
    stack.push(task.name);
    task.dependencies.forEach(function(dependency) {
        run(dependency, stack, completed);
    });
    stack.pop();
    
    if (completed[task.name] !== true && task.isNeeded()) {
        if (exports.trace) print("** Execute "+task.name)
        task.invoke();
    }
    
    completed[task.name] = true;
}

function checkCircular(name, stack) {
    for (var i = 0; i < stack.length; i++)
        if (stack[i] === name)
            return true;
    return false;
}

function addTask(task) {
    if (tasks.hasOwnProperty(task.name))
        print("Warning: overriding task named " + task.name);
        
    tasks[task.name] = task;
    
    return task;
}

function addRule(rule) {
    rules.push(rule);
    
    return rule;
}

function lookupRule(path) {
    for (var i = 0; i < rules.length; i++)
        if (checkMatch(path, rules[i].target))
            return rules[i];
    return null;
}

function checkMatch(path, rule) {
    if (typeof rule === "string") {
        if (path.lastIndexOf(rule) === (path.length - rule.length)) {
            return true;
        }
        else if (rule && rule.constructor === RegExp) {
            if (rule.test(path))
                return true;
        }
    }
}
