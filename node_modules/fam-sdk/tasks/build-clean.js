import rimraf from "rimraf";
import path from "path";

module.exports = (gulp, plugins) => {
  gulp.task("build-clean", done => {
    rimraf(path.join(__dirname, "..", "dist"), done);
  });
};
