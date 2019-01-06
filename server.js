//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files from the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Start the app by listening on the default Heroku port
port = process.env.PORT || 8080;

app.listen(port, ()=> {
  console.log("Server Started at PORT: "+port);
});
