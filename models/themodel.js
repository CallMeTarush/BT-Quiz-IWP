var mongoose = require ("mongoose");
var bcrypt   = require('bcrypt-nodejs');


var Question = new mongoose.Schema({
    imagePath: {type:String},
    category: {type:String, required:true},
    body: {type:String, required:true},
    answer: {type:String}
});


var Test = new mongoose.Schema({
    startTime: {type:Date,default:Date.now},
    endTime:{type:Date},
    category:{type:String,required:true},
    attempted:{type:Number,default:0}
});

var User = new mongoose.Schema({
    name: {type:String, required:true},
    userpwd: {type:String, required:true},
    regno: {type:String, required:true,unique: true},
    email: {type:String, required:true},
    phone: Number,
    tests:[Test],
    qna:[Question]
});



mongoose.model('Question', Question);
mongoose.model('Test', Test);

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function (password, callback) {
    console.log(password);
    bcrypt.compare(password, this.userpwd, function (err, res) {
        if (err) {
            callback(err, null)
        }
        else {
            callback(null, true);
        }
    });
}

mongoose.model('Users', User);
