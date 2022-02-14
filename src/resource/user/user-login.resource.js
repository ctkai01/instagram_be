"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.UserLoginResource = void 0;
var UserLoginResource = function (data) {
    var name = 'http://localhost:5000/' + data.avatar.split('\\').join('/');
    name = name.replace('/public', '');
    var dataTransform = __assign(__assign({}, data), { avatar: name });
    delete dataTransform['refresh_token'];
    delete dataTransform['password'];
    return dataTransform;
};
exports.UserLoginResource = UserLoginResource;
