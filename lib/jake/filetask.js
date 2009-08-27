var file = require("file"),
    Task = require("./task").Task;

var FileTask = exports.FileTask = function(name) {
    this.name = name;
    this.dependencies = [];
    this.actions = [];
}

FileTask.prototype = new Task();

FileTask.prototype.isNeeded = function() {
    var name = this.name,
        deps = this.dependencies;
        
    if (!file.exists(name))
        return true;
    
    for (var i = 0; i < deps.length; i++) {
        if (file.exists(deps[i])) {
            if (file.mtime(deps[i]) > file.mtime(name))
                return true;
        } else {
            print("Warning: dependency '" + deps[i] + "' for " + name + " doesn't exist")
        }
    }
    return false;
}
