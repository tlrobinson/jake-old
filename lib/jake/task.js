var Task = exports.Task = function(name) {
    this.name = name;
    this.dependencies = [];
    this.actions = [];
    
    for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] === "string" || Array.isArray(arguments[i]))
            this.depends(arguments[i]);
        else if (typeof arguments[i] === "function")
            this.action(arguments[i]);
    }
}

Task.prototype.dep = function() {
    print("Task method 'dep' is deprecated. Please use 'depends'.");
    return this.depends.apply(this, arguments);
}

Task.prototype.depends = function() {
    for (var i = 0; i < arguments.length; i++)
        this.dependencies = this.dependencies.concat(arguments[i]);

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
