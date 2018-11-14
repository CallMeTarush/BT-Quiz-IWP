var express = require('express'),
app = express(),
port = 3000,
mongoose = require('mongoose'),
Task = require('./models/themodel'), //created model loading here
bodyParser = require('body-parser');
var isLoggedin  =  require('./authentication');
var flash    = require('connect-flash');
var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');


//mongoose.connect('mongodb://csi_admin:acoolpassword@ds123896.mlab.com:23896/ccs-csi');
mongoose.connect('mongodb://localhost:27017/ccs');

app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/models',
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: require('mongoose')
}));

app.use(express.static('assets'))
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

app.get('/login',function(req,res){
 res.sendFile(path.resolve('ccs-frontend/login.html'));
});
app.get('/',function(req,res){
                res.sendFile(path.resolve('ccs-frontend/index.html'));
});



app.use( /(?!.*(authenticate|signup|signuptest)).*$/, isLoggedin.verify_user);
var routes = require('./routes/theroutes'); //importing route

routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
