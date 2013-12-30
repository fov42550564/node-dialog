var Dialog = require('..');
var dialog = new Dialog();

var list = [ "add svn log", "delete svn log"];
dialog.listbox("xsvn", "do svn command", list);
