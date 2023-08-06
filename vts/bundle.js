(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
var vtubestudio = require('vtubestudio');
global.window.vtubestudio = vtubestudio;

//browserify index.js -o bundle.js
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"vtubestudio":4}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgIsError = exports.msgIsEvent = exports.msgIsResponse = exports.makeRequestMsg = exports.VTubeStudioError = void 0;
var types_1 = require("./types");
var VTubeStudioError = (function (_super) {
    __extends(VTubeStudioError, _super);
    function VTubeStudioError(data, requestID) {
        var _newTarget = this.constructor;
        var _this = this;
        var _a;
        _this = _super.call(this, "".concat(data.message, " (Error Code: ").concat(data.errorID, " ").concat((_a = types_1.ErrorCode[data.errorID]) !== null && _a !== void 0 ? _a : types_1.ErrorCode.Unknown, ") (Request ID: ").concat(requestID, ")")) || this;
        _this.data = data;
        _this.requestID = requestID;
        _this.name = _this.constructor.name;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return VTubeStudioError;
}(Error));
exports.VTubeStudioError = VTubeStudioError;
function makeRequestMsg(type, requestID, data) {
    return {
        apiName: 'VTubeStudioPublicAPI',
        apiVersion: '1.0',
        timestamp: Date.now(),
        messageType: "".concat(type, "Request"),
        requestID: requestID,
        data: data,
    };
}
exports.makeRequestMsg = makeRequestMsg;
function msgIsResponse(msg, type) {
    return msg.messageType === "".concat(type, "Response");
}
exports.msgIsResponse = msgIsResponse;
function msgIsEvent(msg, type) {
    return msg.messageType === "".concat(type, "Event");
}
exports.msgIsEvent = msgIsEvent;
function msgIsError(msg) {
    return msg.messageType === 'APIError';
}
exports.msgIsError = msgIsError;

},{"./types":5}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
var api_1 = require("./api");
var types_1 = require("./types");
var utils_1 = require("./utils");
var validation_1 = require("./validation");
var ws_1 = require("./ws");
var ApiClient = (function () {
    function ApiClient(options) {
        var _a, _b, _c;
        this._connectHandlers = [];
        this._disconnectHandlers = [];
        this._errorHandlers = [];
        this._endpointHandlers = [];
        this._eventHandlers = [];
        this._isConnected = false;
        this._isConnecting = false;
        this._shouldReconnect = true;
        this.apiState = this._createClientCall('APIState');
        this.authenticationToken = this._createClientCall('AuthenticationToken', 5 * 60 * 1000);
        this.authentication = this._createClientCall('Authentication');
        this.statistics = this._createClientCall('Statistics');
        this.vtsFolderInfo = this._createClientCall('VTSFolderInfo');
        this.currentModel = this._createClientCall('CurrentModel');
        this.availableModels = this._createClientCall('AvailableModels');
        this.modelLoad = this._createClientCall('ModelLoad');
        this.moveModel = this._createClientCall('MoveModel');
        this.hotkeysInCurrentModel = this._createClientCall('HotkeysInCurrentModel');
        this.hotkeyTrigger = this._createClientCall('HotkeyTrigger');
        this.expressionState = this._createClientCall('ExpressionState');
        this.expressionActivation = this._createClientCall('ExpressionActivation');
        this.artMeshList = this._createClientCall('ArtMeshList');
        this.colorTint = this._createClientCall('ColorTint');
        this.sceneColorOverlayInfo = this._createClientCall('SceneColorOverlayInfo');
        this.faceFound = this._createClientCall('FaceFound');
        this.inputParameterList = this._createClientCall('InputParameterList');
        this.parameterValue = this._createClientCall('ParameterValue');
        this.live2DParameterList = this._createClientCall('Live2DParameterList');
        this.parameterCreation = this._createClientCall('ParameterCreation');
        this.parameterDeletion = this._createClientCall('ParameterDeletion');
        this.injectParameterData = this._createClientCall('InjectParameterData');
        this.getCurrentModelPhysics = this._createClientCall('GetCurrentModelPhysics');
        this.setCurrentModelPhysics = this._createClientCall('SetCurrentModelPhysics');
        this.ndiConfig = this._createClientCall('NDIConfig');
        this.itemList = this._createClientCall('ItemList');
        this.itemLoad = this._createClientCall('ItemLoad');
        this.itemUnload = this._createClientCall('ItemUnload');
        this.itemAnimationControl = this._createClientCall('ItemAnimationControl');
        this.itemMove = this._createClientCall('ItemMove');
        this.artMeshSelection = this._createClientCall('ArtMeshSelection', 30 * 60 * 1000);
        this.events = Object.seal({
            test: this._createEventSubCalls('Test'),
            modelLoaded: this._createEventSubCalls('ModelLoaded'),
            trackingStatusChanged: this._createEventSubCalls('TrackingStatusChanged'),
            backgroundChanged: this._createEventSubCalls('BackgroundChanged'),
            modelConfigChanged: this._createEventSubCalls('ModelConfigChanged'),
            modelMoved: this._createEventSubCalls('ModelMoved'),
            modelOutline: this._createEventSubCalls('ModelOutline'),
        });
        this._eventSubscription = this._createClientCall('EventSubscription');
        (0, validation_1.validate)(options, 'options', ['object', {
                authTokenGetter: 'function',
                authTokenSetter: 'function',
                pluginDeveloper: 'string',
                pluginName: 'string',
                pluginIcon: ['optional', 'string'],
                url: ['optional', 'string'],
                port: ['optional', 'number'],
                webSocketFactory: ['optional', 'function'],
            }]);
        this._authTokenGetter = options.authTokenGetter;
        this._authTokenSetter = options.authTokenSetter;
        this._pluginName = options.pluginName;
        this._pluginDeveloper = options.pluginDeveloper;
        this._pluginIcon = options.pluginIcon;
        this._port = (_a = options.port) !== null && _a !== void 0 ? _a : 8001;
        this._url = (_b = options.url) !== null && _b !== void 0 ? _b : "ws://localhost:".concat(this._port);
        var webSocketImpl = options.webSocketFactory ? null : (0, ws_1.getWebSocketImpl)();
        this._webSocketFactory = (_c = options.webSocketFactory) !== null && _c !== void 0 ? _c : (function (url) { return new webSocketImpl(url); });
        this._webSocket = this._webSocketFactory(this._url);
        this._reconnect();
    }
    Object.defineProperty(ApiClient.prototype, "isConnected", {
        get: function () { return this._isConnected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiClient.prototype, "isConnecting", {
        get: function () { return this._isConnecting; },
        enumerable: false,
        configurable: true
    });
    ApiClient.prototype.on = function (type, handler) {
        (0, validation_1.validate)(type, 'type', ['stringEnum', ['connect', 'disconnect', 'error']]);
        (0, validation_1.validate)(handler, 'handler', 'function');
        if (type === 'connect' && !this._connectHandlers.find(function (h) { return h === handler; }))
            this._connectHandlers.push(handler);
        if (type === 'disconnect' && !this._disconnectHandlers.find(function (h) { return h === handler; }))
            this._disconnectHandlers.push(handler);
        if (type === 'error' && !this._errorHandlers.find(function (h) { return h === handler; }))
            this._errorHandlers.push(handler);
    };
    ApiClient.prototype.off = function (type, handler) {
        (0, validation_1.validate)(type, 'type', ['stringEnum', ['connect', 'disconnect', 'error']]);
        (0, validation_1.validate)(handler, 'handler', 'function');
        if (type === 'connect' && this._connectHandlers.find(function (h) { return h === handler; }))
            this._connectHandlers.splice(this._connectHandlers.findIndex(function (h) { return h === handler; }), 1);
        if (type === 'disconnect' && this._disconnectHandlers.find(function (h) { return h === handler; }))
            this._disconnectHandlers.splice(this._disconnectHandlers.findIndex(function (h) { return h === handler; }), 1);
        if (type === 'error' && this._errorHandlers.find(function (h) { return h === handler; }))
            this._errorHandlers.splice(this._errorHandlers.findIndex(function (h) { return h === handler; }), 1);
    };
    ApiClient.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._shouldReconnect = false;
                this._webSocket.close();
                return [2];
            });
        });
    };
    ApiClient.prototype._createClientCall = function (type, defaultTimeout) {
        var _this = this;
        if (defaultTimeout === void 0) { defaultTimeout = 1000; }
        return (function (data, config) { return new Promise(function (resolve, reject) {
            var _a;
            var requestID = (0, utils_1.generateID)(16);
            var request = (0, api_1.makeRequestMsg)(type, requestID, data !== null && data !== void 0 ? data : {});
            var handler = {
                callback: function (msg) {
                    var _a, _b;
                    if (msg.requestID === requestID) {
                        handler.remove = true;
                        clearTimeout(handler.timeout);
                        if ((0, api_1.msgIsResponse)(msg, type))
                            resolve((_a = msg.data) !== null && _a !== void 0 ? _a : {});
                        else if ((0, api_1.msgIsError)(msg))
                            reject(new api_1.VTubeStudioError((_b = msg.data) !== null && _b !== void 0 ? _b : {}, requestID));
                        else
                            reject(new api_1.VTubeStudioError({ errorID: types_1.ErrorCode.InternalClientError, message: "The response from VTube Studio was an unexpected type: ".concat(JSON.stringify(msg.messageType)) }, requestID));
                    }
                },
                type: type,
                request: request,
                timeout: setTimeout(function () {
                    handler.remove = true;
                    reject(new api_1.VTubeStudioError({ errorID: types_1.ErrorCode.InternalClientError, message: 'The request timed out.' }, requestID));
                }, (_a = config === null || config === void 0 ? void 0 : config.timeout) !== null && _a !== void 0 ? _a : defaultTimeout),
                remove: false,
            };
            _this._endpointHandlers.push(handler);
            if (_this._webSocket.readyState === 1)
                _this._webSocket.send(JSON.stringify(request));
        }); });
    };
    ApiClient.prototype._createEventSubCalls = function (type) {
        var _this = this;
        return {
            subscribe: (function (callback, config) { return __awaiter(_this, void 0, void 0, function () {
                var handler, existingHandler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this._eventSubscription({ config: config !== null && config !== void 0 ? config : {}, eventName: "".concat(type, "Event"), subscribe: true })];
                        case 1:
                            _a.sent();
                            handler = {
                                callback: function (msg) {
                                    var _a;
                                    if ((0, api_1.msgIsEvent)(msg, type))
                                        callback((_a = msg.data) !== null && _a !== void 0 ? _a : {});
                                },
                                type: type,
                                config: config !== null && config !== void 0 ? config : {},
                                remove: false,
                            };
                            existingHandler = this._eventHandlers.find(function (h) { return h.type === type; });
                            this._eventHandlers.push(handler);
                            if (existingHandler) {
                                existingHandler.remove = true;
                                return [2, false];
                            }
                            return [2, true];
                    }
                });
            }); }),
            unsubscribe: function () { return __awaiter(_this, void 0, void 0, function () {
                var existingHandler;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            existingHandler = this._eventHandlers.find(function (h) { return h.type === type; });
                            if (!existingHandler) return [3, 2];
                            return [4, this._eventSubscription({ config: existingHandler.config, eventName: "".concat(type, "Event"), subscribe: false })];
                        case 1:
                            _a.sent();
                            existingHandler.remove = true;
                            return [2, true];
                        case 2: return [2, false];
                    }
                });
            }); }
        };
    };
    ApiClient.prototype._reconnect = function () {
        var _this = this;
        this._isConnecting = true;
        this._webSocket.addEventListener('message', function (_a) {
            var data = _a.data;
            try {
                var msg = JSON.parse(data);
                for (var _i = 0, _b = _this._endpointHandlers; _i < _b.length; _i++) {
                    var handler = _b[_i];
                    handler.callback(msg);
                }
                for (var _c = 0, _d = _this._eventHandlers; _c < _d.length; _c++) {
                    var handler = _d[_c];
                    handler.callback(msg);
                }
                for (var i = _this._endpointHandlers.length - 1; i >= 0; i--)
                    if (_this._endpointHandlers[i].remove)
                        _this._endpointHandlers.splice(i, 1);
                for (var i = _this._eventHandlers.length - 1; i >= 0; i--)
                    if (_this._eventHandlers[i].remove)
                        _this._eventHandlers.splice(i, 1);
            }
            catch (e) {
                for (var _e = 0, _f = _this._errorHandlers; _e < _f.length; _e++) {
                    var handler = _f[_e];
                    handler(e);
                }
            }
        });
        this._webSocket.addEventListener('close', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._disconnect();
                return [2];
            });
        }); });
        this._webSocket.addEventListener('error', function () {
            _this._webSocket.close();
        });
        this._webSocket.addEventListener('open', function () { return __awaiter(_this, void 0, void 0, function () {
            var pluginName, pluginDeveloper, pluginIcon, _a, active, currentSessionAuthenticated, authenticationToken, _b, authenticated, reason, _c, authenticationToken, _d, authenticated, reason, _i, _e, handler, _f, _g, handler, e_1, _h, _j, handler;
            var _this = this;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 11, , 12]);
                        pluginName = this._pluginName;
                        pluginDeveloper = this._pluginDeveloper;
                        pluginIcon = this._pluginIcon;
                        return [4, this.apiState()];
                    case 1:
                        _a = _k.sent(), active = _a.active, currentSessionAuthenticated = _a.currentSessionAuthenticated;
                        if (!active)
                            throw new Error('VTube Studio Plugin API is not enabled.');
                        if (!!currentSessionAuthenticated) return [3, 9];
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 5, , 9]);
                        return [4, this._authTokenGetter()];
                    case 3:
                        authenticationToken = _k.sent();
                        if (!authenticationToken)
                            throw new Error('Missing authentication token');
                        return [4, this.authentication({ pluginName: pluginName, pluginDeveloper: pluginDeveloper, authenticationToken: authenticationToken })];
                    case 4:
                        _b = _k.sent(), authenticated = _b.authenticated, reason = _b.reason;
                        if (!authenticated)
                            throw new Error("Authentication with VTube Studio failed: ".concat(reason));
                        return [3, 9];
                    case 5:
                        _c = _k.sent();
                        return [4, this.authenticationToken({ pluginName: pluginName, pluginDeveloper: pluginDeveloper, pluginIcon: pluginIcon })];
                    case 6:
                        authenticationToken = (_k.sent()).authenticationToken;
                        return [4, this.authentication({ pluginName: pluginName, pluginDeveloper: pluginDeveloper, authenticationToken: authenticationToken })];
                    case 7:
                        _d = _k.sent(), authenticated = _d.authenticated, reason = _d.reason;
                        if (!authenticated)
                            throw new Error("Authentication with VTube Studio failed: ".concat(reason));
                        return [4, this._authTokenSetter(authenticationToken)];
                    case 8:
                        _k.sent();
                        return [3, 9];
                    case 9:
                        for (_i = 0, _e = this._endpointHandlers; _i < _e.length; _i++) {
                            handler = _e[_i];
                            this._webSocket.send(JSON.stringify(handler.request));
                        }
                        return [4, Promise.all(this._eventHandlers.map(function (handler) { return _this._eventSubscription({ config: handler.config, eventName: "".concat(handler.type, "Event"), subscribe: true }); }))];
                    case 10:
                        _k.sent();
                        this._isConnecting = false;
                        this._isConnected = true;
                        for (_f = 0, _g = this._connectHandlers; _f < _g.length; _f++) {
                            handler = _g[_f];
                            handler();
                        }
                        return [3, 12];
                    case 11:
                        e_1 = _k.sent();
                        for (_h = 0, _j = this._errorHandlers; _h < _j.length; _h++) {
                            handler = _j[_h];
                            handler(e_1);
                        }
                        this._webSocket.close();
                        return [3, 12];
                    case 12: return [2];
                }
            });
        }); });
    };
    ApiClient.prototype._disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, handler;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._isConnecting = false;
                        if (this._isConnected) {
                            this._isConnected = false;
                            for (_i = 0, _a = this._disconnectHandlers; _i < _a.length; _i++) {
                                handler = _a[_i];
                                handler();
                            }
                        }
                        if (!this._shouldReconnect)
                            return [2];
                        return [4, (0, utils_1.wait)(5 * 1000)];
                    case 1:
                        _b.sent();
                        setTimeout(function () {
                            if (!_this._isConnecting && !_this._isConnected) {
                                _this._webSocket = _this._webSocketFactory(_this._url);
                                _this._reconnect();
                            }
                        }, 0);
                        return [2];
                }
            });
        });
    };
    return ApiClient;
}());
exports.ApiClient = ApiClient;

},{"./api":2,"./types":5,"./utils":6,"./validation":7,"./ws":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictedRawKey = exports.HotkeyType = exports.ErrorCode = exports.VTubeStudioError = exports.ApiClient = void 0;
var endpoints_1 = require("./endpoints");
Object.defineProperty(exports, "ApiClient", { enumerable: true, get: function () { return endpoints_1.ApiClient; } });
var api_1 = require("./api");
Object.defineProperty(exports, "VTubeStudioError", { enumerable: true, get: function () { return api_1.VTubeStudioError; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function () { return types_1.ErrorCode; } });
Object.defineProperty(exports, "HotkeyType", { enumerable: true, get: function () { return types_1.HotkeyType; } });
Object.defineProperty(exports, "RestrictedRawKey", { enumerable: true, get: function () { return types_1.RestrictedRawKey; } });

},{"./api":2,"./endpoints":3,"./types":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictedRawKey = exports.HotkeyType = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Unknown"] = NaN] = "Unknown";
    ErrorCode[ErrorCode["InternalClientError"] = -100] = "InternalClientError";
    ErrorCode[ErrorCode["Unset"] = -1] = "Unset";
    ErrorCode[ErrorCode["InternalServerError"] = 0] = "InternalServerError";
    ErrorCode[ErrorCode["APIAccessDeactivated"] = 1] = "APIAccessDeactivated";
    ErrorCode[ErrorCode["JSONInvalid"] = 2] = "JSONInvalid";
    ErrorCode[ErrorCode["APINameInvalid"] = 3] = "APINameInvalid";
    ErrorCode[ErrorCode["APIVersionInvalid"] = 4] = "APIVersionInvalid";
    ErrorCode[ErrorCode["RequestIDInvalid"] = 5] = "RequestIDInvalid";
    ErrorCode[ErrorCode["RequestTypeMissingOrEmpty"] = 6] = "RequestTypeMissingOrEmpty";
    ErrorCode[ErrorCode["RequestTypeUnknown"] = 7] = "RequestTypeUnknown";
    ErrorCode[ErrorCode["RequestRequiresAuthetication"] = 8] = "RequestRequiresAuthetication";
    ErrorCode[ErrorCode["TokenRequestDenied"] = 50] = "TokenRequestDenied";
    ErrorCode[ErrorCode["TokenRequestCurrentlyOngoing"] = 51] = "TokenRequestCurrentlyOngoing";
    ErrorCode[ErrorCode["TokenRequestPluginNameInvalid"] = 52] = "TokenRequestPluginNameInvalid";
    ErrorCode[ErrorCode["TokenRequestDeveloperNameInvalid"] = 53] = "TokenRequestDeveloperNameInvalid";
    ErrorCode[ErrorCode["TokenRequestPluginIconInvalid"] = 54] = "TokenRequestPluginIconInvalid";
    ErrorCode[ErrorCode["AuthenticationTokenMissing"] = 100] = "AuthenticationTokenMissing";
    ErrorCode[ErrorCode["AuthenticationPluginNameMissing"] = 101] = "AuthenticationPluginNameMissing";
    ErrorCode[ErrorCode["AuthenticationPluginDeveloperMissing"] = 102] = "AuthenticationPluginDeveloperMissing";
    ErrorCode[ErrorCode["ModelIDMissing"] = 150] = "ModelIDMissing";
    ErrorCode[ErrorCode["ModelIDInvalid"] = 151] = "ModelIDInvalid";
    ErrorCode[ErrorCode["ModelIDNotFound"] = 152] = "ModelIDNotFound";
    ErrorCode[ErrorCode["ModelLoadCooldownNotOver"] = 153] = "ModelLoadCooldownNotOver";
    ErrorCode[ErrorCode["CannotCurrentlyChangeModel"] = 154] = "CannotCurrentlyChangeModel";
    ErrorCode[ErrorCode["HotkeyQueueFull"] = 200] = "HotkeyQueueFull";
    ErrorCode[ErrorCode["HotkeyExecutionFailedBecauseNoModelLoaded"] = 201] = "HotkeyExecutionFailedBecauseNoModelLoaded";
    ErrorCode[ErrorCode["HotkeyIDNotFoundInModel"] = 202] = "HotkeyIDNotFoundInModel";
    ErrorCode[ErrorCode["HotkeyCooldownNotOver"] = 203] = "HotkeyCooldownNotOver";
    ErrorCode[ErrorCode["HotkeyIDFoundButHotkeyDataInvalid"] = 204] = "HotkeyIDFoundButHotkeyDataInvalid";
    ErrorCode[ErrorCode["HotkeyExecutionFailedBecauseBadState"] = 205] = "HotkeyExecutionFailedBecauseBadState";
    ErrorCode[ErrorCode["HotkeyUnknownExecutionFailure"] = 206] = "HotkeyUnknownExecutionFailure";
    ErrorCode[ErrorCode["HotkeyExecutionFailedBecauseLive2DItemNotFound"] = 207] = "HotkeyExecutionFailedBecauseLive2DItemNotFound";
    ErrorCode[ErrorCode["HotkeyExecutionFailedBecauseLive2DItemsDoNotSupportThisHotkeyType"] = 208] = "HotkeyExecutionFailedBecauseLive2DItemsDoNotSupportThisHotkeyType";
    ErrorCode[ErrorCode["ColorTintRequestNoModelLoaded"] = 250] = "ColorTintRequestNoModelLoaded";
    ErrorCode[ErrorCode["ColorTintRequestMatchOrColorMissing"] = 251] = "ColorTintRequestMatchOrColorMissing";
    ErrorCode[ErrorCode["ColorTintRequestInvalidColorValue"] = 252] = "ColorTintRequestInvalidColorValue";
    ErrorCode[ErrorCode["MoveModelRequestNoModelLoaded"] = 300] = "MoveModelRequestNoModelLoaded";
    ErrorCode[ErrorCode["MoveModelRequestMissingFields"] = 301] = "MoveModelRequestMissingFields";
    ErrorCode[ErrorCode["MoveModelRequestValuesOutOfRange"] = 302] = "MoveModelRequestValuesOutOfRange";
    ErrorCode[ErrorCode["CustomParamNameInvalid"] = 350] = "CustomParamNameInvalid";
    ErrorCode[ErrorCode["CustomParamValuesInvalid"] = 351] = "CustomParamValuesInvalid";
    ErrorCode[ErrorCode["CustomParamAlreadyCreatedByOtherPlugin"] = 352] = "CustomParamAlreadyCreatedByOtherPlugin";
    ErrorCode[ErrorCode["CustomParamExplanationTooLong"] = 353] = "CustomParamExplanationTooLong";
    ErrorCode[ErrorCode["CustomParamDefaultParamNameNotAllowed"] = 354] = "CustomParamDefaultParamNameNotAllowed";
    ErrorCode[ErrorCode["CustomParamLimitPerPluginExceeded"] = 355] = "CustomParamLimitPerPluginExceeded";
    ErrorCode[ErrorCode["CustomParamLimitTotalExceeded"] = 356] = "CustomParamLimitTotalExceeded";
    ErrorCode[ErrorCode["CustomParamDeletionNameInvalid"] = 400] = "CustomParamDeletionNameInvalid";
    ErrorCode[ErrorCode["CustomParamDeletionNotFound"] = 401] = "CustomParamDeletionNotFound";
    ErrorCode[ErrorCode["CustomParamDeletionCreatedByOtherPlugin"] = 402] = "CustomParamDeletionCreatedByOtherPlugin";
    ErrorCode[ErrorCode["CustomParamDeletionCannotDeleteDefaultParam"] = 403] = "CustomParamDeletionCannotDeleteDefaultParam";
    ErrorCode[ErrorCode["InjectDataNoDataProvided"] = 450] = "InjectDataNoDataProvided";
    ErrorCode[ErrorCode["InjectDataValueInvalid"] = 451] = "InjectDataValueInvalid";
    ErrorCode[ErrorCode["InjectDataWeightInvalid"] = 452] = "InjectDataWeightInvalid";
    ErrorCode[ErrorCode["InjectDataParamNameNotFound"] = 453] = "InjectDataParamNameNotFound";
    ErrorCode[ErrorCode["InjectDataParamControlledByOtherPlugin"] = 454] = "InjectDataParamControlledByOtherPlugin";
    ErrorCode[ErrorCode["InjectDataModeUnknown"] = 455] = "InjectDataModeUnknown";
    ErrorCode[ErrorCode["ParameterValueRequestParameterNotFound"] = 500] = "ParameterValueRequestParameterNotFound";
    ErrorCode[ErrorCode["NDIConfigCooldownNotOver"] = 550] = "NDIConfigCooldownNotOver";
    ErrorCode[ErrorCode["NDIConfigResolutionInvalid"] = 551] = "NDIConfigResolutionInvalid";
    ErrorCode[ErrorCode["ExpressionStateRequestInvalidFilename"] = 600] = "ExpressionStateRequestInvalidFilename";
    ErrorCode[ErrorCode["ExpressionStateRequestFileNotFound"] = 601] = "ExpressionStateRequestFileNotFound";
    ErrorCode[ErrorCode["ExpressionActivationRequestInvalidFilename"] = 650] = "ExpressionActivationRequestInvalidFilename";
    ErrorCode[ErrorCode["ExpressionActivationRequestFileNotFound"] = 651] = "ExpressionActivationRequestFileNotFound";
    ErrorCode[ErrorCode["ExpressionActivationRequestNoModelLoaded"] = 652] = "ExpressionActivationRequestNoModelLoaded";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestNoModelLoaded"] = 700] = "SetCurrentModelPhysicsRequestNoModelLoaded";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestModelHasNoPhysics"] = 701] = "SetCurrentModelPhysicsRequestModelHasNoPhysics";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestPhysicsControlledByOtherPlugin"] = 702] = "SetCurrentModelPhysicsRequestPhysicsControlledByOtherPlugin";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestNoOverridesProvided"] = 703] = "SetCurrentModelPhysicsRequestNoOverridesProvided";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestPhysicsGroupIDNotFound"] = 704] = "SetCurrentModelPhysicsRequestPhysicsGroupIDNotFound";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestNoOverrideValueProvided"] = 705] = "SetCurrentModelPhysicsRequestNoOverrideValueProvided";
    ErrorCode[ErrorCode["SetCurrentModelPhysicsRequestDuplicatePhysicsGroupID"] = 706] = "SetCurrentModelPhysicsRequestDuplicatePhysicsGroupID";
    ErrorCode[ErrorCode["ItemFileNameMissing"] = 750] = "ItemFileNameMissing";
    ErrorCode[ErrorCode["ItemFileNameNotFound"] = 751] = "ItemFileNameNotFound";
    ErrorCode[ErrorCode["ItemLoadLoadCooldownNotOver"] = 752] = "ItemLoadLoadCooldownNotOver";
    ErrorCode[ErrorCode["CannotCurrentlyLoadItem"] = 753] = "CannotCurrentlyLoadItem";
    ErrorCode[ErrorCode["CannotLoadItemSceneFull"] = 754] = "CannotLoadItemSceneFull";
    ErrorCode[ErrorCode["ItemOrderInvalid"] = 755] = "ItemOrderInvalid";
    ErrorCode[ErrorCode["ItemOrderAlreadyTaken"] = 756] = "ItemOrderAlreadyTaken";
    ErrorCode[ErrorCode["ItemLoadValuesInvalid"] = 757] = "ItemLoadValuesInvalid";
    ErrorCode[ErrorCode["CannotCurrentlyUnloadItem"] = 800] = "CannotCurrentlyUnloadItem";
    ErrorCode[ErrorCode["ItemAnimationControlInstanceIDNotFound"] = 850] = "ItemAnimationControlInstanceIDNotFound";
    ErrorCode[ErrorCode["ItemAnimationControlUnsupportedItemType"] = 851] = "ItemAnimationControlUnsupportedItemType";
    ErrorCode[ErrorCode["ItemAnimationControlAutoStopFramesInvalid"] = 852] = "ItemAnimationControlAutoStopFramesInvalid";
    ErrorCode[ErrorCode["ItemAnimationControlTooManyAutoStopFrames"] = 853] = "ItemAnimationControlTooManyAutoStopFrames";
    ErrorCode[ErrorCode["ItemAnimationControlSimpleImageDoesNotSupportAnim"] = 854] = "ItemAnimationControlSimpleImageDoesNotSupportAnim";
    ErrorCode[ErrorCode["ItemMoveRequestInstanceIDNotFound"] = 900] = "ItemMoveRequestInstanceIDNotFound";
    ErrorCode[ErrorCode["ItemMoveRequestInvalidFadeMode"] = 901] = "ItemMoveRequestInvalidFadeMode";
    ErrorCode[ErrorCode["ItemMoveRequestItemOrderTakenOrInvalid"] = 902] = "ItemMoveRequestItemOrderTakenOrInvalid";
    ErrorCode[ErrorCode["ItemMoveRequestCannotCurrentlyChangeOrder"] = 903] = "ItemMoveRequestCannotCurrentlyChangeOrder";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var HotkeyType;
(function (HotkeyType) {
    HotkeyType[HotkeyType["Unset"] = -1] = "Unset";
    HotkeyType[HotkeyType["TriggerAnimation"] = 0] = "TriggerAnimation";
    HotkeyType[HotkeyType["ChangeIdleAnimation"] = 1] = "ChangeIdleAnimation";
    HotkeyType[HotkeyType["ToggleExpression"] = 2] = "ToggleExpression";
    HotkeyType[HotkeyType["RemoveAllExpressions"] = 3] = "RemoveAllExpressions";
    HotkeyType[HotkeyType["MoveModel"] = 4] = "MoveModel";
    HotkeyType[HotkeyType["ChangeBackground"] = 5] = "ChangeBackground";
    HotkeyType[HotkeyType["ReloadMicrophone"] = 6] = "ReloadMicrophone";
    HotkeyType[HotkeyType["ReloadTextures"] = 7] = "ReloadTextures";
    HotkeyType[HotkeyType["CalibrateCam"] = 8] = "CalibrateCam";
    HotkeyType[HotkeyType["ChangeVTSModel"] = 9] = "ChangeVTSModel";
    HotkeyType[HotkeyType["TakeScreenshot"] = 10] = "TakeScreenshot";
    HotkeyType[HotkeyType["ScreenColorOverlay"] = 11] = "ScreenColorOverlay";
    HotkeyType[HotkeyType["RemoveAllItems"] = 12] = "RemoveAllItems";
    HotkeyType[HotkeyType["ToggleItemScene"] = 13] = "ToggleItemScene";
    HotkeyType[HotkeyType["DownloadRandomWorkshopItem"] = 14] = "DownloadRandomWorkshopItem";
    HotkeyType[HotkeyType["ExecuteItemAction"] = 15] = "ExecuteItemAction";
    HotkeyType[HotkeyType["ArtMeshColorPreset"] = 16] = "ArtMeshColorPreset";
    HotkeyType[HotkeyType["ToggleTracker"] = 17] = "ToggleTracker";
})(HotkeyType = exports.HotkeyType || (exports.HotkeyType = {}));
var RestrictedRawKey;
(function (RestrictedRawKey) {
    RestrictedRawKey[RestrictedRawKey["LeftMouseButton"] = 1] = "LeftMouseButton";
    RestrictedRawKey[RestrictedRawKey["RightMouseButton"] = 2] = "RightMouseButton";
    RestrictedRawKey[RestrictedRawKey["MiddleMouseButton"] = 4] = "MiddleMouseButton";
    RestrictedRawKey[RestrictedRawKey["Tab"] = 9] = "Tab";
    RestrictedRawKey[RestrictedRawKey["CapsLock"] = 20] = "CapsLock";
    RestrictedRawKey[RestrictedRawKey["Escape"] = 27] = "Escape";
    RestrictedRawKey[RestrictedRawKey["Space"] = 32] = "Space";
    RestrictedRawKey[RestrictedRawKey["Left"] = 37] = "Left";
    RestrictedRawKey[RestrictedRawKey["Up"] = 38] = "Up";
    RestrictedRawKey[RestrictedRawKey["Right"] = 39] = "Right";
    RestrictedRawKey[RestrictedRawKey["Down"] = 40] = "Down";
    RestrictedRawKey[RestrictedRawKey["Print"] = 42] = "Print";
    RestrictedRawKey[RestrictedRawKey["Delete"] = 46] = "Delete";
    RestrictedRawKey[RestrictedRawKey["PageUp"] = 33] = "PageUp";
    RestrictedRawKey[RestrictedRawKey["PageDown"] = 34] = "PageDown";
    RestrictedRawKey[RestrictedRawKey["N0"] = 48] = "N0";
    RestrictedRawKey[RestrictedRawKey["N1"] = 49] = "N1";
    RestrictedRawKey[RestrictedRawKey["N2"] = 50] = "N2";
    RestrictedRawKey[RestrictedRawKey["N3"] = 51] = "N3";
    RestrictedRawKey[RestrictedRawKey["N4"] = 52] = "N4";
    RestrictedRawKey[RestrictedRawKey["N5"] = 53] = "N5";
    RestrictedRawKey[RestrictedRawKey["N6"] = 54] = "N6";
    RestrictedRawKey[RestrictedRawKey["N7"] = 55] = "N7";
    RestrictedRawKey[RestrictedRawKey["N8"] = 56] = "N8";
    RestrictedRawKey[RestrictedRawKey["N9"] = 57] = "N9";
    RestrictedRawKey[RestrictedRawKey["A"] = 65] = "A";
    RestrictedRawKey[RestrictedRawKey["B"] = 66] = "B";
    RestrictedRawKey[RestrictedRawKey["C"] = 67] = "C";
    RestrictedRawKey[RestrictedRawKey["D"] = 68] = "D";
    RestrictedRawKey[RestrictedRawKey["E"] = 69] = "E";
    RestrictedRawKey[RestrictedRawKey["F"] = 70] = "F";
    RestrictedRawKey[RestrictedRawKey["G"] = 71] = "G";
    RestrictedRawKey[RestrictedRawKey["H"] = 72] = "H";
    RestrictedRawKey[RestrictedRawKey["I"] = 73] = "I";
    RestrictedRawKey[RestrictedRawKey["J"] = 74] = "J";
    RestrictedRawKey[RestrictedRawKey["K"] = 75] = "K";
    RestrictedRawKey[RestrictedRawKey["L"] = 76] = "L";
    RestrictedRawKey[RestrictedRawKey["M"] = 77] = "M";
    RestrictedRawKey[RestrictedRawKey["N"] = 78] = "N";
    RestrictedRawKey[RestrictedRawKey["O"] = 79] = "O";
    RestrictedRawKey[RestrictedRawKey["P"] = 80] = "P";
    RestrictedRawKey[RestrictedRawKey["Q"] = 81] = "Q";
    RestrictedRawKey[RestrictedRawKey["R"] = 82] = "R";
    RestrictedRawKey[RestrictedRawKey["S"] = 83] = "S";
    RestrictedRawKey[RestrictedRawKey["T"] = 84] = "T";
    RestrictedRawKey[RestrictedRawKey["U"] = 85] = "U";
    RestrictedRawKey[RestrictedRawKey["V"] = 86] = "V";
    RestrictedRawKey[RestrictedRawKey["W"] = 87] = "W";
    RestrictedRawKey[RestrictedRawKey["X"] = 88] = "X";
    RestrictedRawKey[RestrictedRawKey["Y"] = 89] = "Y";
    RestrictedRawKey[RestrictedRawKey["Z"] = 90] = "Z";
    RestrictedRawKey[RestrictedRawKey["LeftWindows"] = 91] = "LeftWindows";
    RestrictedRawKey[RestrictedRawKey["RightWindows"] = 92] = "RightWindows";
    RestrictedRawKey[RestrictedRawKey["Numpad0"] = 96] = "Numpad0";
    RestrictedRawKey[RestrictedRawKey["Numpad1"] = 97] = "Numpad1";
    RestrictedRawKey[RestrictedRawKey["Numpad2"] = 98] = "Numpad2";
    RestrictedRawKey[RestrictedRawKey["Numpad3"] = 99] = "Numpad3";
    RestrictedRawKey[RestrictedRawKey["Numpad4"] = 100] = "Numpad4";
    RestrictedRawKey[RestrictedRawKey["Numpad5"] = 101] = "Numpad5";
    RestrictedRawKey[RestrictedRawKey["Numpad6"] = 102] = "Numpad6";
    RestrictedRawKey[RestrictedRawKey["Numpad7"] = 103] = "Numpad7";
    RestrictedRawKey[RestrictedRawKey["Numpad8"] = 104] = "Numpad8";
    RestrictedRawKey[RestrictedRawKey["Numpad9"] = 105] = "Numpad9";
    RestrictedRawKey[RestrictedRawKey["Multiply"] = 106] = "Multiply";
    RestrictedRawKey[RestrictedRawKey["Add"] = 107] = "Add";
    RestrictedRawKey[RestrictedRawKey["Subtract"] = 109] = "Subtract";
    RestrictedRawKey[RestrictedRawKey["Decimal"] = 110] = "Decimal";
    RestrictedRawKey[RestrictedRawKey["Divide"] = 111] = "Divide";
    RestrictedRawKey[RestrictedRawKey["F1"] = 112] = "F1";
    RestrictedRawKey[RestrictedRawKey["F2"] = 113] = "F2";
    RestrictedRawKey[RestrictedRawKey["F3"] = 114] = "F3";
    RestrictedRawKey[RestrictedRawKey["F4"] = 115] = "F4";
    RestrictedRawKey[RestrictedRawKey["F5"] = 116] = "F5";
    RestrictedRawKey[RestrictedRawKey["F6"] = 117] = "F6";
    RestrictedRawKey[RestrictedRawKey["F7"] = 118] = "F7";
    RestrictedRawKey[RestrictedRawKey["F8"] = 119] = "F8";
    RestrictedRawKey[RestrictedRawKey["F9"] = 120] = "F9";
    RestrictedRawKey[RestrictedRawKey["F10"] = 121] = "F10";
    RestrictedRawKey[RestrictedRawKey["F11"] = 122] = "F11";
    RestrictedRawKey[RestrictedRawKey["F12"] = 123] = "F12";
    RestrictedRawKey[RestrictedRawKey["F13"] = 124] = "F13";
    RestrictedRawKey[RestrictedRawKey["F14"] = 125] = "F14";
    RestrictedRawKey[RestrictedRawKey["F15"] = 126] = "F15";
    RestrictedRawKey[RestrictedRawKey["F16"] = 127] = "F16";
    RestrictedRawKey[RestrictedRawKey["F17"] = 128] = "F17";
    RestrictedRawKey[RestrictedRawKey["F18"] = 129] = "F18";
    RestrictedRawKey[RestrictedRawKey["F19"] = 130] = "F19";
    RestrictedRawKey[RestrictedRawKey["F20"] = 131] = "F20";
    RestrictedRawKey[RestrictedRawKey["F21"] = 132] = "F21";
    RestrictedRawKey[RestrictedRawKey["F22"] = 133] = "F22";
    RestrictedRawKey[RestrictedRawKey["F23"] = 134] = "F23";
    RestrictedRawKey[RestrictedRawKey["F24"] = 135] = "F24";
    RestrictedRawKey[RestrictedRawKey["NumLock"] = 144] = "NumLock";
    RestrictedRawKey[RestrictedRawKey["ScrollLock"] = 145] = "ScrollLock";
    RestrictedRawKey[RestrictedRawKey["LeftShift"] = 160] = "LeftShift";
    RestrictedRawKey[RestrictedRawKey["RightShift"] = 161] = "RightShift";
    RestrictedRawKey[RestrictedRawKey["LeftControl"] = 162] = "LeftControl";
    RestrictedRawKey[RestrictedRawKey["RightControl"] = 163] = "RightControl";
    RestrictedRawKey[RestrictedRawKey["Alt"] = 164] = "Alt";
})(RestrictedRawKey = exports.RestrictedRawKey || (exports.RestrictedRawKey = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.filterFalsy = exports.generateID = void 0;
var ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
function generateID(length) {
    var id = '';
    for (var i = 0; i < length; i++) {
        id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length) % ID_CHARS.length];
    }
    return id;
}
exports.generateID = generateID;
function filterFalsy(value) {
    return !!value;
}
exports.filterFalsy = filterFalsy;
function wait(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.wait = wait;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
function validate(value, name, schema) {
    if (typeof schema === 'string') {
        if (typeof value !== schema)
            throw new Error("".concat(name, " must be a ").concat(schema, " (got ").concat(typeof value, " instead)"));
    }
    else if (Array.isArray(schema)) {
        var type = schema[0], subSchema = schema[1];
        if (type === 'nullable') {
            if (value !== null)
                validate(value, name, subSchema);
        }
        else if (type === 'optional') {
            if (value !== undefined)
                validate(value, name, subSchema);
        }
        else if (type === 'stringEnum') {
            if (typeof value !== 'string')
                throw new Error("".concat(name, " must be a string (got ").concat(typeof value, " instead)"));
            if (subSchema.indexOf(value) === -1)
                throw new Error("".concat(name, " must be one of the following: ").concat(subSchema.map(function (s) { return JSON.stringify(s); }).join(', ')));
        }
        else if (type === 'numberEnum') {
            if (typeof value !== 'number')
                throw new Error("".concat(name, " must be a number (got ").concat(typeof value, " instead)"));
            if (subSchema.indexOf(value) === -1)
                throw new Error("".concat(name, " must be one of the following: ").concat(subSchema.map(function (s) { return JSON.stringify(s); }).join(', ')));
        }
        else if (type === 'array') {
            if (!Array.isArray(value))
                throw new Error("".concat(name, " must be an array (got ").concat(typeof value, " instead)"));
            for (var i = 0; i < value.length; i++)
                validate(value[i], "".concat(name, "[").concat(i, "]"), subSchema);
        }
        else if (type === 'object') {
            if (typeof value !== 'object')
                throw new Error("".concat(name, " must be an object (got ").concat(typeof value, " instead)"));
            for (var k in subSchema) {
                validate(value[k], "".concat(name, ".").concat(k), subSchema[k]);
            }
            for (var k in value) {
                if (!(k in subSchema))
                    throw new Error("".concat(name, ".").concat(k, " must not be set"));
            }
        }
    }
}
exports.validate = validate;

},{}],8:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocketImpl = void 0;
function getWebSocketImpl() {
    var ws = undefined;
    if (!ws && typeof WebSocket !== 'undefined')
        ws = WebSocket;
    if (!ws && typeof window !== 'undefined' && 'WebSocket' in window)
        ws = window.WebSocket;
    if (!ws && typeof global !== 'undefined' && 'WebSocket' in global)
        ws = global.WebSocket;
    if (!ws && typeof self !== 'undefined' && 'WebSocket' in self)
        ws = self.WebSocket;
    if (!ws)
        throw new Error('Could not locate a WebSocket implementation in your current environment. Please provide a WebSocket factory manually in the constructor options.');
    return ws;
}
exports.getWebSocketImpl = getWebSocketImpl;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
