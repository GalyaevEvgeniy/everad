const gulp = require("gulp");
const sass = require("gulp-sass"); // Компиляция SCSS в CSS
const gcmq = require("gulp-group-css-media-queries"); // Групировка одинаковых Media Queries
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const sprite = require('gulp.spritesmith');
const autoprefixer = require("gulp-autoprefixer"); // Автоматическое добавление в CSS вендорных префиксов

//==================
// Пути к файлам
const paths = {
	styles: {
		files: "./src/styles/*.scss",
		dest: "./public/styles/",
	},
	html:{
		files: "./src/html/*.html",
		dest: "./public/"
	},
	icons:{
		files: "./src/icons/*",
		dest: "./public/img/"
	},
};

//========================================
//
gulp.task("generate_css", function(){
	return gulp
		.src(paths.styles.files)
		.pipe(sass())
		.pipe(autoprefixer({
			overrideBrowserslist: ["last 4 versions"],
			cascade: false
		}))
		.pipe(gcmq())
		.pipe(cssmin())
		.pipe(gulp.dest(paths.styles.dest));
});

//========================================
//
gulp.task('minify_html', function(){
	return gulp
		.src(paths.html.files)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(paths.html.dest));
});

//==================================
//
gulp.task('sprite', function(){
	return gulp
		.src(paths.icons.files)
		.pipe(sprite({
			imgName: "icons_sprite.png",
			imgPath: "../img/icons_sprite.png",
			cssName: "sprite.css"
		}))
		.pipe(gulp.dest(paths.icons.dest));
});

//=======================================
//
gulp.task("build", async function(){
	gulp.series("minify_html", "generate_css")();
});

//=================================
//
gulp.task("watch", function(){
	gulp.watch(paths.styles.files).on("change", gulp.series("generate_css"));
	gulp.watch(paths.html.files).on("change", gulp.series("minify_html"));
});