var Dialog = require('..');
var dialog = new Dialog();

(async function() {
    var ret = await dialog.inputbox("input a number", 9);
    console.log(ret);
})();
