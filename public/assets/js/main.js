var socket = io.connect("http://localhost:8081/", {'forceNew': true});
socket.on('messages', function(data){
	console.log(data);
	render(data);
});

function render(data){
	var html = data.map(function(element, index){
		return(`<div>
				<strong>${element.autor}</strong>:
				<em>${element.text}</em>
			</div>`);
	}).join(" ");

	document.getElementById("chat").innerHTML = html;
}


function addMessage(e){
	var payload = {
		autor: document.getElementById("user").textContent,
		text: document.getElementById("texto").value
	};
	socket.emit('new-message', payload);
	document.getElementById("texto").value = "";
	return false;
}