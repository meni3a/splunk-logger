"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplunkLogger = void 0;
var request = require("request");
var SplunkLogger = /** @class */ (function () {
    function SplunkLogger(url, token) {
        this.options = {
            'method': 'POST',
            'url': '',
            'headers': {
                'Authorization': '',
            },
            body: ''
        };
        this.options.headers.Authorization = "Splunk " + token;
        this.options.url = url.toString();
    }
    SplunkLogger.prototype.send = function (type, message) {
        var payload = {
            event: {
                message: message,
                type: type
            }
        };
        this.options.body = JSON.stringify(payload);
        request(this.options, function (error, response) {
            if (error) {
                console.log("SplunkLogger Error: ", error);
            }
            else {
                var result = JSON.parse(response === null || response === void 0 ? void 0 : response.body);
                if ((result === null || result === void 0 ? void 0 : result.code) == 0) {
                    console.log(result === null || result === void 0 ? void 0 : result.text);
                }
                else if ((result === null || result === void 0 ? void 0 : result.code) != 0) {
                    console.log("SplunkLogger Error: " + (result === null || result === void 0 ? void 0 : result.text));
                }
                else {
                    console.log("SplunkLogger: Unexpected response");
                }
            }
        });
    };
    SplunkLogger.prototype.error = function (message) { this.send("error", message); };
    SplunkLogger.prototype.info = function (message) { this.send("info", message); };
    SplunkLogger.prototype.warn = function (message) { this.send("warn", message); };
    SplunkLogger.prototype.fatal = function (message) { this.send("fatal", message); };
    SplunkLogger.prototype.debug = function (message) { this.send("debug", message); };
    return SplunkLogger;
}());
exports.SplunkLogger = SplunkLogger;
