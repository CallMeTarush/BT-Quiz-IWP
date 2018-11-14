module.exports = gulp => {
  gulp.task("deploy", ["deploy-latest", "deploy-versioned"]);
};
