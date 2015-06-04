// Dependencies
var gulp = require("gulp");
//var browserSync = require("browser-sync");
var connectRewrite  = require("connect-modrewrite");

// Style
var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");

// Browserify
var browserify = require("browserify");
var reactify = require("reactify");
var watchify = require("watchify");
var source = require("vinyl-source-stream");


// Minification
var minifycss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

// Images
var jpegtran = require("imagemin-jpegtran");

// Utility
var gulpif = require("gulp-if");
var argv = require("yargs").argv;
var preprocess = require("gulp-preprocess");

// Low-level tasks
/*gulp.task("browser-sync", function () {

    browserSync({
        server: {
            baseDir: "./public/",
            port: 3001,
            middleware: [
                connectRewrite([
                    "!\\.\\w+$ /index.html [L]"
                ])
            ]
        },
        open: false
    });
});*/

gulp.task("scripts", function () {

    var bundler = browserify({
        entries: [ "./source/scripts/app.js" ],
        transform: [ reactify ],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    var watcher = watchify( bundler );

    return watcher
        .on( "update", function () {
            watcher.bundle()
                .pipe( source( "app.js" ) )
                .pipe( gulp.dest( "./public/scripts" ) );
        })
        .bundle()
        .pipe( source( "app.js" ) )
        .pipe( gulp.dest( "./public/scripts" ) );
});


gulp.task("copy:images", function () {

    gulp.src( "./source/images/**/*.*" )
        .pipe( gulpif(argv.production, jpegtran()()) )
        .pipe( gulp.dest("./public/images") );
});


//gulp.task("copy:data", function () {
//
//    gulp.src( "./source/data/**/*.*" )
//        .pipe( gulp.dest("./public/data") );
//});


gulp.task("copy:vendor", function () {

    gulp.src(["./source/scripts/vendor/**/*.*" ])
        .pipe(gulp.dest("./public/scripts/vendor"));
});


//gulp.task("copy:html", function () {
//
//    gulp.src( ["./source/*.html"] )
//        .pipe( gulp.dest("./public/") );
//});

var autoprefixerBrowsers = [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 23',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task("sass", function () {

    gulp.src('./source/stylus/main.styl')
        .pipe(stylus({
            'include css': true
        }))
        .pipe(autoprefixer({
            browsers: autoprefixerBrowsers
        }))
        .pipe(gulp.dest("./public/css/"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest("./public/css/"))
});


// High level tasks
gulp.task("copy", [ "copy:vendor", /*"copy:html",*/ "copy:images"/*, "copy:data"*/ ]);

gulp.task("default", [ "scripts", "sass", "copy" ]);

gulp.task("watch", [ "default", "browser-sync" ], function () {

    gulp.watch([ "source/scripts/**/*.{js,json}"], [ "scripts" ] );
    //gulp.watch([ "source/*.html" ], [ "copy:html", browserSync.reload ] );
    gulp.watch([ "source/images/**/*.*" ], [ "copy:images" ] );
    //gulp.watch([ "source/data/**/*.*" ], [ "copy:data" ] );
    gulp.watch([ "source/style/**/*.scss" ], [ "sass" ]);

    //gulp.watch([ "public/**/*.{js,html,css}" ], browserSync.reload );
});