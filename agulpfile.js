var {series, task, dest, src, watch} = require("gulp")
var browserify = require("browserify")
var babelify = require("babelify")
var source = require("vinyl-source-stream")
var concat = require("gulp-concat")
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify")
const uglifycss = require("gulp-uglifycss")
var gls = require("gulp-live-server")




var paths = {
    main_js : ["client/app.jsx"],
    css : ["client/**/*.*css"],
    js : ["client/**/*.js*"]
}

async function prodJS () {
    return browserify(paths.main_js)
    .transform(babelify)
    .bundle()
    .on('error', (err)=>{
    console.log('JS Error', err);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest('static/js'));
    
}

async function prodCSS () {
    return src("./static/css/*.css")
        .pipe(uglifycss({
            "uglyComments": true
        })).pipe(dest("./static/css"))
    
}

task("default", series(prodCSS, prodJS))

async function js() {
    return browserify(paths.main_js)
    .transform(babelify)
    .bundle()
    .on("error", (err)=> {
        console.log("js-error", err)
    })
    .pipe(source("bundle.js"))
    .pipe(dest("static/js"))
}




async function css (callback) {
    return src(paths.css)
    .pipe(concat("main.css"))
    .pipe(dest("static/css"))
}




task("dev", series(js), function() {
    watch(paths.css, series(css));
     watch(paths.js, series(js))
 })

 task("js", series(js))




//Start the app server

var server = gls("server/server.js");
server.start();


//Reload server when backend files change

watch("server/**/*.js", 
    server.start.bind(server)()
)


//Notify server when frontend files change

watch(["static/**/*.{css,js,html"], function(file) {
    server.notify.apply(server, [file])
})









