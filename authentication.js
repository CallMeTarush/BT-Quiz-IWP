var jwt = require('jsonwebtoken');
var mongoose = require('mongoose'),
    User = mongoose.model('Users');
var bcrypt   = require('bcrypt-nodejs');



const jwtkey = 'idshfiohdsSDF#iofhi$Fdshfis%GG#dsofjodsjf';


function authenticate_user(req, res) {
    console.log('here');

    User.findOne({ regno: req.body.regno }, function (err, user) {

        if (user == null) {
            res.json({message : 'You have not registered for CSI-VIT CCS.'});
            console.log("Unregisters");
            res.end();
        }
        else {
            if(bcrypt.compareSync(req.body.password, user.userpwd)) {
                var token = jwt.sign({id:user._id}, jwtkey);
                res.cookie("ccs", token);
                res.json({success:true});
		console.log("success");
            } else {
                res.json({success: false, message: "Incorrect password"});
                res.end();
		console.log("failed");
            }
            res.end();

        }
    });
}

function verify_user(req, res, next) {

    var token = req.cookies['ccs'];
    console.log(token);
        jwt.verify(token, jwtkey, function(err, decoded) {
            if (err) {
                console.log('dd');
                res.redirect('/login');
            } else {
                User.findOne({_id:decoded.id},function (err,user) {
                    // console.log(user);
                    // console.log(decoded);
                    req.decoded = user;
                    // console.log('dsddsds');
                    // console.log(next);
                    next();
                });

            }
        });
}

module.exports = {authenticate_user: authenticate_user, verify_user: verify_user};
