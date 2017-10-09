/*! easytp v1.0.2 */
(function(window, document) {

    var version = "1.0.2",
        regTpl,
        dataTpl,
        _easytp = window.easytp,
        $$ = window.$$,
        regTplJs = /(^( )?(if|for|else|switch|case|break|(\w+\.forEach)|{|}))(.*)?/g,
        easytp = function(selector) {
            return new easytp.fn.init(selector);
        };

    easytp.fn = easytp.prototype = {
        constructor: easytp,

        init: function(selector) {
            this.selector = selector;
            return this;
        },

        render: function(data) {
            var dom = document.getElementById(this.selector);
            if (!dom) return console.error('Can not found selector of ' + this.selector)
            var elem = document.createElement('div');
            elem.innerHTML = easytp.tplEngine(dom, data);
            dom.parentNode.replaceChild(elem, dom)
        }
    }

    easytp.settings = {
        "left_delimiter": "<%",
        "right_delimiter": "%>",
        "comment_delimiter": "<#"
    }

    easytp.tplEngine = function(dom, data) {
        var content = dom.innerHTML,
            code = 'var html = []; \n',
            index = 0;
        regTpl = new RegExp(this.settings.left_delimiter + '\\s*((?!' + this.settings.right_delimiter + ').)*\\s*' + this.settings.right_delimiter, 'g');
        dataTpl = new RegExp(this.settings.left_delimiter + '\\s*(.+)?\\s*' + this.settings.right_delimiter);
        var add = function(line, js) {
            js ? (code += line.match(regTplJs) ? line + '\n' : 'html.push(' + line + ');\n') :
                (code += line != '' ? 'html.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };
        while (match = regTpl.exec(content)) {
            add(content.slice(index, match.index))(dataTpl.exec(match[0])[1], true)
            index = match.index + match[0].length;
        }
        add(content.substr(index, content.length - index));
        code += 'return html.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data)
    }

    easytp.config = function(options) {
        for (var o in options) {
            this.settings[o] = options[o];
        }
    }

    easytp.fn.init.prototype = easytp.fn;
    window.$$ = window.easytp = easytp;

})(this, document);