// define
var gulp = require('gulp');
var config = require('./config.json');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var _extend = require('util')._extend,
    browser = require('browser-sync'),
    runSequence = require('run-sequence');

// path
var DEV_PATH = 'dev';
var PRE_PATH = 'preview';
var RELEASE_PATH = 'release';
var WP_PATH = '../wp/wp-content/themes/prdinternshiptheme';
var path = {
    sp: {
        html: {
            src_ect: [DEV_PATH + '/ect/**/*.ect',"!" + DEV_PATH + '/ect/**/_*.ect'],
            src_ect_all: [DEV_PATH + '/ect/**/*.ect','./config.json'],
            src: PRE_PATH + '/*.html'
        },
        sass: {
            src: DEV_PATH + '/sass/**/*.scss',
            dest: PRE_PATH + '/css',
            preview: PRE_PATH + '/css/**/*.css',
            release: RELEASE_PATH + '/css',
            wp: WP_PATH + '/css'
        },
        js: {
            src: DEV_PATH + '/js/**/*.js',
            dest: PRE_PATH + '/js',
            preview: PRE_PATH + '/js/**/*.js',
            src_release: RELEASE_PATH + '/js/**/*.js',
            release: RELEASE_PATH + '/js',
            wp: WP_PATH + '/js',
            wp_min: WP_PATH + '/js/min'
        },
        images: {
            src: DEV_PATH + '/images/**/*',
            dest: PRE_PATH + '/images',
            preview: PRE_PATH + '/images/**/*',
            release: RELEASE_PATH + '/images',
            wp: WP_PATH + '/images'
        },
        sprite: {
            src: DEV_PATH + '/images/sprite/*',
            dest: {
                img: PRE_PATH + '/images/sprite',
                sass: DEV_PATH + '/sass/module'
            },
            wp: WP_PATH + '/images/sprite'
        },
        lib: {
            src: DEV_PATH + '/lib/**/*',
            dest: PRE_PATH + '/lib',
            wp: WP_PATH + '/lib'
        }
    }
};

// task html sp
gulp.task('html', function () {
    return gulp.src(path.sp.html.src_ect)
        .pipe($.plumber())
        .pipe($.ect({data: config.ect}))
        .pipe(gulp.dest(PRE_PATH))
        .pipe(browser.reload({stream: true}));
});

// task css sp
gulp.task('style', function () {
    gulp.src(path.sp.sass.src)
        .pipe($.plumber())
        .pipe($.rubySass({
            style:'compressed'
        }))
        .pipe($.autoprefixer(['last 3 version', 'ie >= 9', 'Android 4.0']))
        .pipe(gulp.dest(path.sp.sass.dest))
        .pipe(browser.reload({stream: true}));
});

// task js sp
gulp.task('js', function(){
    return gulp.src(path.sp.js.src)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(path.sp.js.dest))
        .pipe(browser.reload({stream: true}));
});

// task lib
gulp.task('lib', function(){
    return gulp.src(path.sp.lib.src)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(path.sp.lib.dest))
        .pipe(browser.reload({stream: true}));
});

// task image sp
gulp.task('images',function(){
    return gulp.src(path.sp.images.src)
        .pipe($.plumber())
        .pipe($.imagemin())
        .pipe(gulp.dest(path.sp.images.dest));
});

// task sprite(spritesmith) sp
gulp.task('sprite', function () {
    return gulp.src(path.sp.sprite.src)
        .pipe($.plumber())
        .pipe($.foreach(function(stream, file){
            if(file.isDirectory()) {
                var name = file.path.substring(file.path.lastIndexOf('/')+1);
                if (!name) return stream;

                var options = _extend({
                    imgName: name + config.sprite.imgExtension,
                    cssName: '_' + name + config.sprite.cssExtension,
                    imgPath: '../images/sprite/' + name + config.sprite.imgExtension,
                    cssTemplate: './spriteTemplate.mustache',
                    cssOpts: {
                        prefix: name
                    }
                },config.sprite.options);
                var strm = gulp.src(file.path + '/*' + config.sprite.extension)
                    .pipe($.plumber())
                    .pipe($.spritesmith(options));
                strm.img.pipe(gulp.dest(path.sp.sprite.dest.img));
                strm.css.pipe(gulp.dest(path.sp.sprite.dest.sass));
                return strm;
            }
            return stream;
        }));
});

// task clean
gulp.task('clean', function () {
    return gulp.src(path.sp.html.src)
        .pipe($.clean());
});

// task server start
gulp.task('serv', function () {
    browser.init(null, {
        server: {
            baseDir: PRE_PATH
        },
        port : 3001
    });
});

// task server reload
gulp.task('reload', function () {
    browser.reload();
});

// task press
gulp.task('usemin', function () {
    return gulp.src(path.sp.html.src)
        .pipe($.usemin({
            // html: [],
            //css: [$.minifyCss()],
            js: [$.uglify()]
        }))
        .pipe(gulp.dest(RELEASE_PATH));
});

// task copy
gulp.task('copy', function() {
  // lib folder
  gulp.src(path.sp.lib.src)
    .pipe(gulp.dest(path.sp.lib.dest));
});

// task release
gulp.task('build', function () {
    runSequence('clean',['html','js','lib',],'usemin');
    //cssはそのままコピー
    gulp.src(path.sp.sass.preview)
        .pipe(gulp.dest(path.sp.sass.release));

    //画像はそのままコピー
    gulp.src(path.sp.images.preview)
        .pipe(gulp.dest(path.sp.images.release));
});

// task sp
gulp.task('default', ['html','style','js','images','copy','serv'], function () {
    gulp.watch(path.sp.html.src_ect_all,['html']);
    gulp.watch(path.sp.sass.src,['style']);
    gulp.watch(path.sp.js.src,['js']);
    gulp.watch(path.sp.images.src,['images']);
    gulp.watch(path.sp.lib.src,['lib']);

    //js結合
    return gulp.src(path.sp.html.src)
        .pipe($.usemin())
        .pipe(gulp.dest(PRE_PATH));
});

// task WordPressにも適応
gulp.task('wp', function () {
    // cssはそのままコピー
    gulp.src(path.sp.sass.preview)
        .pipe(gulp.dest(path.sp.sass.wp));

    // imagesはそのままコピー
    gulp.src(path.sp.images.preview)
        .pipe(gulp.dest(path.sp.images.wp));

    // js folder(圧縮前のデータ)
    gulp.src(path.sp.js.preview)
        .pipe(gulp.dest(path.sp.js.wp));

    // js folder(圧縮後のデータ)
    gulp.src(path.sp.js.src_release)
        .pipe(gulp.dest(path.sp.js.wp_min));

    // lib folder(圧縮前のデータ)
    gulp.src(path.sp.lib.src)
        .pipe(gulp.dest(path.sp.lib.wp));

});