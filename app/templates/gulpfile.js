var gulp = require('gulp'),
    loadPlugins = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return gulp.src('app/styles/main.css')
    .pipe(loadPlugins.autoprefixer('last 1 version'))
    .pipe(gulp.dest('tmp/styles'));
});

gulp.task('jshint', function() {
  var jshint = loadPlugins.jshint,
      reporter = jshint.reporter;

  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(reporter('jshint-stylish'))
    .pipe(reporter('fail'));
});

gulp.task('html', ['styles'], function() {
  var jsFilter = loadPlugins.filter('**/*.js'),
      cssFilter = loadPlugins.filter('**/*.css');

  return gulp.src('app/*.html')
    .pipe(loadPlugins.useref.assets({
      searchPath: '{tmp,app,vendor}'
    }))
    .pipe(jsFilter)
    .pipe(loadPlugins.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(loadPlugins.csso())
    .pipe(cssFilter.restore())
    .pipe(loadPlugins.useref.restore())
    .pipe(loadPlugins.useref())
    .pipe(gulp.dest('public'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(loadPlugins.cache(loadPlugins.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public/images'));
});

gulp.task('extras', function() {
  return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
  return gulp.src(['tmp', 'public'], { read: false }).pipe(loadPlugins.clean());
});

gulp.task('build', ['jshint', 'html', 'images', 'extras'], function() {
  return gulp.src('public/**/*')
    .pipe(loadPlugins.size({
      showFiles: true,
      gzip: true
    }));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('serve', function() {
  require('./lib/server').listen(function() {
    require('opn')('http://localhost:' + (process.env.PORT || 3000));
  });
});

gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'vendor'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['serve'], function() {
  var server = loadPlugins.livereload();

  gulp.watch([
    'app/*.html',
    'tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', function(file) {
    server.changed(file.path);
  });

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['jshint']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
