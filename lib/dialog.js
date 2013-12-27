module.exports = (function(){
	var colors = require('colors');
	var sys = require('sys');
	var printf = require('printf');

	var dialog = function(){
		dialog.CTAG = "+";
		dialog.HTAG = "-";
		dialog.VTAG = "|";
		dialog.DIALOG_WIDTH = 80;

		colors.setTheme({
			BORDER_COLOR: 'green',
			TITLE_COLOR: 'red',
			INDEX_COLOR: 'red',
			STRING_COLOR: 'blue',
		});
	};
	dialog.prototype.getBoder = function(width, isStart, isEnd) {
		width = width || dialog.DIALOG_WIDTH;
		isStart = (isStart===undefined)?true:isStart;
		isEnd = (isEnd===undefined)?true:isEnd;

		var headChar = (isStart)?dialog.CTAG:dialog.HTAG;
		var tailChar = (isEnd)?dialog.CTAG:dialog.HTAG;
		var buf = new Buffer(width);

		buf.fill(headChar, 0, 1);
		buf.fill(dialog.HTAG, 1, width-1);
		buf.fill(tailChar, width-1, width);
		return buf.toString();
	};
	dialog.prototype.showBoxTitle = function(title, width) {
		width = width || dialog.DIALOG_WIDTH;

		var len = width - title.length;
		var flen = parseInt(len / 2);
		var flen1 = flen+(len&1);

		sys.print(this.getBoder(flen, true, false).BORDER_COLOR);
		sys.print(title.TITLE_COLOR);
		sys.puts(this.getBoder(flen1, false, true).BORDER_COLOR);
	};
	dialog.prototype.showBoxString = function(str, width) {
		width = width || dialog.DIALOG_WIDTH;

		var in_width = width-3;

		var pos = 0, len = str.length;
		var is_head = true;
		var char_len = 0;
		while (len>0)
		{
			var ch = str.charCodeAt(pos);
			if (ch == 32/*' '*/ || ch == 47 /*'/'*/) {
				char_len=0;
			} else {
				char_len++;
			}
			if (!ch) {
				char_len = 0;
			}
			pos++;
			if (pos==in_width) {
				if (str.charCodeAt(pos) != 32/*' '*/) {
					pos -= char_len;
				}
				if (is_head) {
					var tmp_str = str.substring(0, pos);
					var head_str = tmp_str.replace(/:.*/, "")+":";
					var body_str = tmp_str.replace(/.*?:/, "");
					if (head_str == tmp_str+":") {
						head_str = "";
					}
					var head_len=head_str.length;
					var body_len = in_width - head_len;
					var line = printf("%-"+body_len+"s", body_str);
					sys.puts(dialog.VTAG.BORDER_COLOR+" "+head_str.INDEX_COLOR+line.STRING_COLOR+dialog.VTAG.BORDER_COLOR);
					is_head = false;
				} else {
					var line = printf("%-"+in_width+"s", str.substring(0, pos));
					sys.puts(dialog.VTAG.BORDER_COLOR+" "+line.STRING_COLOR+dialog.VTAG.BORDER_COLOR);
				}
				str = str.substring(pos);
				pos=0;
				len = str.length;
			}
		}
	};
	dialog.prototype.msgbox = function(title, msg) {
		var len = msg.length;
		this.showBoxTitle(title);
		for (var i=0; i<len; i++) {
		this.showBoxString(msg[i]);
		};
		sys.puts(this.getBoder().BORDER_COLOR);
	}

	return dialog;
}());
