import gulp from "gulp";
import path from "path";
import runSequence from "run-sequence";
import loadPlugins from "gulp-load-plugins";
import { argv } from "yargs";

const tasksPath = path.join(__dirname, "tasks");
const taskFiles = require("fs").readdirSync(tasksPath);

const extras = loadPlugins();

extras.environmentName = argv.environment || "development";
extras.path = path;
extras.runSequence = runSequence;
extras.webpack = require("webpack");
extras.environment = require("./environments.json")[extras.environmentName];
extras.version = require("./package.json").version;

taskFiles.forEach(taskFile => require(path.join(tasksPath, taskFile))(gulp, extras));
