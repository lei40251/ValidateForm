/* ~
 * ValidateForm v1.0
 * Copyright (c) 2016 22904003@qq.com
 * Licensed under the MIT license.
 *
 * Javascript 表单验证，无依赖
 *
 * */
(function (window) {
    function Validate(option) {
        //默认参数
        var _defaultOpt = {
            //验证规则配置
            "items": {
                ".empty": {
                    "msg": "请输入用户名",
                    "error": "用户名错误",
                    "success": "用户名可用",
                    "required": true,
                    "trim": true,
                    "test": function (val) {
                        return val;
                    }
                },
                ".psw": {
                    //默认提醒内容
                    "msg": "请输入6~8位密码",
                    //失败提醒内容
                    "error": "格式错误，请重新输入",
                    //成功提醒内容
                    "success": "用户名可用",
                    //是否校验
                    "required": true,
                    //是否清除前后的空格
                    "trim": true,
                    //校验方法
                    "test": function (val) {
                        return val;
                    }
                }
            },
            //返回提醒参数配置
            "msg": {
                //是否动态插入提醒节点
                "dynamic": false,
                //提醒节点的class属性值
                "class": "msg",
                //提醒节点各状态文字及input边框颜色
                "color": {
                    "default": "#999",
                    "error": "red",
                    "success": "green"
                }
            },
            //需要验证的form表单
            "form": '.validateForm',
            //验证失败
            "fail": function () {
                alert('fail');
            },
            //验证通过
            "success": function () {
                alert('success');
            }
        };
        this._opt = this._extend(_defaultOpt, option);
    }

    Validate.prototype = {
        constructor: Validate,
        /**
         * 判断对象是否为空的方法
         * @method isEmptyObj
         * @param {Object} o 需要判断的对象
         * @return { Boolean } 为空返回 [!0] true ，否则返回 [!1] false
         * */
        _isEmptyObj: function (o) {
            var t;
            for (t in o)
                return !1;
            return !0
        },
        /**
         * 对象拷贝的方法
         * @method extend
         * @param {Object} Obj 原对象
         * @param {Object} newObj 需要拷贝的对象
         * @return { Object } Obj 拷贝后的对象
         * */
        _extend: function (Obj, newObj) {
            if (!this._isEmptyObj(newObj)) {
                for (let i in Obj) {
                    Obj[i] = newObj[i];
                }
            }
            return Obj;
        },
        /**
         * 在节点后插入新节点方法
         * @method insertAfter
         * @param {Node} newNode 需要插入的新节点
         * @param {Node} node 原节点
         * */
        _insertAfter: function (newNode, node) {
            if (node.parentNode.lastChild == node) {
                node.parentNode.appendChild(newNode);
            } else {
                node.parentNode.insertBefore(newNode, node.nextElementSibling);
            }
        },
        /**
         * 创建渲染消息提示节点方法
         * @method renderMsg
         * @param {String} color 提示文字及相关输入框border颜色
         * @param {String} str 提示信息内容
         * @param {Node} node 输入框节点
         * */
        _renderMsg: function (color, str, node) {
            if (this._opt.msg.dynamic) {
                if (node.nextElementSibling != null) {
                    if (node.nextElementSibling.nodeName.toLocaleLowerCase() == 'span' && node.nextElementSibling.className.indexOf(this._opt.msg.class) > -1) {
                        node.parentNode.removeChild(node.nextElementSibling);
                    }
                }
                let tempSpan = document.createElement('span');
                tempSpan.innerText = str;
                tempSpan.className = this._opt.msg.class;
                tempSpan.style.color = color;
                this._insertAfter(tempSpan, node);
            } else {
                let tempSpan = document.querySelector("." + this._opt.msg.class);
                if (tempSpan != null) {
                    tempSpan.innerText = str;
                    tempSpan.style.color = color;
                } else {
                    this._opt.msg.dynamic = true;
                    this._renderMsg(color, str, node);
                }
            }
            node.style.borderColor = color;
        },
        /**
         * 默认消息提示方法
         * @method msgDefault
         * @param {String} str 提示信息内容
         * @param {Node} node 输入框节点
         * */
        _msgDefault: function (str, node) {
            this._renderMsg(this._opt.msg.color.default, str, node);
        },
        /**
         * 失败消息提示方法
         * @method msgError
         * @param {String} str 提示信息内容
         * @param {Node} node 输入框节点
         * */
        _msgError: function (str, node) {
            this._renderMsg(this._opt.msg.color.error, str, node);
            return !1;
        },
        /**
         * 成功消息提示方法
         * @method msgSuccess
         * @param {String} str 提示信息内容
         * @param {Node} node 输入框节点
         * */
        _msgSuccess: function (str, node) {
            this._renderMsg(this._opt.msg.color.success, str, node);
            return !0;
        },
        /**
         * 表单提交验证方法
         * @method validitySubmit
         * @param {Array} arr 需要校验的 class 组成的数组
         * @return {Boolean} flag 全部通过返回 true，否则返回 false
         * */
        _validitySubmit: function (arr) {
            var flag = true;
            for (let m = 0; m < arr.length; ++m) {
                let tempEle = document.querySelectorAll(arr[m]);
                for (let n = 0; n < tempEle.length; ++n) {
                    var item = this._opt.items[arr[m]];
                    flag = this._validityItem(item, tempEle[n]);
                }
            }
            return flag;
        },
        /**
         * 表单单项验证方法
         * @method validitySubmit
         * @param {Object} item 需要校验的 class 对象
         * @param {Node} node 输入框节点
         * */
        _validityItem: function (item, node) {
            var tempStr = '';
            if (item.trim == true) {
                tempStr = node.value.trim();
            } else {
                tempStr = node;
            }
            if (item.trim == true) {
                if (item.required == true) {
                    if (item.test(tempStr)) {
                        return this._msgSuccess(item.success, node);
                    } else {
                        return this._msgError(item.error, node);
                    }
                }
            }
        },
        /**
         * 表单验证事件绑定
         * @method check
         * */
        check: function () {
            var self = this;
            var tempArr = Object.keys(self._opt.items);
            for (let i = 0; i < tempArr.length; ++i) {
                let tempEle = document.querySelectorAll(tempArr[i]);
                for (let j = 0; j < tempEle.length; ++j) {
                    tempEle[j].onfocus = function () {
                        self._msgDefault(self._opt.items[tempArr[i]].msg, this);
                    }
                    tempEle[j].onblur = function () {
                        var item = self._opt.items[tempArr[i]];
                        self._validityItem(item, this);
                    }
                }
            }

            document.querySelector(self._opt.form).onsubmit = function () {
                if (self._validitySubmit(tempArr)) {
                    self._opt.success();
                } else {
                    self._opt.fail();
                }
                return !1;
            }
        }
    }

    window.Validate = function (option) {
        new Validate(option).check();
    }
})(window)