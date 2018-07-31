'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Task = require('./model/tasks');


var app = express();
var router = express.Router();


var port = process.env.API_PORT || 3001;

//db config
mongoose.connect('mongodb://constairs:jesusloveme228@ds115749.mlab.com:15749/meh');

// mongodb://constairs:jesusloveme228@ds115749.mlab.com:15749/meh
// mongodb://localhost:27017/tasks

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path & initialize the API
router.get('/', function (req, res) {
  res.json({message: 'API Initialized!'});
});

router.route('/tasks').get(function(req, res) {
	Task.find(function(err, tasks) {
		if(err) res.send(err);
		res.json(tasks);
	});
}).post(function(req, res) {
	var task = new Task();
	task.title       = req.body.title;
	task.text        = req.body.text;
	task.color       = req.body.color;
	task.importancy  = req.body.importancy;
	task.createdAt   = req.body.createdAt;
	task.noDeadline  = req.body.noDeadline;
	task.deadline    = req.body.deadline;
	task.complete    = req.body.complete;
	task.completedAt = req.body.completedAt;
	
	task.save(function(err) {
		if(err) send(err);
		res.json({ message: 'Task successfully added!'});
	});

})

router.route('/tasks/:id').delete(function(req, res) {
	Task.findById(req.params.id).remove().then(data => res.send(data))
})

router.route('/tasks/:id').put(function (req, res, next) {
	Task.findById(req.params.id).update(req.body).then(data => res.send(data)).catch(next)
	})

app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function () {
  console.log(`api running on port ${port}`);
});