module.exports = (gulp, plugins) => {
  const paths = {
    root: plugins.path.join(__dirname, "../dist/")
  };

  gulp.task("example", ["build", "server"]);

  gulp.task("server", () => {
    plugins.connect.server({
      root: paths.root,
      livereload: false,
      host: "10.0.0.117",
      port: 3002
    });
  });
};
