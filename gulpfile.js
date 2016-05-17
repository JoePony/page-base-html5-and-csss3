var gulp=require('gulp');
var uglify=require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),    //css压缩
    rename = require('gulp-rename');           //重命名

//处理scss编译
// var dest='static/css';        //输出路径
// gulp.task('styles', function() {
//   return sass(src, { style: 'expanded' })
//     .pipe(autoprefixer('last 2 version', 'safari 2', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) //加浏览器兼容前缀
//     .pipe(gulp.dest(dest))                     //指定目标路劲
//     .pipe(rename({suffix: '.min'}))            //加.min
//     .pipe(minifycss())                         //压缩css
//     .pipe(gulp.dest(dest));                    //指定目标路劲
// });

//压缩css
gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')       //源文件路径
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/css'));         //压缩后路径
});

//压缩js
gulp.task('minify-js', function() {
    return gulp.src('src/js/*.js')       //源文件路径
    // .pipe(concat('main.js'))    //合并所有js到main.js
    // .pipe(gulp.dest('minified/js'))    //输出main.js到文件夹
    // .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(uglify())    //压缩
    .pipe(gulp.dest('static/js'));  //输出到压缩后路径
});

//实时监测
// gulp.task('watch',function(){
//     gulp.watch(src,['styles']);
//     livereload.listen();
//     gulp.watch(['static/css/**']).on('change', livereload.changed);  //免刷新
// });
gulp.task('default', ['minify-css','minify-js']);  //最终执行


