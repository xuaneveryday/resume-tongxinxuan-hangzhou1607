//基础gulp模块
var gulp=require('gulp');
//webserver服务器模块
var webserver=require('gulp-webserver');

//mock数据操作，需要引入url及fs,但是url/fs是内置的，所以不需要安装
var url=require('url');

var fs=require('fs'); //fs ->filesystem

var sass=require('gulp-sass');

var webpack=require('gulp-webpack');

var named=require('vinyl-named');

var uglify=require('gulp-uglify');

var minifyCss=require('gulp-minify-css');
//版本管理
var rev=require('gulp-rev');
//版本
var revCollector=require('gulp-rev-collector');

var watch=require('gulp-watch');

var sequence=require('gulp-watch-sequence');

/*
1.创建src目录
2.在src下新建index.html（现在做的是spa，所以只有一个入口主文件）
3.实现index.html的文件复制操作，复制的目标是www
4.webserver的本地服务器配置（不是gulp-connect）
5.实现mock数据操作，先在根目录穿件mock目录，然后放置对应的json文件
*/

gulp.task('copy-index',function(){
	return gulp.src('./src/index.html').pipe(gulp.dest('www'));
})
gulp.task('copy-allimages',function(){
	return gulp.src("./src/img/**").pipe(gulp.dest('www/img'));
})

/*创建本地服务器任务*/
gulp.task('webserver',function(){
	gulp.src('./www').pipe(webserver({
		livereload:true,
		//directoryListing:true,
		open:true,
		middleware:function(req,res,next){
			//获取浏览器中的url，将url进行解析操作
			var urlObj=url.parse(req.url,true),
			method=req.method;

			switch(urlObj.pathname){
				case '/skill':
					//Content-Typek可以指定返回的文件可是类型
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/skill.json','utf-8',function(err,data){
						res.end(data)
					});
				case '/project':
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/project.json','utf-8',function(err,data){
						res.end(data)
					});
				case '/work':
					res.setHeader('Content-Type','application/json');
					fs.readFile('./mock/work.json','utf-8',function(err,data){
						res.end(data)
					});
				return;
			}
			// console.log(urlObj);

			next();//next是实现的循环
		}//end middleware

	}));//end gulp
})
gulp.task('sass',function(){
	return gulp.src('./src/styles/index.scss')
	.pipe(sass())
	.pipe(minifyCss())
	.pipe(gulp.dest('./www/css'));
})

gulp.task('packjs',function(){
	return gulp.src('./src/scripts/index.js').pipe(named()).pipe(webpack()).pipe(uglify()).pipe(gulp.dest('./www/js'));
})

//版本管理操作

var cssDistFiles=['./www/css/index.css'];
var jsDistFiles=['./www/js/index.js'];

gulp.task('verCss',function(){
	return gulp.src(cssDistFiles).pipe(rev()).pipe(gulp.dest('./www/css/'))
	.pipe(rev.manifest()).pipe(gulp.dest('www/ver/css'))
})

gulp.task('verjs',function(){
	return gulp.src(jsDistFiles).pipe(rev()).pipe(gulp.dest('./www/js/'))
	.pipe(rev.manifest()).pipe(gulp.dest('www/ver/js'))
})

//文件的字符串替换操作
gulp.task('html',function(){
	gulp.src(['./www/ver/**/*.json','./www/*.html'])
	.pipe(revCollector({
		replaceReved:true
	}))

	.pipe(gulp.dest('./www'))

})

gulp.task('watch',function(){
	gulp.watch('./src/index.html',['copy-index']);

	var queue=sequence(300);
	watch('./src/scripts/**',{
		name:"JS",
		emitOnGlob:false
	},queue.getHandler('packjs','verjs','html'));

	watch('./src/styles/**',{
		name:"CSS",
		emitOnGlob:false
	},queue.getHandler('sass','verCss','html'));
})

gulp.task('default',['webserver','watch']);