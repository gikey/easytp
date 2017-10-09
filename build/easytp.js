/*! easytp v1.1.0 */
(function(window, document) {

    var version = "1.1.0",
        regTpl,
        dataTpl,
        commentTpl,
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

        render: function(_selector, data) {
            var dom = document.querySelector(this.selector);
            if (!dom) return console.error('Can not found selector of ' + this.selector);
            var content = easytp.tplEngine(dom, data),
                element = document.querySelectorAll(_selector);
            element.forEach(function(elem) {
                elem.innerHTML = content;
            })
        }
    }

    easytp.settings = {
        "left_delimiter": "<%",
        "right_delimiter": "%>",
        "left_comment_delimiter": "<#",
        "right_comment_delimiter": "#>"
    }

    easytp.tplEngine = function(dom, data) {
        var content = dom.innerHTML,
            code = 'var html = []; \n',
            index = 0;
        regTpl = new RegExp(this.settings.left_delimiter + '\\s*((?!' + this.settings.right_delimiter + ').)*\\s*' + this.settings.right_delimiter, 'g');
        dataTpl = new RegExp(this.settings.left_delimiter + '\\s*(.+)?\\s*' + this.settings.right_delimiter);
        commentTpl = new RegExp(this.settings.left_comment_delimiter + '\\s*((?!' + this.settings.right_comment_delimiter + ').)*\\s*' + this.settings.right_comment_delimiter, 'gm');
        content = content.replace(new RegExp(this.settings.left_comment_delimiter, 'g'), '<!--').replace(new RegExp(this.settings.right_comment_delimiter, 'g'), '-->');
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
