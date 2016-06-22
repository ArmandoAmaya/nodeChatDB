var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost/chatMong");

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email válido"];


var user_schema = new Schema({
	username:{type:String, required:true,maxlength:[50, "Username muy grande"]},
	email:{type:String, required:"Correo obligatorio", match:email_match},
	password:{type:String, minlength:[6, "Minimo 6 carácteres"]},
	name:{type:String, required:"Nombre obligatorio"}
});


user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});



var User = mongoose.model("User", user_schema);

module.exports.User = User;