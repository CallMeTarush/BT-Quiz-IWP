module.exports = (gulp, plugins) => {
  const paths = {
    input: {
      entry: plugins.path.join(__dirname, "../source/lib/window.js")
    },
    output: plugins.path.join(__dirname, "../dist/")
  };

  const webpackConfig = {
    entry: paths.input.entry,
    output: {
      path: paths.output,
      filename: "fam.js"
    },
    module: {
      loaders: [
        {test: /\.json$/, loader: "json"},
        {
          test: /\.js$/,
          loader: "babel-loader",
          query: {
            presets: ["env"]
          }
        }
      ]
    }
  };

  gulp.task("build-javascript", done => {
    plugins.webpack(webpackConfig, (error, stats) => {
      // console.log(stats);
      done();
    });
  });
};
