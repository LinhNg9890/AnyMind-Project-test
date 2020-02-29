var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var sass = require('gulp-sass');

// Compile SASS files from /sass into /css
gulp.task('sass', function() {
    return gulp.src('app/scss/index.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', gulp.series('sass', function() {
    return gulp.src('app/css/index.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
}));

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('app/js/index.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/js/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Run everything
gulp.task('default', gulp.parallel('sass', 'minify-css', 'minify-js'));

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})



// Dev task with browserSync  
gulp.task('dev', gulp.parallel('browserSync', 'sass', 'minify-css', 'minify-js', function() {
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
}));
