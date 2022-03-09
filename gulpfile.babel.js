import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import del from 'del';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import embedSVG from 'gulp-embed-svg';
import njk from 'gulp-nunjucks-render';

const PRODUCTION = yargs.argv.prod;
const autoReload = browserSync.create();
const sass = gulpSass(nodeSass);

const paths = {
  html: {
    src: 'src/html/pages/*.+(html|njk)',
    dest: 'dist',
  },
  styles: {
    src: 'src/scss/app.scss',
    dest: 'dist/css',
  },
  images: {
    src: 'src/images/**/*.+(jpg|jpeg|png|svg|gif|webp)',
    dest: 'dist/images',
  },
  copy: {
    src: [
      'src/**/*',
      '!src/{html,images,js,scss}',
      '!src/{html,images,js,scss}/**/*',
    ],
    dest: 'dist',
  },
  scripts: {
    src: 'src/js/app.js',
    dest: 'dist/js',
  },
};

export const serve = (done) => {
  autoReload.init({
    server: {
      browser: '/mnt/c/Program Files/Firefox Developer Edition/firefox.exe',
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

export const html = () => {
  return src(paths.html.src)
    .pipe(
      njk({
        path: ['src/html/'],
      })
    )
    .pipe(embedSVG({ root: 'src/images', xmlMode: false }))
    .pipe(dest(paths.html.dest));
};

export const styles = () => {
  return src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie10' })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest(paths.styles.dest))
    .pipe(autoReload.stream());
};

export const images = () => {
  return src(paths.images.src).pipe(dest(paths.images.dest));
};

export const copy = () => {
  return src(paths.copy.src).pipe(dest(paths.copy.dest));
};

export const scripts = () => {
  return src(paths.scripts.src)
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
    .pipe(dest(paths.scripts.dest));
};

export const watchFiles = () => {
  watch('src/html/**/*', series(html, reload));
  watch('src/scss/**/*.scss', series(styles));
  watch('src/images/**/*.+(jpg|jpeg|png|svg|gif|webp)', series(images, reload));
  watch(
    [
      'src/**/*',
      '!src/{html,images,js,scss}',
      '!src/{html,images,js,scss}/**/*',
    ],
    series(copy, reload)
  );
  watch('src/js/**/*.js', series(scripts, reload));
};

export const dev = series(
  clean,
  parallel(html, styles, images, copy, scripts),
  serve,
  watchFiles
);
export const build = series(
  clean,
  parallel(html, styles, images, copy, scripts)
);
export default dev;
