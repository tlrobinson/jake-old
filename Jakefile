var file = require("file");

jake.task("foo").deps(["bar"]);
jake.task("bar").deps(["foo"]);

jake.task("build").deps(["generate_html", "copy_images"]);

jake.task("generate_html").deps(["create_directories"]).action(function() {
    print("generate_html!");
});

jake.task("copy_images").deps(["create_directories"]).action(function() {
    print("copy_images!");
});

jake.task("create_directories").action(function() {
    print("create_directories!");
});

jake.task("baz").action(function() {
    print("baz")
});

jake.task("buzz").action(function() {
    print("buzz")
});

jake.file("foobar").deps(["barfoo"]).action(function() {
    print("writing");
    file.write("foobar", "baz");
})

jake.file("barfoo").action(function() {
    print("barfoo");
});

jake.directory("barrr/baz/foo");

jake.task("default").deps("build");