const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const config  = require('./config.json');

gulp.task('clone', () => {
    return gulp.src(`${config.src}/**/*.js`)
        .pipe(gulp.dest(`${config.dev}`))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename((path) => {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(`${config.dist}`))
})

gulp.task('browser-sync', ['clone'], () => {
    browserSync.init({
        server: config.root,
        open: true,
        port: config.port,
        startPath: config.root
    });
    gulp.watch(`${config.src}/**/*.js`, ['clone']).on('change', browserSync.reload);
    gulp.watch(`${config.root}/**/*.html`).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);
