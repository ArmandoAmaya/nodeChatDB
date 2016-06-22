var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user.js").User;
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);

var messages = [{
	id: 1,
	text: "Hola soy un mensaje",
	autor: "Armando Amaya"
}];


app.use("/public", express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
	name: "session",
	keys: ["llave-1", "llave-2"]
}));


app.set("view engine", "jade");

app.get("/", function(req, res){
	User.find(function(err, doc){
		console.log(doc);
		console.log(req.session.user_id);
		res.render("index");
	});
	
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/users", function(req, res){
	var user = new User({
		username: req.body.username,
		email: req.body.email,
		password:req.body.password,
		password_confirmation: req.body.password_confirmation,
		name:req.body.name
	});
	user.save().then(function(us){
		alert("Guardamos tus datos exitosamente");
		res.redirect("/");
	}, function(err){
		if (err) {
			console.log(String(err))
			res.send("No pudimos guardar tus datos");
		}
	});
});

app.post("/sessions", function(req,res){
	User.findOne({username:req.body.username, password:req.body.password}, function(err, user){
		req.session.user_id = user._id;
		res.redirect("/app");
	});
});

io.on("connection", function(socket){
	console.log("Alguien se ha conectado con socket");
	socket.emit('messages', messages);
	socket.on('new-message', function(data){

		messages.push(data);

		io.sockets.emit('messages', messages);
	});
});

app.use("/app", session_middleware);
app.use("/app", router_app);

server.listen(8081, function(){
	console.log("Servidor corriendo");
});