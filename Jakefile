var file = require("file");

// circular
jake.task("circular").deps("foo1");
jake.task("foo1").deps(["foo2"]);
jake.task("foo2").deps(["foo1"]);

// example
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

jake.file("foobar").deps(["barfoo"]).action(function() {
    print("writing");
    file.write("foobar", "baz");
})

jake.file("barfoo").action(function() {
    print("barfoo");
});

jake.directory("barrr/baz/foo");

jake.task("fooo").deps("Jakefile")

// defaut
jake.task("default").deps(["build", "fooo", "barrr/baz/foo"]);