
var colors = require('colors');
var printf = require('printf');
var fs = require('fs');
var readline = require('readline');
var program = require('commander');

colors.setTheme({
    BORDER_COLOR: 'green',
    TITLE_COLOR: 'red',
    INDEX_COLOR: 'magenta',
    STRING_COLOR: 'blue',
    INPUTBOX_COLOR: 'blue',
    ERROR_COLOR: 'red',
    WARN_COLOR: 'yellow',
    DEBUG_COLOR: 'green',
});

class Dialog {
    constructor () {
        this.CTAG = '+';
        this.HTAG = '-';
        this.VTAG = '|';
        this.DIALOG_WIDTH = 80;
        this.MSGBOX_WIDTH = 30;
    }
    error (args) {
        var ret = printf.apply(this, arguments);
        console.log(ret.ERROR_COLOR);
    }
    warn (args) {
        var ret = printf.apply(this, arguments);
        console.log(ret.WARN_COLOR);
    }
    debug (args) {
        var ret = printf.apply(this, arguments);
        console.log(ret.DEBUG_COLOR);
    }
    pause () {
        console.log('Press any key to continue...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.stdin.pause.bind(process.stdin));
    }
    commander () {
        var _self = this;
        program.optionHelp = function () {
            var ret = [];
            ret[0] = 'Usage: ' + this.usage();
            for (var i = 0; i < this.options.length; i++) {
                ret[i + 1] = '  '+this.options[i].flags + ': ' + this.options[i].description;
            }
            ret[i + 1] = '  -h, --help:show help';
            return ret;
        };
        program.commandHelp = function () {
            var ret = [];
            if (!this.commands.length) return ret;

            ret[0] = 'Commands: ';
            for (var i = 0; i < this.commands.length; i++) {
                var cmd = this.commands[i];
                var args = cmd._args.map((arg) => arg.required ? '<' + arg.name + '>' : '[' + arg.name + ']').join(' ');
                ret[i + 1] = '  '+cmd._name + (cmd.options.length ? '[options]' : '') + ' ' + args + ': ' + (cmd.description() ? cmd.description() : '');
            }
            return ret;
        };
        program.helpInformation = function () {
            var name = this._name;
            var commandHelp = this.commandHelp();
            var optionHelp = this.optionHelp();
            var options = optionHelp.concat(' ', commandHelp);
            return { name:name, options:options };
        };
        program.outputHelp = function () {
            var args = this.helpInformation();
            _self.msgbox(args.name, args.options);
        };
        return program;
    }
    getBoder (width, isStart, isEnd) {
        width = width || this.DIALOG_WIDTH;
        isStart = (isStart === undefined) ? true : isStart;
        isEnd = (isEnd === undefined) ? true : isEnd;

        var headChar = (isStart) ? this.CTAG : this.HTAG;
        var tailChar = (isEnd) ? this.CTAG : this.HTAG;
        var buf = new Buffer(width);

        buf.fill(headChar, 0, 1);
        buf.fill(this.HTAG, 1, width - 1);
        buf.fill(tailChar, width - 1, width);
        return buf.toString();
    }
    showLineBoder (width) {
        width = width || this.DIALOG_WIDTH;
        console.log(this.getBoder(width).BORDER_COLOR);
    }
    showBoxTitle (title, width) {
        width = width || this.DIALOG_WIDTH;

        var len = width - title.length;
        var flen = parseInt(len / 2);
        var flen1 = flen + (len & 1);

        console.log(this.getBoder(flen, true, false).BORDER_COLOR + title.TITLE_COLOR + this.getBoder(flen1, false, true).BORDER_COLOR);
    }
    showBoxDiscription (disp, width) {
        width = width || this.DIALOG_WIDTH;
        this.showBoxString('[Usage]:' + disp, width);
    }
    showBoxString (str, width) {
        width = width || this.DIALOG_WIDTH;

        var in_width = width - 3;

        var pos = 0, len = str.length;
        var is_head = true;
        var char_len = 0;
        while (len > 0)	{
            var ch = str.charCodeAt(pos);
            if (ch == 32/* ' ' */ || ch == 47 /* '/' */) {
                char_len = 0;
            } else {
                char_len++;
            }
            if (!ch) {
                char_len = 0;
            }
            pos++;
            if (pos == in_width) {
                if (str.charCodeAt(pos) != 32/* ' ' */) {
                    pos -= char_len;
                }
                if (is_head) {
                    var tmp_str = str.substring(0, pos);
                    var head_str = tmp_str.replace(/:.*/, '') + ':';
                    var body_str = tmp_str.replace(/.*?:/, '');
                    if (head_str == tmp_str + ':') {
                        head_str = '';
                    }
                    var head_len = head_str.length;
                    var body_len = in_width - head_len;
                    var line = printf('%-' + body_len + 's', body_str);
                    console.log(this.VTAG.BORDER_COLOR + ' ' + head_str.INDEX_COLOR + line.STRING_COLOR + this.VTAG.BORDER_COLOR);
                    is_head = false;
                } else {
                    var line = printf('%-' + in_width + 's', str.substring(0, pos));
                    console.log(this.VTAG.BORDER_COLOR + ' ' + line.STRING_COLOR + this.VTAG.BORDER_COLOR);
                }
                str = str.substring(pos);
                pos = 0;
                len = str.length;
            }
        }
    }
    msgbox (title, msg, width) {
        width = width || this.DIALOG_WIDTH;
        var len = msg.length;
        this.showBoxTitle(title, width);
        for (var i = 0; i < len; i++) {
            this.showBoxString(msg[i], width);
        }
        this.showLineBoder(width);
    }
    inputbox (info, defaultValue) {
        return new Promise(async (resolve) => {
            info = info.INPUTBOX_COLOR;
            if (defaultValue) {
                info += ('[default:' + defaultValue + ']:').INDEX_COLOR;
            }
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question(info, (ret) => {
                ret = ret.trim() || defaultValue;
                rl.close();
                resolve(ret);
            });
        });
    }
    listbox (title, disp, list, width) {
        width = width || this.DIALOG_WIDTH;
        var len = list.length;
        this.showBoxTitle(title, width);
        this.showBoxDiscription(disp, width);
        this.showLineBoder(width);
        for (var i = 0; i < len; i++) {
            this.showBoxString(i + ': ' + list[i], width);
        }
        this.showLineBoder(width);
    }
    async radiobox (title, disp, list, callback, isUpdate, width) {
        width = width || this.DIALOG_WIDTH;
        var len = list.length;
        while (true) {
            if (len == 0) {
                this.msgbox('complete', ['have done all'], this.MSGBOX_WIDTH);
                return;
            }
            this.listbox(title, disp, list, width);
            var ret = await this.inputbox('please input need ' + title.TITLE_COLOR + ' index,' + 'exit(q)'.INDEX_COLOR);
            var index = ret.trim();
            if (!index.length) {
                this.error('null is not allowed');
                continue;
            }
            if (index == 'q') {
                break;
            }
            if (isNaN(index)) {
                this.error('must input a number');
                continue;
            }
            if (index < 0 || index >= len) {
                this.error('the select number is out of range');
                continue;
            }
            callback(list[index]);
            if (isUpdate) {
                list.splice(index, 1);
                len--;
            }
            this.pause();
        }
    }
    async checkbox (title, disp, list, callback, singleCallback, isUpdate, width) {
        width = width || this.DIALOG_WIDTH;
        var len = list.length;
        var isAll = false;

        if (len == 0) {
            this.error("list is null, can't get list in this case");
            return;
        }
        this.listbox(title, disp, list, width);
        var ret = await this.inputbox('please input need ' + title.TITLE_COLOR + ' index' + '([-]1 2 3|1-3 5-7|all)'.INDEX_COLOR);
        var input = ret.trim();
        if (!input.length) {
            this.error('null is not allowed');
            return;
        }
        if (input == 'q') {
            return;
        }
        var isFilter = input.charCodeAt(0) == 45;
        if (isFilter) {
            input = input.substring(1).trim();
        }
        var target_indexs = [];
        var all = [];
        var id = 0;
        for (var i = 0; i < len; i++) {
            all[i] = i;
        }
        if (input == 'all') {
            isAll = true;
            target_indexs = all;
        } else {
            var indexs = input.split(/\s+/);
            var indexs_len = indexs.length;
            for (var i = 0; i < indexs_len; i++) {
                var index = indexs[i];
                var isRange = index.match(/^[^-]*-[^-]*$/);
                if (isRange) {
                    var ranges = index.split(/-/);
                    if (isNaN(ranges[0]) || isNaN(ranges[1])) {
                        this.error('must input a number');
                        return;
                    }
                    for (var j = parseInt(ranges[0]), m = parseInt(ranges[1]); j <= m; j++) {
                        target_indexs[id++] = j;
                    }
                } else {
                    if (isNaN(index)) {
                        this.error('must input a number');
                        return;
                    }
                    target_indexs[id++] = parseInt(index);
                }
            }
            target_indexs.sort();
            target_indexs = target_indexs.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            var target_len = target_indexs.length;
            for (var i = 0; i < target_len; i++) {
                if (target_indexs[i] < 0 || target_indexs[i] > len) {
                    this.error('invalid input out range');
                    return;
                }
            }
            if (isFilter) {
                var tmp = [];
                var id = 0;
                var isIn = (arr, value) => {
                    var arrLen = arr.length;
                    for (var i = 0; i < arrLen; i++) {
                        if (arr[i] == value) {
                            return true;
                        }
                    }
                    return false;
                };
                for (var i = 0; i < len; i++) {
                    if (!isIn(target_indexs, all[i])) {
                        tmp[id++] = all[i];
                    }
                }
                target_indexs = tmp;
            }
        }
        target_len = target_indexs.length;
        if (singleCallback) {
            for (var i = 0; i < target_len; i++) {
                singleCallback(list[target_indexs[i]]);
            }
        }
        if (callback) {
            var targets = [];
            for (var i = 0; i < target_len; i++) {
                targets[i] = list[target_indexs[i]];
            }
            callback(targets);
        }
        if (isUpdate) {
            for (var i = target_len - 1; i >= 0; i--) {
                var del_id = target_indexs[i];
                list.splice(del_id, 1);
            }
        }
    }
    menuitembox (disp, items, width) {
        width = width || this.DIALOG_WIDTH;
        this.showBoxTitle('menu', width);
        this.showBoxString(disp, width);
        this.showBoxString('please input follows to do your work', width);
        this.showLineBoder(width);

        for (var tag in items) {
            this.showBoxString('[' + tag + ']: ' + items[tag].disp, width);
        }
        this.showBoxString('[q]: exit', width);
        this.showLineBoder(width);
    }
    async menubox (disp, items, width) {
        width = width || this.DIALOG_WIDTH;
        while (true) {
            this.menuitembox(disp, items, width);
            while (true) {
                var ret = await this.inputbox('please input oper type:');
                ret = ret.trim();
                if (ret == 'q') {
                    return;
                }
                if (items[ret]) {
                    break;
                }
                this.error('you select oper not exist!');
            }
            var item = items[ret];
            item.callback(item);
            if (item.disp) {
                disp = item.disp;
            }
        }
    }
};

module.exports = new Dialog();
