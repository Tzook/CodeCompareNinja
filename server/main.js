// External dependencies
var express 		= require('express'),
	http 			= require('http');
	
__dirname = __dirname.slice(0, -7); // slice the /server

// Express dependencies
var app = express();
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app'));
app.use('/assets', express.static(__dirname + '/assets')); // HTML 5 mode fixes

app.get("/", function(req, res) {
	res.render(index, { user : req.user });
});

app.listen(app.get('port'), function(){
	console.log("\t+*+*+ New server on localhost:" + app.get('port') + " +*+*+");
});

