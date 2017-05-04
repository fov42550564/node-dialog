var dialog = require('..');

var list = [ "add svn log", "delete svn log"];

function callback(x) {
	console.log(x);
}

dialog.radiobox("xsvn", "do svn command", list, callback);
