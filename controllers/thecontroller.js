'use strict';

var mongoose = require('mongoose'),
    Users = mongoose.model('Users'),
    Questions = mongoose.model('Question')

exports.showuser = function(req, res) {
    Users.findById(req.params.userId,function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
};

exports.questions = function(req, res) {
  Questions.find({ category:req.params.category},function(err, questions) {
    if (err)
      res.send(err);
    res.json(questions);
  });
};

exports.addquestion = function(req, res) {
  var new_ques = new Question(req.category);
  new_ques.save(function(err, question){
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.showquestion = function(req, res) {
  Questions.findById(req.params.questionId,function(err, question) {
    if (err)
      res.send(err);
    res.json(question);
  });
};

exports.updateuser = function(req, res) {
    Users.findUserAndUpdate({_id: req.params.userId}, req.name, req.userpwd, req.regno, req.email, req.phone, {new: true}, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  };

  exports.updatequestion = function(req, res) {
    Users.findQuesAndUpdate({_id: req.params.questionId}, req.category, req.hint, req.body, {new: true}, function(err, question) {
      if (err)
        res.send(err);
      res.json(question);
    });
  };

  exports.removequestion = function(req, res) {
      Questions.remove({
        _id: req.params.questionId
      }, function(err, user) {
        if (err)
          res.send(err);
        res.json({ message: 'Question successfully deleted' });
      });


    };

    exports.users = function(req,res) {
    Users.find({}, function(err, user) {
        if (err)
          res.send(err);
        res.json(user);
    });
};

exports.showuser = function(req, res) {
    Users.findById(req.params.userId,function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
};

exports.updateuser = function(req, res) {
    Users.findOneAndUpdate({_id: req.params.userId}, req.name, req.username, req.userpwd, req.regno, req.email, req.phone, {new: true}, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  };

  exports.removeuser = function(req, res) {
      Users.remove({
        _id: req.params.userId
      }, function(err, user) {
        if (err)
          res.send(err);
        res.json({ message: 'User successfully deleted' });
      });


    };
