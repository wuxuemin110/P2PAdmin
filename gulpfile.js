var gulp = require('gulp'),
  
    historyApiFallback = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create();
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "app",
      middleware: [ historyApiFallback() ]
    }
  });
});

gulp.task('default', ['serve']);