'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Test = mongoose.model('Test'),
    Questions = mongoose.model('Question');
var path = require('path');
var isLoggedin = require('../authentication');

const SENDGRID_API_KEY = "SG.TtV9-U6fQHCx-rTdrsdf2keVQ.ylltBxicBjor3nLrPMWNUd3mwbFE6A0FlKzndtcVEGQ";
const SENDGRID_SENDER = "noreply@csivit.com";
const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);


function compare(a,b) {
    if (a.test_time < b.test_time)
        return -1;
    if (a.test_time > b.test_time)
        return 1;
    return 0;
}

module.exports = function(app) {
    var dacontroller = require('../controllers/thecontroller');

    app.get('/markevaluated/:regno/:category',function(req,res){
        if(req.decoded.isAdmin == false){res.send('Admin only');return;}

        User.findOne({'regno':req.params.regno},function(err,user){
            if(err){res.json({success:false});return;}
            for(let test of user.tests){
                if(test.category === req.params.category){
                    test.isEvaluated = true;
                    user.save();
                    res.json({success:true});
                    return;
                }
            }


        });

    });
    app.get('/evaluate/:regno/:category',function(req,res){
        if(req.decoded.isAdmin == false){res.send('Admin only');return;}

        User.findOne({'regno':req.params.regno},function(err,user){
            var questions_ret = [];
            for(let ques of user.qna){
                if(ques.category === req.params.category){
                    questions_ret.push(ques);
                }
            }
            var data = {'questions':questions_ret};
            res.render('../ccs-frontend/evaluate_answer',{data:data,regno:user.regno});

        });

    });
    app.get('/usertests/:category',function(req,res){
        if(req.decoded.isAdmin == false){res.send('Admin only');return;}

        User.find({'tests.category':req.params.category},null, {sort: {'_id': -1}},function(err,users){
            var ret = [];
            console.log(users);
            for (let user of users) {
                for(let test of user.tests){
                    if(test.category === req.params.category){
                        var ob = {'name':user.name,'regno':user.regno,'phone':user.phone,'isEvaluated':test.isEvaluated,'test_time':test.startTime};
                        ret.push(ob);
                    }
                }
            }
            ret.sort(compare);
            var data = {'users':ret};
            console.log(data);
            res.render('../ccs-frontend/evaluate_user',{data:data});

        });
    });


    app.get('/reset/:token',function(req,res){
        res.render('../ccs-frontend/resetpass_password');
    });
    app.post('/reset/:token',function(req,res){
        var newpass = req.body.password.toString();
        var token = req.params.token.toString();
        User.findOne({passReset:token},function(err,user){
            if(user!=null){
                user.userpwd = user.generateHash(req.body.password);
                user.save();
                res.redirect('/login');
            }else{
                res.json({'message':'Token invalid'});
            }
        });
    });
    app.get('/resetpassword',function(req,res){
        res.render('../css-frontend/resetpass_email');
    });

    app.post('/resetpassword',function(req,res){
        var email = req.body.email.toString();
        User.findOne({email:email},function(err,user){
            if(user==null){res.json({message:"User not found"});}
            else{
                user.passReset = Math.random().toString().slice(2,18);
                user.save();
                const sgReq = Sendgrid.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: {
                        personalizations: [{
                            to: [{ email: req.body.email }],
                            subject: 'Password Reset Request'
                        }],
                        from: { email: SENDGRID_SENDER },
                        content: [{
                            type: 'text/plain',
                            value: 'Reset your password at http://localhost:3000/reset/'+user.passReset
                        }]
                    }
                });

                Sendgrid.API(sgReq, (err) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    // Render the index route on success
                    res.json({message:"Mail sent to your email"});
                });
            }

        });

    });


    app.route('/users/:userId')
        .get(dacontroller.showuser)
        .put(dacontroller.updateuser)
        .delete(dacontroller.removeuser);

    app.get('/logout',function(req,res){
        res.cookie("ccs","",{ expires: new Date() });
        res.redirect('/login');
    });

    app.get('/startexam/:category',function (req,res) {
        var user = req.decoded;
        var flag = true;
        for (let test of user.tests) {
            if(test.category === req.params.category){
                res.json({message:"Category already attempted",success:false});
                res.end();
                return;
            }
        }


        var test = new Test({category:req.params.category});


        Questions.aggregate([{$match:{'category':req.params.category}},{$sample: {size: 10}}],function (err,data) {
            if(err){
                res.json({status:"error"});
                throw err;
            }else{

                user.qna.push.apply(user.qna,data);
                req.decoded.tests.push(test);
                req.decoded.save();
                var ret = {testId:test._id,success:true,questions:data};
                res.render('../ccs-frontend/questions',{data:ret,fullname:req.decoded.name});

            }
        });


    });

    app.post('/answer',function (req,res) {
        var user = req.decoded;
        var testId = req.body.testId.toString();
        var answer = req.body.answer.toString();
        var qId = req.body.questionId.toString();

        console.log(req.body.latitude.toString());
        console.log(req.body.longitude.toString());

        var error = false;
        User.update( {_id : user._id , "tests._id" : testId } ,
            {$inc : {"tests.$.attempted" : 1},$set : {"tests.$.endTime":Date.now()} },function(err, doc){
                if (err) res.json({success:false});
                else {
                    User.update( {_id : user._id , "qna._id" : qId } ,
                        {"qna.$.answer" : answer} ,function(err, doc){
                            if(err) res.json({success:false});
                            else res.json({success:true});
                        });
                }
            });




    });




    app.get('/signup',function(req,res){
        res.sendFile(path.resolve('ccs-frontend/register.html'));

    });
    app.get('/dashboard-timer',function(req,res){
        res.redirect('/dashboard');
        //res.render('../../ccs-revamp-frontend/dashboard-timer',{fullname:req.decoded.name});
    });
    app.get('/dashboard',function(req,res){
        // res.sendFile(path.resolve('ccs-frontend/register.html'));
        var user = req.decoded;
        var ret = {'technical':false,'management':false,'design':false,'advtechnical':false};
        for (let test of user.tests) {
            ret[test.category] = true;
        }

        res.render('../ccs-frontend/dashboard.html',{fullname:req.decoded.name,data:ret});
    });


    app.post('/authenticate',isLoggedin.authenticate_user);

    app.post('/signup', function (req, res, next) {
        var reg = req.body.regno.toString();

        var regex_17 = /17\w\w\w\d\d\d\d/
        if(reg.match(regex_17)== null){
            res.json({success:false,message:'Only first years can register'});
            res.end();
        }else{

            User.findOne({ regno: req.body.regno }, function (err, user) {

                if (user != null) {
                    res.json({message : 'You have already registered.'});
                    res.end();
                }
                else{
                    var user = new User(req.body);
                    user.userpwd = user.generateHash(req.body.password);
                    //console.log(req.body.password);
                    user.save(function (err, doc) {
                        if(err){
                            //console.log(err.message);
                            res.json({ success:false, message: 'You have already registered'});
                        }
                        else {

                            res.json({success:true,message: 'Successfully Registered'});
                        }
                    });
                }
            });
        }
    });

}


