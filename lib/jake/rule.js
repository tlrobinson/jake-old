var FileTask = require("./filetask").FileTask;

var Rule = exports.Rule = function(target) {
    this.target = target;
    this.sources = null;
    this.builds = null;
    //this.sources = [];
    //this.buildSteps = [];
}

Rule.prototype.source = function(source) {
    this.sources = source;
    //this.sources.push(source);
    return this;
}

Rule.prototype.build = function(build) {
    this.builds = build;
    //this.buildSteps.push(build);
    return this;
}

Rule.prototype.generateTask = function(target) {
    var rule = this,
        task = new FileTask(target);
    
    var deps = this.generateDependencies(target);
    //task.deps(deps);
    task.action(function() { rule.builds(target, deps); });
    
    return task;
}

Rule.prototype.generateDependencies = function(target) {
    if (typeof this.sources === "function") {
        return this.sources(target);
    }
    else if (typeof this.sources === "string") {
        return [target.replace(/\.[^.]+$/, this.sources)];
    }
    print("Warning: couldn't generate dependencies");
    return [];
}
