var gulp = require('gulp');
require('@battr/battr-build/lib/default-config').names = {
  file: 'battr-components',
  module: 'battrComponents',
  styles: 'battr-components'
};
var paths = require('@battr/battr-build/lib/default-config').paths;
paths.styles.all = [
  paths.src+'**/*.scss',
  'node_modules/@battr/battr-core/src/**/*.scss',
  'node_modules/@battr/battr-core-components/src/**/*.scss'
];
require('@battr/battr-build');


gulp.task('default', ['start-debug'])
