var dialog = require('..');

var list = [ "add svn log", "delete svn log"];
dialog.listbox("xsvn", "do svn command", list);
