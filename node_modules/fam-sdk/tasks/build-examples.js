import path from "path";
//import ES5to3OutputPlugin from "es5to3-webpack-plugin";

module.exports = (gulp, plugins) => {
  const paths = {
    input: path.join(__dirname, "../source/examples/**/*"),
    output: path.join(__dirname, "../dist/examples/")
  };

  gulp.task("build-examples", () => {
    return gulp.src(paths.input)
      .pipe(gulp.dest(paths.output));
  });
};
