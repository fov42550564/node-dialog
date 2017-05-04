var dialog = require('..');

function callback1(x) {
	console.log(x);
	x.disp = "change for a";
	dialog.pause();
}

function callback2(x) {
	console.log(x);
	x.disp = "change for d";
	dialog.pause();
}

var items = {a:{disp:"add svn", callback:callback1}, d:{disp:"delete svn", callback:callback2}}


dialog.menubox("xsvn", items);
