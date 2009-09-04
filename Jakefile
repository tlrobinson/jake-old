var file = require("file");

with(require("jake")) {

    // circular
    task("circular").depends("foo1");
    task("foo1").depends(["foo2"]);
    task("foo2").depends(["foo1"]);

    // example
    task("build").depends(["generate_html", "copy_images"]);
    task("generate_html").depends(["create_directories"]).action(function() {
        print("generate_html!");
    });
    task("copy_images").depends(["create_directories"]).action(function() {
        print("copy_images!");
    });
    task("create_directories").action(function() {
        print("create_directories!");
    });

    file("foobar").depends(["barfoo"]).action(function() {
        print("writing");
        file.write("foobar", "baz");
    })

    file("barfoo").action(function() {
        print("barfoo");
    });

    directory("barrr/baz/foo");

    task("fooo").depends("Jakefile")

    // defaut
    task("default").depends(["build", "fooo", "barrr/baz/foo"]);


    task("a1").depends("b1").action(function() {
        print("a1")
    });
}