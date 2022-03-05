import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
// import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import embedSVG from 'gulp-embed-svg';

// TODO: HTML Includes: https://dev.to/caiojhonny/html-includes-with-gulp-js-2def
// TODO: Add paths, example: 1) https://css-tricks.com/just-sharing-my-gulpfile/ + 2) https://www.sitepoint.com/introduction-gulp-js/

const PRODUCTION = yargs.argv.prod;
const autoReload = browserSync.create();
const sass = gulpSass(nodeSass);

export const serve = (done) => {
  autoReload.init({
    server: {
      baseDir: 'dist/',
    },
  });
  done();
};

export const reload = (done) => {
  autoReload.reload();
  done();
};

export const clean = () => del(['dist']);

export const styles = () => {
  return src('src/scss/app.scss')
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie8' })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(autoReload.stream());
};

export const inlineSVG = () => {
  return src('src/**/*.html')
    .pipe(embedSVG({ root: 'src/images', xmlMode: false }))
    .pipe(dest('dist'));
};

// export const images = () => {
//   return src('src/images/**/*.{jpg,jpeg,png,svg,gif,webp}')
//     .pipe(gulpif(PRODUCTION, imagemin()))
//     .pipe(dest('dist/images'));
// };

export const copy = () => {
  return src([
    'src/**/*',
    '!src/**/*.html',
    '!src/{images,js,scss}',
    '!src/{images,js,scss}/**/*',
  ]).pipe(dest('dist'));
};

export const scripts = () => {
  return src('src/js/app.js')
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [],
                },
              },
            },
          ],
        },
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        output: {
          filename: 'app.js',
        },
      })
    )
    .pipe(dest('dist/js'));
};

export const watchForChanges = () => {
  watch('src/**/*.html', series(inlineSVG, reload));
  watch('src/scss/**/*.scss', series(styles));
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif,webp}', series(reload));
  watch(
    [
      'src/**/*',
      '!src/**/*.html',
      '!src/{images,js,scss}',
      '!src/{images,js,scss}/**/*',
    ],
    series(copy, reload)
  );
  watch('src/js/**/*.js', series(scripts, reload));
};

export const dev = series(
  clean,
  parallel(inlineSVG, styles, copy, scripts),
  serve,
  watchForChanges
);
export const build = series(clean, parallel(inlineSVG, styles, copy, scripts));
export default dev;
