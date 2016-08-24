var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

    gulp.task('scripts', function(){
      gulp.src('js/**/*.js')
          .pipe(uglify())
          .pipe(rename({
            suffix: '.min'
          }))
          .pipe(gulp.dest('minjs'));
    });

    gulp.task('styles',function(){
        return sass('sass/**/*.scss', {
            style: 'compressed'
        })
                .pipe(prefix({
                  browser: ['last 2 versions'],
                  cascade: false
                }))
                .pipe(gulp.dest('css'));
    });

    gulp.task('watch', function(){
        gulp.watch('js/**/*.js', ['scripts']);
        gulp.watch('sass/**/*.scss', ['styles']);
    });

    gulp.task('default', ['scripts', 'styles' , 'watch']);
