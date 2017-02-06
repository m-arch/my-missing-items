'use strict' ;

var gulp        = require('gulp');
var browserify  = require('browserify');
var gutil       = require('gulp-util');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var watchify    = require('watchify');
var uglify      = require('gulp-uglify')
var glob        = require('glob')

gulp.task('build', () =>{

    glob('./client/*.jsx', function(err, files){
	if (err) console.log(err);
	
	var tasks = files.map(function(entry) {
	    let bundler = browserify({
		debug: true,
		entries: [entry] 
	    })
		.transform("babelify", {presets: ["es2015", "react", "stage-0"]});
	    
	    bundler.on('log', (msg) => {
		gutil.log(gutil.colors.cyan('scripts') + ': ' + msg);
	    });
	    
	    const bundle = () => {
		return bundler.bundle()
		    .on('error', (err) => {
			console.error(err.message);
		    })
		    .pipe(source('app.min.js'))
		    .pipe(buffer())
		    .pipe(gulp.dest('./public/js/'));
	    }
	    
	    bundler = watchify(bundler);
	    bundler.on('update', bundle);
	    
	    return bundle();
	});
    });
});

gulp.task('default', [ 'build' ]);
