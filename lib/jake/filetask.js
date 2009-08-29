var file = require("file"),
    Task = require("./task").Task;

var FileTask = exports.FileTask = function() {
    Task.apply(this, arguments);
}

FileTask.prototype = new Task();

FileTask.prototype.isNeeded = function() {
    var name = this.name,
        dep = this.dependencies;
        
    if (!file.exists(name))
        return true;
    
    for (var i = 0; i < dep.length; i++) {
        if (file.exists(dep[i])) {
            if (file.mtime(dep[i]) > file.mtime(name))
                return true;
        } else {
            print("Warning: dependency '" + dep[i] + "' for " + name + " doesn't exist")
        }
    }
    return false;
}
