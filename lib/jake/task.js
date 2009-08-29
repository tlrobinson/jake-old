var Task = exports.Task = function(name, dependency, action) {
    this.name = name;
    this.dependencies = dependency ? [].concat(dependency) : [];
    this.actions = action ? [].concat(action) : [];
}

Task.prototype.dep = function(dependency) {
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
        action.call(this);
    }, this);
}
