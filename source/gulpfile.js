var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var wrap = require('gulp-wrap');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('browser-sync',['sass', 'build','cp'], function(){
  browserSync({
    server: {
      baseDir: '..'
    }
  });
});

gulp.task('build', function(){
  gulp.src("pages/*.html")
          .pipe(wrap({src:"layout/default.html"}))
          .pipe(gulp.dest('..'));
});

gulp.task('cp', function () {
  return gulp.src('js/main.js', { base: '.' })
         .pipe(gulp.dest('..'));
});

gulp.task('rebuild',['build'], function(){
  browserSync.reload();
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
gulp.task('sass',function(){
  gulp.src('styles/main.scss')
          .pipe(sass()).on('error', handleError)
          .pipe(prefix())
          .pipe(gulp.dest('../styles'))
          .pipe(browserSync.reload({stream:true}));
});

gulp.task('imagemin', function(){
  return gulp.src('assets/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('../assets'));
});

gulp.task('watch', function(){
  gulp.watch(['**/*.html'], ['rebuild']);
  gulp.watch(['styles/*.scss'], ['sass']);
  gulp.watch(['js/main.js'], ['cp']);
});

gulp.task('default',['browser-sync', 'watch', 'imagemin']);