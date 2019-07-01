'use strict';
var gulp = require('gulp');
//loading plugins
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'autoprefixer', 'cssnano', 'browser-sync', 'del', 'run-sequence', 'postcss-easing-gradients'],
});
//to call plugins, use plugins.name() without the gulp- prefix

// Error Handling
// -----------------

//custom error messaging through gulp-plumber and gulp-notify
function customPlumber(errTitle) {
  return plugins.plumber({
    errorHandler: plugins.notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Purr",
      // Ends the current pipe, so Gulp watch doesn't break
    })
  });
}

// Development Tasks
// -----------------


// Live-reloading task
gulp.task('browserSync', function() {
  //to close browser tab when browserSync disconnects
  plugins.browserSync.use({
    plugin: function () { /* noop */},
    hooks: {
        'client:js': require("fs").readFileSync("./closer.js", "utf-8")
    }
  });

  plugins.browserSync({
    server: {
    baseDir: '../dev',
    index: "index.html"
    },
    // Allow others on different WIFI network to connect to your server
    //tunnel: "test",
    // Disable pop-over notification
    notify: true,
    plugins: ['bs-rewrite-rules'],
    rewriteRules: [
        {
            match: /about-me/g,
            replace: "about-me.html",
        },
        {
            match: /portfolio/g,
            replace: "portfolio.html",
        },
        {
            match: /contact-me/g,
            replace: "contact-me.html",
        },
        {
            match: /current-explorations/g,
            replace: "current-explorations.html",
        },
    ],
    scriptPath: function (path, port, options) {
    return options.get("absolute");
    },
  });
})


// sass task with autoprefixer
gulp.task('sass', function () {
  var processors = [
      plugins.autoprefixer({browsers: ['last 5 version']}),
      plugins.postcssEasingGradients,
  ];
  return gulp.src('../dev/sass/main.scss')
    // Replacing plumber with customPlumber
    .pipe(customPlumber('Error Running Sass'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.postcss(processors))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('../dev/css'))
    .pipe(plugins.browserSync.stream());
});

//delete folder template
// gulp.task('clean:test', function() {
//   return plugins.del.sync('../test/index.html', {force: true});
// })

gulp.task('clean:icons', function () {
  return plugins.del([
    '../dev/icons/optimized/**/*', '../dev/icons/svgSprite/**/*'], {force:true}
  );
});

//Javascript dev: concatenate files for more critical libraries and site js
gulp.task('js-dev', function(){
  return gulp.src(['../dev/js/vendor-js-crit/jquery/jquery.js', '!../dev/js/vendor-js-crit/**/*.min.js', '../dev/js/vendor-js-crit/**/*.js',  '../dev/js/site.js', '../dev/js/chart-data.js','!../dev/js/dont-touch'])
  .pipe(customPlumber('Error Running JS-DEV'))
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))
  .pipe(plugins.concat('main.js'), {newline: ';'})
  .pipe(gulp.dest('../dev/js'))
  .pipe(plugins.browserSync.stream());
});

//minify svg files
gulp.task('svgmin', function () {
  return gulp.src('../dev/icons/originals/*.svg')
  // Replacing plumber with customPlumber
  .pipe(customPlumber('Error Running svgmin'))
  .pipe(plugins.svgmin())
  .pipe(gulp.dest('../dev/icons/optimized'));
});

// SVG Config for svgSprite
var svgConfig = {
  mode: {
    symbol: { // symbol mode to build the SVG
      render: {
        css: false, // CSS output option for icon sizing
        scss: false // SCSS output option for icon sizing
      },
      dest: '.', // destination folder
      prefix: '.svg--%s', // BEM-style prefix if styles rendered
      sprite: 'sprite.svg', //generated sprite name
      example: true // Build a sample page, please!
    }
  }
};

// Create SVG Sprite
gulp.task('svg-sprite', function() {
    return gulp.src('**/*.svg', {cwd: '../dev/icons/optimized'})
    .pipe(customPlumber('Error Running SVG Sprite'))
      .pipe(plugins.svgSprite(svgConfig))
      .pipe(gulp.dest('../dev/icons/svgSprite'))
      .pipe(plugins.browserSync.reload({
      stream: true
    }));
});

//combining svgmin and svgsprite into a single task
gulp.task('svgCreate', function () {
  //minify new icons and generate svg sprite
  return gulp.src('../dev/icons/originals/*.svg')
    .pipe(customPlumber('Error Running svgCreate task'))
    //minify icons
    .pipe(plugins.svgmin())
    .pipe(gulp.dest('../dev/icons/optimized'))
    //generate sprite
    .pipe(plugins.svgSprite(svgConfig))
        .pipe(gulp.dest('../dev/icons/svgSprite'))
        .pipe(plugins.browserSync.reload({
        stream: true
      }));
});

// Deployment Tasks
// -----------------

//minify CSS task
gulp.task('cssnano', function () {
    var processors = [
        plugins.cssnano(),
    ];
    return gulp.src('../dev/css/*.css')
        .pipe(customPlumber('Error Running cssnano'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.postcss(processors))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('../dist/css'))
        .pipe(plugins.browserSync.stream());
});

// Optimize new/updated images
gulp.task('imageMin', function(){
  return gulp.src(['../dev/images/**/*.+(png|jpg|jpeg|gif|svg)','!../dev/images/fixed/**/*'])
  // Caching images that ran through imagemin to speed up process
  .pipe(plugins.cache(plugins.imagemin({
    optimizationLevel: 5,
    progressive: true,
      // Setting interlaced to true
      interlaced: true
  })))
  .pipe(gulp.dest('../dist/images'));
});

//copy fixed images from dev to dist
gulp.task('imageFixedCopy', function() {
  return gulp.src('../dev/images/fixed/**/*')
  .pipe(gulp.dest('../dist/images'))
})

//build and minify JS file
gulp.task('js-build', function(){
  return gulp.src(['../dev/js/vendor-js-crit/jquery/jquery.js', '!../dev/js/vendor-js-crit/**/*.min.js', '../dev/js/vendor-js-crit/**/*.js',  '../dev/js/site.js', '../dev/js/chart-data.js','!../dev/js/dont-touch'])
  .pipe(customPlumber('Error Running JS-BUILD'))
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.concat('main.js'), {newline: ';'})
  .pipe(plugins.uglify())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('../dist/js'));
});

//copy html from  dev to dist
gulp.task('htmlDistCopy', function() {
  return gulp.src('../dev/*.html')
  .pipe(gulp.dest('../dist'))
});

//copy non-crit JS from  dev to dist
gulp.task('noncritJSDistCopy', function() {
  return gulp.src('../dev/js/vendor-js-non-crit/**/*')
  .pipe(gulp.dest('../dist/js/vendor-js-non-crit'))
});

//copy fonts from dev to dist
gulp.task('fontsDistCopy', function() {
  return gulp.src('../dev/fonts/**/*')
  .pipe(gulp.dest('../dist/fonts'))
});

//copy images from dev to dist when not using
gulp.task('imagesDistCopy', function() {
  return gulp.src(['../dev/images/**/*', '!../dev/images/{graphic-files,graphic-files/**}', '!../dev/images/{ignore,ignore/**}'])
  .pipe(gulp.dest('../dist/images'))
});

//copy icon from  dev to dist
gulp.task('iconDistCopy', function() {
  return gulp.src('../dev/icons/svgSprite/*')
  .pipe(gulp.dest('../dist/icons/svgSprite'))
});

//copy htaccess file from  dev to dist
gulp.task('serverFilesDistCopy', function() {
  return gulp.src('../server-files/*')
  .pipe(gulp.dest('../dist'))
});

//copy htaccess file from  dev to dist
gulp.task('htaccessDistCopy', function() {
  return gulp.src('../server-files/.htaccess')
  .pipe(gulp.dest('../dist'))
});


// Miscellaneous Tasks
// -----------------

//outputs module names stored in plugins array to see what name to call
gulp.task('pluginsOutput', function() {
   console.log(plugins);
})

//copy tasks template: copy files from one folder source to a destination
// gulp.task('fonts', function() {
//   return gulp.src('app/fonts/**/*')
//   .pipe(gulp.dest('dist/fonts'))
// })

//delete folder template
gulp.task('clean:dist', function() {
  return plugins.del.sync('../dist/*', {force: true});
})

// Development instructions
// -----------------
//dependency array for browserSynce and sass to ensure those tasks are runned once before watch begins or we can use the run-sequence module
gulp.task('default', ['sass','browserSync'],function(){
  //gulp.watch('../sass/**/*.scss',['postcss']); //need to compile SASS first
  gulp.watch(['../dev/js/**/site.js','../dev/js/**/chart-data.js'],['js-dev']);
  gulp.watch(['../dev/sass/**/*.scss'],['sass']);
  gulp.watch('../dev/icons/originals/**/*.svg', ['clean:icons','svgCreate']);
  gulp.watch('../dev/icons/svgSprite/**/*.svg', plugins.browserSync.reload);
  gulp.watch(['../dev/*.html'], plugins.browserSync.reload);
  gulp.watch(['../dev/js/concat-site.js'], plugins.browserSync.reload);
});


// Deployment instructions
// -----------------
//run-sequence task example that is similar to task watch above, then the array for ['browserSync', 'sass'] can be removed
gulp.task('build', function (callback) {
  plugins.runSequence(['clean:dist','cssnano','js-build', 'noncritJSDistCopy', 'htmlDistCopy', 'imagesDistCopy', 'iconDistCopy', 'serverFilesDistCopy'], callback)
})



