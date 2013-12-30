var Dialog = require('..');

var dialog = new Dialog();

var msg = [ "Usage :xfind [OPTIONS]", "  -t [str] :the to find str,can be regex", "  -n [name] :set name as x.c ", "  -d [dir] :set dir as ./ ", "  -s [new_str]:repalce str with new_str", "  -e [command]:do command(_TARGET_) is the find file", "  -r [rename_str]:[c:cpp]|[]", "  -l [_list_style]:set list_style[0:not show list,1:radiobox,2:checkbox mult command,3:checkbox single command] ", "  -I [_TARGET_]: set _TARGET_, default is ~~ ", "  -v [vim_command]:do vim command", "  -p [dest_dir]:copy find files to dest_dir and make dirs", "  -a :set auto indent by vim", "  -c :put the *first* found file to clipboard", "  -i :set ignorcase ", "  -f :show file only ", "  -w :show with window", "  -h :show help "];
dialog.msgbox("xfind", msg);
