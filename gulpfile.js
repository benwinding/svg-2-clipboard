const babel = require("gulp-babel");
const del = require("del");
const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");
const imagemin = require("gulp-imagemin");
const jsonTransform = require("gulp-json-transform");
const rename = require("gulp-rename");
const zip = require("gulp-zip");
const inject = require("gulp-inject-string");

const target = process.env.TARGET || "chrome";
const version = process.env.npm_package_version;
const isProduction = process.env.IS_PRODUCTION || false;

console.log("       VERSION=" + version);
console.log("        TARGET=" + target);
console.log(" IS_PRODUCTION=" + isProduction);

const conf = {
  src: {
    scripts: ["./src/js/**/*.js"],
    images: "./src/img/**/*",
    manifest: `./src/manifest-${target}.json`
  },
  output: {
    dir: `./build-${target}`,
    zipFile: `./build-${target}-${version}.zip`
  }
};

gulp.task("clean", function() {
  return del([conf.output.dir]);
});

// Code Tasks
gulp.task("scripts", function() {
  return gulp.src(conf.src.scripts).pipe(gulp.dest(conf.output.dir + "/js"));
});

gulp.task("images", function() {
  return gulp
    .src(conf.src.images)
    .pipe(
      imagemin({
        optimizationLevel: 5
      })
    )
    .pipe(gulp.dest(conf.output.dir + "/img"));
});

gulp.task("manifest", function() {
  return gulp
    .src(conf.src.manifest)
    .pipe(rename("manifest.json"))
    .pipe(
      jsonTransform(function(data, file) {
        return JSON.stringify(
          {
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...data
          },
          null,
          2
        );
      })
    )
    .pipe(gulp.dest(conf.output.dir));
});

gulp.task("copy-code", gulpSequence("scripts", ["images", "manifest"]));

gulp.task("watch", ["copy-code"], function() {
  gulp.watch(conf.src.scripts, event => {
    gulpSequence("scripts")(err => {
      if (err) console.log(err);
    });
  });
  gulp.watch(conf.src.images, ["images"]);
  gulp.watch(conf.src.manifest, ["manifest"]);
});

gulp.task("zip", function() {
  return gulp
    .src(conf.output.dir + "/**/*")
    .pipe(zip(conf.output.zipFile))
    .pipe(gulp.dest("./"));
});

gulp.task("build", gulpSequence("clean", "copy-code", "zip"));

gulp.task("default", ["build"]);
