var FileTask = require("./filetask").FileTask;

var Rule = exports.Rule = function(target) {
    this.target = target;
    this.sources = null;
    this.builds = null;
}

Rule.prototype.source = function(source) {
    this.sources = source;
    //this.sources.push(source);
    return this;
}

Rule.prototype.build = function(build) {
    this.builds = build;
    //this.builds.push(build);
    return this;
}

Rule.prototype.generateTask = function(target) {
    var rule = this,
        task = new FileTask(target),
        deps = this.generateDependencies(target);
        
    task.action(function() {
        rule.builds(target, deps);
    });
    
    return task;
}

Rule.prototype.generateDependencies = function(target) {
    if (typeof this.sources === "function")
        return this.sources(target);
    
    if (typeof this.sources === "string")
        return [target.replace(/\.[^.]+$/, this.sources)];
    
    print("Warning: couldn't generate dependencies");
    return [];
}

Rule.prototype.checkMatch = function(path) {
    var target = this.target;
    
    if (typeof target === "string" && path.lastIndexOf(target) === (path.length - target.length))
        return true;
        
    else if (target && target.constructor === RegExp && target.test(path))
        return true;
        
    return false;
}
