var gulp = require("gulp"); // 1
var browserify = require("browserify"); //2
var babelify = require("babelify"); //3
var source = require("vinyl-source-stream"); //4
var gls = require('gulp-live-server');
const sass = require("gulp-sass")(require("sass"))
const image = require("gulp-image")
var concat = require('gulp-concat');


var paths = {

    main_js : [ "client/app.jsx" ],
    css : [ 'client/components/**/*.*css' ],
    js : [ 'client/**/*.js*' ]
    
    };
    
    gulp.task("js", async function() {
    //Browserify bundles the JS.
    return browserify(paths.main_js)
    .transform(babelify) //———–> transpiles es6 to es5
    .bundle()
    .on("error", (err)=>{
    console.log("JS Error", err);
    })
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("static/js"));
    });


/* Gulpfile.js */




gulp.task('css', async function(callback) {
    return gulp.src(paths.css)
    .pipe(sass().once("error", sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('static/css/'));
    });

    gulp.task('image', async function ()  {
        gulp.src('client/assets/*')
        .pipe(image())
          .pipe(gulp.dest('static/assets/'));
      });

    gulp.task('dev', gulp.series('image', "css",  'js' , function () {
        // Generic watch tasks for SASS and Browserify
        gulp.watch(paths.css, gulp.series('css' ));
        gulp.watch(paths.js, gulp.series('js'));



//Start the app server.
var server = gls('server/server.js', { stdio : 'inherit' });
server.start();

// Reload server when backend files change.
gulp.watch([ 'server/**/*.js' ], function() {
server.start.bind(server)();

})

gulp.watch([ 'static/**/*.{css,js,html}' ], function(file) {
    server.notify(file);
    });
    }));