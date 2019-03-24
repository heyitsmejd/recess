var express = require('express');

var app = express();

app.get("/", function(req, res){ 
	res.send("Hi there, welcome to my assignment!");
});

app.get("/speak/:animal", function(req, res){ 
	var animal = req.params.animal;
	if(animal == "dog")
	{
		res.send("Woof Woof!");
	}
		if(animal == "cow")
	{
		res.send("MOOOO!!");
	}
	
		if(animal == "pig")
	{
		res.send("Oink!");
	}
	else
	{
		res.send("404, it's lost in space!");
	}
});

app.get("/repeat/:word/:number", function(req, res){ 
	var world = req.params.word;
	var number1 = req.params.number;
	var getnumber = parseInt("number1");
	var text = "";
	for(i = 0; i < number1; i++)
	{
		text += world + " ";
	}
	res.send(text);
	//res.send('number');
	//res.send(world)
});

app.get("/*", function(req, res){ 
	res.send("404, it's lost in space!");
});

app.listen(3000, function(){console.log("Listening on 3000");});