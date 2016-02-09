var gulp = require('gulp');
var sass = require('gulp-sass');

var config = {
  sassPath: './sass/'
}

gulp.task('sass', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css/'));
});

// fonts source and distribution folder
//=====================================
    
// copy bootstrap required fonts to root
gulp.task('fonts', function () {
    gulp.src('./node_modules/bootstrap/dist/fonts/**/*.*')
        .pipe(gulp.dest('./fonts'));
});

//watch task
gulp.task('default',function() {
    gulp.watch('./sass/**/*.scss',['sass','fonts']);
});