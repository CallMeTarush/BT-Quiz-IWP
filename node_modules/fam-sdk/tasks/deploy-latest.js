import path from "path";

module.exports = (gulp, extras) => {
  const paths = {
    input: path.join(__dirname, "../dist/**/*")
  };

  const majorVersionNumber = extras.version.split(".")[0];

  gulp.task("deploy-latest", ["build"], () => {
    return gulp.src(paths.input)
      .pipe(extras.s3Upload()({
        Bucket: extras.environment.bucket,
        ACL: "public-read",
        keyTransform: relativeFilename => `sdk/js/${majorVersionNumber}/latest/${relativeFilename}`
      }, {
        maxRetries: 5
      }));
  });
};
