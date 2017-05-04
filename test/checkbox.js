var dialog = require('..');


function callback(s) {
	console.log(s);
}

function singleCallback(s) {
	console.log(s);
}

var list = ["fang1", "fang2", "fang3", "fang4", "fang5", "fang6", "fang7"];

dialog.checkbox("echo","echo some one", list, callback, singleCallback, true);
