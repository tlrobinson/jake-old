var Task = exports.Task = function(name) {
    this.name = name;
    this.dependencies = [];
    this.actions = [];
}

Task.prototype.deps = function(dependency) {
    this.dependencies = this.dependencies.concat(dependency);
    return this;
}

Task.prototype.action = function(action) {
    this.actions.push(action);
    return this;
}

Task.prototype.isNeeded = function() {
    return true;
}

Task.prototype.invoke = function() {
    this.actions.forEach(function(action) {
        action();
    }, this);
}
