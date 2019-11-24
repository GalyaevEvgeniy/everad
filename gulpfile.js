const gulp = require("gulp");
const sass = require("gulp-sass");
const gcmq = require("gulp-group-css-media-queries");
const cssmin = require("gulp-cssmin");
const minify = require("gulp-minify");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const sprite = require("gulp.spritesmith");
const autoprefixer = require("gulp-autoprefixer");

//==================
// Пути к файлам
const paths = {
	styles: {
		files: "./src/styles/**/*.scss",
		dest: "./public/styles/",
	},
	html:{
		files: "./src/html/*.html",
		dest: "./public/"
	},
	js:{
		files: "./src/scripts/**/*.js",
		dest: "./public/scripts/",
		arr_files: [
			"./src/scripts/libs/polyfills.js",
			"./src/scripts/libs/custom_onEvent.js",
			"./src/scripts/main.js",
		]
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
gulp.task("minify_js", function(){
	return gulp
		.src(paths.js.arr_files)
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat("main.js"))
		.pipe(minify())
		.pipe(gulp.dest(paths.js.dest));
});

//========================================
//
gulp.task("minify_html", function(){
	return gulp
		.src(paths.html.files)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(paths.html.dest));
});

//==================================
//
gulp.task("sprite", function(){
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
	gulp.series("minify_html", "generate_css", "minify_js")();
});

//=================================
//
gulp.task("watch", function(){
	gulp.watch(paths.styles.files).on("change", gulp.series("generate_css"));
	gulp.watch(paths.html.files).on("change", gulp.series("minify_html"));
	gulp.watch(paths.js.files).on("change", gulp.series("minify_js"));
});