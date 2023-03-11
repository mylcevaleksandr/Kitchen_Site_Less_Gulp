const gulp = require( "gulp" );
const htmlMin = require( "gulp-htmlmin" );
const less = require( "gulp-less" );
const concatCss = require( "gulp-concat-css" );
const cssMin = require( "gulp-cssmin" );
const rename = require( "gulp-rename" );
const jsMin = require( "gulp-jsmin" );
const imageMin = require( "gulp-imagemin" );
const browserSync = require( "browser-sync" ).create();
const dest = "docs";

gulp.task( "html", () => {
    return gulp.src( "src/*.html" )
        .pipe( htmlMin( { collapseWhitespace: true } ) )
        .pipe( gulp.dest( dest ) );
} );

// собирает все файлы less в один css, минифицирует его и добавляет .min к названию.
gulp.task( "less", () => {
    return gulp.src( "./src/styles/*.less" )
        .pipe( less() )
        .pipe( concatCss( "style.css" ) )
        .pipe( cssMin() )
        .pipe( rename( { suffix: ".min" } ) )
        .pipe( gulp.dest( "docs/styles" ) );
} );

gulp.task( "jsMin", function () {
    gulp.src( "src/JS/*.js" )
        .pipe( jsMin() )
        .pipe( rename( { suffix: ".min" } ) )
        .pipe( gulp.dest( "docs/JS" ) );
} );

//сжимает все картинки
gulp.task( "imgSquash", () => {
    return gulp.src( "./src/images/*.png" )
        .pipe( imageMin() )
        .pipe( gulp.dest( "docs/images" ) );
} );


// запускает страничку, следит за изменениями в файлах и перезагружает сайт

gulp.task( "browser-sync", function () {
    browserSync.init( {
        server: {
            baseDir: "docs",
            port: 3000
        }
    } );

    gulp.watch( [ "src/*.html", "src/styles/*.less", "src/JS/*.js" ] ).on( "change", browserSync.reload );
} );


gulp.task( "watch", () => {
    gulp.watch( "src/*.html" ).on( "change", gulp.parallel( "html" ) );
    gulp.watch( "src/JS/*.js" ).on( "change", gulp.parallel( "jsMin" ) );
    gulp.watch( "src/styles/*.less" ).on( "change", gulp.parallel( "less" ) );
} );

gulp.task( "default", gulp.parallel(
    "browser-sync",
    "watch",
) );


// /нужен jsб autoprefixer минификация и сжатие изображений