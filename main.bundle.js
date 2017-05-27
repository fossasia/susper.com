webpackJsonp([0,3],{

/***/ 1057:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "not-found-bg.8f346a53ee078b98deb0.jpg";

/***/ }),

/***/ 1059:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(471);


/***/ }),

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(393);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QueryAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return QueryServerAction; });

var ActionTypes = {
    QUERYCHANGE: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Query] Change'),
    QUERYSERVER: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Query] Server'),
};
var QueryAction = (function () {
    function QueryAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.QUERYCHANGE;
    }
    return QueryAction;
}());
var QueryServerAction = (function () {
    function QueryServerAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.QUERYSERVER;
    }
    return QueryServerAction;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/query.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KnowledgeapiService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var KnowledgeapiService = (function () {
    function KnowledgeapiService(http, jsonp, store) {
        this.http = http;
        this.jsonp = jsonp;
        this.store = store;
        this.server = 'http://lookup.dbpedia.org';
        this.searchURL = this.server + '/api/search/KeywordSearch?';
        this.homepage = 'http://susper.com';
        this.logo = '../images/susper.svg';
    }
    KnowledgeapiService.prototype.getsearchresults = function (searchquery) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        params.set('QueryString', searchquery);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Headers */]({ 'Accept': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({ headers: headers, search: params });
        return this.http
            .get(this.searchURL, options).map(function (res) {
            return res.json();
        }).catch(this.handleError);
    };
    KnowledgeapiService.prototype.handleError = function (error) {
        // In some advance version we can include a remote logging of errors
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // Right now we are logging to console itself
        return __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"].throw(errMsg);
    };
    KnowledgeapiService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */]) === 'function' && _c) || Object])
    ], KnowledgeapiService);
    return KnowledgeapiService;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/knowledgeapi.service.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SearchService = (function () {
    function SearchService(http, jsonp, store) {
        this.http = http;
        this.jsonp = jsonp;
        this.store = store;
        this.server = 'yacy.searchlab.eu';
        this.searchURL = 'http://' + this.server + '/solr/select?callback=?';
        this.suggestUrl = 'http://' + this.server + '/suggest.json?callback=?';
        this.homepage = 'http://susper.com';
        this.logo = '../images/susper.svg';
    }
    SearchService.prototype.getsearchresults = function (searchquery) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        for (var key in searchquery) {
            if (searchquery.hasOwnProperty(key)) {
                params.set(key, searchquery[key]);
            }
        }
        params.set('wt', 'yjson');
        params.set('callback', 'JSONP_CALLBACK');
        params.set('facet', 'true');
        params.set('facet.mincount', '1');
        params.append('facet.field', 'host_s');
        params.append('facet.field', 'url_protocol_s');
        params.append('facet.field', 'author_sxt');
        params.append('facet.field', 'collection_sxt');
        return this.jsonp
            .get('http://yacy.searchlab.eu/solr/select', { search: params }).map(function (res) {
            return res.json()[0];
        }).catch(this.handleError);
    };
    SearchService.prototype.handleError = function (error) {
        // In some advance version we can include a remote logging of errors
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // Right now we are logging to console itself
        return __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"].throw(errMsg);
    };
    SearchService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */]) === 'function' && _c) || Object])
    ], SearchService);
    return SearchService;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search.service.js.map

/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(393);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchAction; });
/* unused harmony export ItemsAction */
/* unused harmony export TotalResultsAction */
/* unused harmony export NavigationAction */

var ActionTypes = {
    CHANGE: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Search] Change'),
    ITEMS: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Search] Items'),
    TOTALRESULTS: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Search] Totalresults'),
    NAVIGATION: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Search] Navigation'),
};
var SearchAction = (function () {
    function SearchAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.CHANGE;
    }
    return SearchAction;
}());
var ItemsAction = (function () {
    function ItemsAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.ITEMS;
    }
    return ItemsAction;
}());
var TotalResultsAction = (function () {
    function TotalResultsAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.TOTALRESULTS;
    }
    return TotalResultsAction;
}());
var NavigationAction = (function () {
    function NavigationAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.NAVIGATION;
    }
    return NavigationAction;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search.js.map

/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
        this.title = 'Susper';
    }
    AppComponent.prototype.ngOnInit = function () {
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* NavigationEnd */])) {
                return;
            }
            window.scrollTo(0, 0);
        });
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(791),
            styles: [__webpack_require__(773)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/app.component.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AutocompleteService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AutocompleteService = (function () {
    function AutocompleteService(http, jsonp, store) {
        this.http = http;
        this.jsonp = jsonp;
        this.store = store;
        this.server = 'http://lookup.dbpedia.org';
        this.searchURL = this.server + '/api/search/PrefixSearch?';
        this.homepage = 'http://susper.com';
        this.logo = '../images/susper.svg';
    }
    AutocompleteService.prototype.getsearchresults = function (searchquery) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* URLSearchParams */]();
        params.set('QueryString', searchquery);
        // params.set('QueryClass', 'MaxHits=5');
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Headers */]({ 'Accept': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({ headers: headers, search: params });
        return this.http
            .get(this.searchURL, options).map(function (res) {
            return res.json();
        }).catch(this.handleError);
    };
    AutocompleteService.prototype.handleError = function (error) {
        // In some advance version we can include a remote logging of errors
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // Right now we are logging to console itself
        return __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"].throw(errMsg);
    };
    AutocompleteService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["g" /* Jsonp */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */]) === 'function' && _c) || Object])
    ], AutocompleteService);
    return AutocompleteService;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/autocomplete.service.js.map

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = type;
/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */
var typeCache = {};
function type(label) {
    if (typeCache[label]) {
        throw new Error("Action type \"" + label + "\" is not unique\"");
    }
    typeCache[label] = true;
    return label;
}
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/utils.js.map

/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/environment.js.map

/***/ }),

/***/ 470:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 470;


/***/ }),

/***/ 471:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(618);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(606);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/main.js.map

/***/ }),

/***/ 599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-about',
            template: __webpack_require__(789),
            styles: [__webpack_require__(771)]
        }), 
        __metadata('design:paramtypes', [])
    ], AboutComponent);
    return AboutComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/about.component.js.map

/***/ }),

/***/ 600:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdvancedsearchComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AdvancedsearchComponent = (function () {
    function AdvancedsearchComponent(route, activatedroute, store) {
        var _this = this;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.querylook = {};
        this.selectedelements = [];
        this.activatedroute.queryParams.subscribe(function (query) {
            _this.querylook = Object.assign({}, query);
            _this.navigation$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["d" /* getNavigation */]);
        });
    }
    AdvancedsearchComponent.prototype.changeurl = function (modifier, element) {
        this.querylook['query'] = this.querylook['query'] + '+' + decodeURIComponent(modifier);
        this.selectedelements.push(element);
        this.route.navigate(['/search'], { queryParams: this.querylook });
    };
    AdvancedsearchComponent.prototype.removeurl = function (modifier) {
        this.querylook['query'] = this.querylook['query'].replace('+' + decodeURIComponent(modifier), '');
        this.route.navigate(['/search'], { queryParams: this.querylook });
    };
    AdvancedsearchComponent.prototype.ngOnInit = function () {
    };
    AdvancedsearchComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-advancedsearch',
            template: __webpack_require__(790),
            styles: [__webpack_require__(772)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */]) === 'function' && _c) || Object])
    ], AdvancedsearchComponent);
    return AdvancedsearchComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/advancedsearch.component.js.map

/***/ }),

/***/ 601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(549);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__ = __webpack_require__(609);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index_index_component__ = __webpack_require__(607);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__results_results_component__ = __webpack_require__(615);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__search_service__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__ = __webpack_require__(611);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_common__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__advancedsearch_advancedsearch_component__ = __webpack_require__(600);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngrx_store_devtools__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__reducers_index__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__ = __webpack_require__(616);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__about_about_component__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__footer_navbar_footer_navbar_component__ = __webpack_require__(605);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__contact_contact_component__ = __webpack_require__(603);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ng2_bs3_modal_ng2_bs3_modal__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ng2_bs3_modal_ng2_bs3_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_ng2_bs3_modal_ng2_bs3_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__terms_terms_component__ = __webpack_require__(617);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ngrx_effects__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__effects_search_effects__ = __webpack_require__(604);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__newadvancedsearch_newadvancedsearch_component__ = __webpack_require__(610);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__infobox_infobox_component__ = __webpack_require__(608);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__knowledgeapi_service__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__related_search_related_search_component__ = __webpack_require__(614);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__autocomplete_service__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__auto_complete_auto_complete_component__ = __webpack_require__(602);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






























var appRoutes = [
    { path: 'search', component: __WEBPACK_IMPORTED_MODULE_7__results_results_component__["a" /* ResultsComponent */] },
    { path: '', component: __WEBPACK_IMPORTED_MODULE_6__index_index_component__["a" /* IndexComponent */] },
    { path: 'about', component: __WEBPACK_IMPORTED_MODULE_17__about_about_component__["a" /* AboutComponent */] },
    { path: 'terms', component: __WEBPACK_IMPORTED_MODULE_21__terms_terms_component__["a" /* TermsComponent */] },
    { path: 'contact', component: __WEBPACK_IMPORTED_MODULE_19__contact_contact_component__["a" /* ContactComponent */] },
    { path: '404', component: __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__["a" /* NotFoundComponent */] },
    { path: 'advancedsearch', component: __WEBPACK_IMPORTED_MODULE_24__newadvancedsearch_newadvancedsearch_component__["a" /* NewadvancedsearchComponent */] },
    { path: '**', redirectTo: '/404' },
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_6__index_index_component__["a" /* IndexComponent */],
                __WEBPACK_IMPORTED_MODULE_7__results_results_component__["a" /* ResultsComponent */],
                __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__["a" /* NotFoundComponent */],
                __WEBPACK_IMPORTED_MODULE_12__advancedsearch_advancedsearch_component__["a" /* AdvancedsearchComponent */],
                __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__["a" /* SearchBarComponent */],
                __WEBPACK_IMPORTED_MODULE_17__about_about_component__["a" /* AboutComponent */],
                __WEBPACK_IMPORTED_MODULE_18__footer_navbar_footer_navbar_component__["a" /* FooterNavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_19__contact_contact_component__["a" /* ContactComponent */],
                __WEBPACK_IMPORTED_MODULE_21__terms_terms_component__["a" /* TermsComponent */],
                __WEBPACK_IMPORTED_MODULE_24__newadvancedsearch_newadvancedsearch_component__["a" /* NewadvancedsearchComponent */],
                __WEBPACK_IMPORTED_MODULE_25__infobox_infobox_component__["a" /* InfoboxComponent */],
                __WEBPACK_IMPORTED_MODULE_27__related_search_related_search_component__["a" /* RelatedSearchComponent */],
                __WEBPACK_IMPORTED_MODULE_29__auto_complete_auto_complete_component__["a" /* AutoCompleteComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_11__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* JsonpModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_router__["a" /* RouterModule */].forRoot(appRoutes),
                __WEBPACK_IMPORTED_MODULE_14__ngrx_store__["a" /* StoreModule */].provideStore(__WEBPACK_IMPORTED_MODULE_15__reducers_index__["a" /* reducer */]),
                __WEBPACK_IMPORTED_MODULE_22__ngrx_effects__["a" /* EffectsModule */].run(__WEBPACK_IMPORTED_MODULE_23__effects_search_effects__["a" /* ApiSearchEffects */]),
                __WEBPACK_IMPORTED_MODULE_13__ngrx_store_devtools__["a" /* StoreDevtoolsModule */].instrumentOnlyWithExtension(),
                __WEBPACK_IMPORTED_MODULE_20_ng2_bs3_modal_ng2_bs3_modal__["Ng2Bs3ModalModule"]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_9__search_service__["a" /* SearchService */], __WEBPACK_IMPORTED_MODULE_26__knowledgeapi_service__["a" /* KnowledgeapiService */], __WEBPACK_IMPORTED_MODULE_28__autocomplete_service__["a" /* AutocompleteService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/app.module.js.map

/***/ }),

/***/ 602:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autocomplete_service__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__reducers__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AutoCompleteComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AutoCompleteComponent = (function () {
    function AutoCompleteComponent(autocompleteservice, route, activatedroute, store, ref) {
        var _this = this;
        this.autocompleteservice = autocompleteservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.ref = ref;
        this.resultsearch = '/search';
        this.query$ = store.select(__WEBPACK_IMPORTED_MODULE_4__reducers__["b" /* getquery */]);
        this.query$.subscribe(function (query) {
            if (query) {
                _this.autocompleteservice.getsearchresults(query).subscribe(function (res) {
                    if (res.results) {
                        _this.results = res.results;
                    }
                    else {
                        _this.results = [];
                    }
                });
            }
        });
    }
    AutoCompleteComponent.prototype.ngOnInit = function () {
    };
    AutoCompleteComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-auto-complete',
            template: __webpack_require__(792),
            styles: [__webpack_require__(774)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__autocomplete_service__["a" /* AutocompleteService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__autocomplete_service__["a" /* AutocompleteService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__ngrx_store__["b" /* Store */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === 'function' && _e) || Object])
    ], AutoCompleteComponent);
    return AutoCompleteComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/auto-complete.component.js.map

/***/ }),

/***/ 603:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bs3_modal_ng2_bs3_modal__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bs3_modal_ng2_bs3_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bs3_modal_ng2_bs3_modal__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactComponent = (function () {
    function ContactComponent() {
        this.contactMessage = '';
    }
    ContactComponent.prototype.ngOnInit = function () {
    };
    ContactComponent.prototype.close = function () {
        this.modal.close();
    };
    ContactComponent.prototype.open = function () {
        this.modal.open();
    };
    // check whether messsage contains morthan 100 words
    ContactComponent.prototype.checkValidity = function () {
        if (this.tpnoInput && this.tpnoInput.toString().length >= 10 && this.tpnoInput > 0) {
            this.submitButton.nativeElement.disabled = false;
        }
        else {
            this.submitButton.nativeElement.disabled = true;
        }
        if (this.contactMessage && this.contactMessage.length >= 100) {
            this.submitButton.nativeElement.disabled = false;
        }
        else {
            this.submitButton.nativeElement.disabled = true;
        }
    }; // End checkWordCount()
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('submitButton'), 
        __metadata('design:type', Object)
    ], ContactComponent.prototype, "submitButton", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('emailInput'), 
        __metadata('design:type', Object)
    ], ContactComponent.prototype, "emailInput", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('myModal'), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bs3_modal_ng2_bs3_modal__["ModalComponent"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1_ng2_bs3_modal_ng2_bs3_modal__["ModalComponent"]) === 'function' && _a) || Object)
    ], ContactComponent.prototype, "modal", void 0);
    ContactComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-contact',
            template: __webpack_require__(793),
            styles: [__webpack_require__(775)]
        }), 
        __metadata('design:paramtypes', [])
    ], ContactComponent);
    return ContactComponent;
    var _a;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/contact.component.js.map

/***/ }),

/***/ 604:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_effects__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_switchMap__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_debounceTime__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_debounceTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_debounceTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_skip__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_skip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_skip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_takeUntil__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__actions_query__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__actions_search__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__search_service__ = __webpack_require__(254);
/* unused harmony export CHANGE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiSearchEffects; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var CHANGE = 'CHANGE';


/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * A simple way to think of it is that ngrx/effects is an event listener of sorts.
 * It listens for actions being dispatched to the store. You can then tell `ngrx/effects`
 * that when a particular action is dispatched, to take another, new action as a result.
 * At the end, what’s really happening is `ngrx/effects` is an `action generator` that dispatches
 * a `new action` as a result of a different action.
 */
var ApiSearchEffects = (function () {
    function ApiSearchEffects(actions$, searchService, store) {
        var _this = this;
        this.actions$ = actions$;
        this.searchService = searchService;
        this.store = store;
        this.search$ = this.actions$
            .ofType(__WEBPACK_IMPORTED_MODULE_11__actions_query__["a" /* ActionTypes */].QUERYSERVER)
            .debounceTime(300)
            .map(function (action) { return action.payload; })
            .switchMap(function (querypay) {
            if (querypay === '') {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty__["empty"])();
            }
            var nextSearch$ = _this.actions$.ofType(__WEBPACK_IMPORTED_MODULE_11__actions_query__["a" /* ActionTypes */].QUERYSERVER).skip(1);
            _this.searchService.getsearchresults(querypay)
                .takeUntil(nextSearch$)
                .subscribe(function (response) {
                _this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_12__actions_search__["a" /* SearchAction */](response));
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty__["empty"])();
            });
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_empty__["empty"])();
        });
    }
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__ngrx_effects__["b" /* Effect */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"]) === 'function' && _a) || Object)
    ], ApiSearchEffects.prototype, "search$", void 0);
    ApiSearchEffects = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ngrx_effects__["c" /* Actions */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__ngrx_effects__["c" /* Actions */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_13__search_service__["a" /* SearchService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_13__search_service__["a" /* SearchService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */]) === 'function' && _d) || Object])
    ], ApiSearchEffects);
    return ApiSearchEffects;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search-effects.js.map

/***/ }),

/***/ 605:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterNavbarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterNavbarComponent = (function () {
    function FooterNavbarComponent() {
    }
    FooterNavbarComponent.prototype.ngOnInit = function () {
    };
    FooterNavbarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer-navbar',
            template: __webpack_require__(794),
            styles: [__webpack_require__(776)]
        }), 
        __metadata('design:paramtypes', [])
    ], FooterNavbarComponent);
    return FooterNavbarComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/footer-navbar.component.js.map

/***/ }),

/***/ 606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(391);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(601);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.js.map

/***/ }),

/***/ 607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var IndexComponent = (function () {
    function IndexComponent(route, router) {
        this.route = route;
        this.router = router;
        this.searchdata = {
            query: '',
            verify: false,
            nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
            start: 0,
            indexof: 'off',
            meanCount: '5',
            resource: 'global',
            prefermaskfilter: '',
            maximumRecords: 10,
            timezoneOffset: 0
        };
    }
    IndexComponent.prototype.ngOnInit = function () {
        this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
    };
    IndexComponent.prototype.submit = function () {
        this.router.navigate(['/search'], { queryParams: this.searchdata });
    };
    IndexComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-index',
            template: __webpack_require__(795),
            styles: [__webpack_require__(777)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], IndexComponent);
    return IndexComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.component.js.map

/***/ }),

/***/ 608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__ = __webpack_require__(253);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoboxComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var InfoboxComponent = (function () {
    function InfoboxComponent(knowledgeservice, route, activatedroute, store, ref) {
        var _this = this;
        this.knowledgeservice = knowledgeservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.ref = ref;
        this.resultsearch = '/search';
        this.query$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["b" /* getquery */]);
        this.resultscomponentchange$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["c" /* getItems */]);
        this.resultscomponentchange$.subscribe(function (res) {
            _this.results = _this.initialresults;
        });
        this.query$.subscribe(function (query) {
            if (query) {
                _this.knowledgeservice.getsearchresults(query).subscribe(function (res) {
                    if (res.results) {
                        if (res.results[0].label.toLowerCase().includes(query.toLowerCase())) {
                            _this.initialresults = res.results;
                        }
                        else {
                            _this.initialresults = [];
                        }
                    }
                    else {
                        _this.initialresults = [];
                    }
                });
            }
            else {
                _this.initialresults = [];
            }
        });
    }
    InfoboxComponent.prototype.ngOnInit = function () {
    };
    InfoboxComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-infobox',
            template: __webpack_require__(796),
            styles: [__webpack_require__(778)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__["a" /* KnowledgeapiService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__["a" /* KnowledgeapiService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === 'function' && _e) || Object])
    ], InfoboxComponent);
    return InfoboxComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/infobox.component.js.map

/***/ }),

/***/ 609:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NavbarComponent = (function () {
    function NavbarComponent(route, router) {
        this.route = route;
        this.router = router;
        this.searchdata = {
            query: '',
            verify: false,
            nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
            start: 0,
            indexof: 'off',
            meanCount: '5',
            resource: 'global',
            prefermaskfilter: '',
            maximumRecords: 10,
            timezoneOffset: 0
        };
    }
    NavbarComponent.prototype.ngOnInit = function () {
        this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
    };
    NavbarComponent.prototype.submit = function () {
        this.router.navigate(['/search'], { queryParams: this.searchdata });
    };
    NavbarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__(797),
            styles: [__webpack_require__(779)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NavbarComponent);
    return NavbarComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/navbar.component.js.map

/***/ }),

/***/ 610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewadvancedsearchComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NewadvancedsearchComponent = (function () {
    function NewadvancedsearchComponent() {
    }
    NewadvancedsearchComponent.prototype.ngOnInit = function () {
    };
    NewadvancedsearchComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-newadvancedsearch',
            template: __webpack_require__(798),
            styles: [__webpack_require__(780)]
        }), 
        __metadata('design:paramtypes', [])
    ], NewadvancedsearchComponent);
    return NewadvancedsearchComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/newadvancedsearch.component.js.map

/***/ }),

/***/ 611:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotFoundComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NotFoundComponent = (function () {
    function NotFoundComponent(route, router) {
        this.route = route;
        this.router = router;
        this.searchdata = {
            query: '',
            verify: false,
            nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
            startRecord: 0,
            indexof: 'off',
            meanCount: '5',
            resource: 'global',
            prefermaskfilter: '',
            maximumRecords: 10,
            timezoneOffset: 0,
        };
    }
    NotFoundComponent.prototype.ngOnInit = function () {
        this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
    };
    NotFoundComponent.prototype.submit = function () {
        this.router.navigate(['/search', this.searchdata]);
    };
    NotFoundComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-not-found',
            template: __webpack_require__(799),
            styles: [__webpack_require__(781)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NotFoundComponent);
    return NotFoundComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/not-found.component.js.map

/***/ }),

/***/ 612:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_query__ = __webpack_require__(178);
/* unused harmony export CHANGE */
/* harmony export (immutable) */ __webpack_exports__["a"] = reducer;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getpresentquery; });

var CHANGE = 'CHANGE';
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
var initialState = {
    query: '',
};
function reducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case __WEBPACK_IMPORTED_MODULE_0__actions_query__["a" /* ActionTypes */].QUERYCHANGE: {
            var query_1 = action.payload;
            return Object.assign({}, state, {
                query: query_1,
            });
        }
        default: {
            return state;
        }
    }
}
var getpresentquery = function (state) { return state.query; };
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/query.js.map

/***/ }),

/***/ 613:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_search__ = __webpack_require__(390);
/* unused harmony export CHANGE */
/* harmony export (immutable) */ __webpack_exports__["a"] = reducer;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getsearchresults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getItems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getTotalResults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getNavigation; });

var CHANGE = 'CHANGE';
/**
 * There is always a need of initial state to be passed onto the store.
 *
 * @prop: query: ''
 * @prop: loading: false
 */
var initialState = {
    searchresults: {},
    items: [],
    totalResults: 0,
    navigation: []
};
function reducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case __WEBPACK_IMPORTED_MODULE_0__actions_search__["b" /* ActionTypes */].CHANGE: {
            var search_1 = action.payload;
            return Object.assign({}, state, {
                searchresults: search_1,
                items: search_1.channels[0].items,
                totalResults: Number(search_1.channels[0].totalResults) || 0,
                navigation: search_1.channels[0].navigation,
            });
        }
        default: {
            return state;
        }
    }
}
var getsearchresults = function (state) { return state.searchresults; };
var getItems = function (state) { return state.items; };
var getTotalResults = function (state) { return state.totalResults; };
var getNavigation = function (state) { return state.navigation; };
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search.js.map

/***/ }),

/***/ 614:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__ = __webpack_require__(253);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RelatedSearchComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var RelatedSearchComponent = (function () {
    function RelatedSearchComponent(knowledgeservice, route, activatedroute, store, ref) {
        var _this = this;
        this.knowledgeservice = knowledgeservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.ref = ref;
        this.resultsearch = '/search';
        this.query$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["b" /* getquery */]);
        this.resultscomponentchange$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["c" /* getItems */]);
        this.resultscomponentchange$.subscribe(function (res) {
            _this.results = _this.initialresults;
        });
        this.query$.subscribe(function (query) {
            if (query) {
                _this.knowledgeservice.getsearchresults(query).subscribe(function (res) {
                    if (res.results) {
                        if (!res.results[0].label.toLowerCase().localeCompare(query.toLowerCase())) {
                            res.results.splice(0, 1);
                            _this.initialresults = res.results;
                        }
                        else {
                            _this.initialresults = res.results;
                        }
                        _this.keyword = query;
                    }
                    else {
                        _this.initialresults = [];
                        _this.keyword = query;
                    }
                });
            }
            else {
                _this.initialresults = [];
            }
        });
    }
    RelatedSearchComponent.prototype.ngOnInit = function () {
    };
    RelatedSearchComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-related-search',
            template: __webpack_require__(800),
            styles: [__webpack_require__(782)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__["a" /* KnowledgeapiService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__knowledgeapi_service__["a" /* KnowledgeapiService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === 'function' && _e) || Object])
    ], RelatedSearchComponent);
    return RelatedSearchComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/related-search.component.js.map

/***/ }),

/***/ 615:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_service__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_query__ = __webpack_require__(178);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResultsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ResultsComponent = (function () {
    function ResultsComponent(searchservice, route, activatedroute, store, ref) {
        var _this = this;
        this.searchservice = searchservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.ref = ref;
        this.searchdata = {
            query: '',
            verify: false,
            nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
            start: 0,
            indexof: 'off',
            meanCount: '5',
            resource: 'global',
            prefermaskfilter: '',
            rows: 10,
            timezoneOffset: 0,
        };
        this.querylook = {};
        this.hidefooter = 1;
        this.activatedroute.queryParams.subscribe(function (query) {
            _this.hidefooter = 1;
            if (query['fq']) {
                if (query['fq'].includes('png')) {
                    _this.resultDisplay = 'images';
                    _this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
                }
                else if (query['fq'].includes('avi')) {
                    _this.resultDisplay = 'videos';
                }
                else {
                    _this.resultDisplay = 'all';
                }
            }
            else {
                _this.resultDisplay = 'all';
            }
            if (query['resultDisplay']) {
                _this.resultDisplay = query['resultDisplay'];
                _this.searchdata.resultDisplay = _this.resultDisplay;
            }
            _this.presentPage = Math.abs(query['start'] / _this.searchdata.rows) + 1;
            _this.searchdata.query = query['query'];
            _this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_5__actions_query__["b" /* QueryAction */](query['query']));
            _this.querylook = Object.assign({}, query);
            _this.searchdata.sort = query['sort'];
            _this.begin = Number(query['start']) + 1;
            _this.message = '';
            _this.start = (_this.presentPage - 1) * _this.searchdata.rows;
            _this.begin = _this.start + 1;
            _this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_5__actions_query__["c" /* QueryServerAction */](query));
            _this.items$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["c" /* getItems */]);
            _this.totalResults$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["e" /* getTotalResults */]);
            _this.totalResults$.subscribe(function (totalResults) {
                if (totalResults) {
                    _this.hidefooter = 0;
                }
                _this.end = Math.min(totalResults, _this.begin + _this.searchdata.rows - 1);
                _this.message = 'showing results ' + _this.begin + ' to ' + _this.end + ' of ' + totalResults;
                _this.noOfPages = Math.ceil(totalResults / _this.searchdata.rows);
                _this.maxPage = Math.min(_this.searchdata.rows, _this.noOfPages);
            });
            _this.searchdata.rows = Number(query['rows']) || 10;
            _this.presentPage = Math.abs(query['start'] / _this.searchdata.rows) + 1;
        });
        this.totalResults$.subscribe(function (totalResults) {
            if (totalResults) {
                _this.hidefooter = 0;
            }
            _this.end = Math.min(totalResults, _this.begin + _this.searchdata.rows - 1);
            _this.message = 'showing results ' + _this.begin + ' to ' + _this.end + ' of ' + totalResults;
            _this.noOfPages = Math.ceil(totalResults / _this.searchdata.rows);
            _this.maxPage = Math.min(_this.searchdata.rows, _this.noOfPages);
        });
    }
    ResultsComponent.prototype.getNumber = function (N) {
        var result = Array.apply(null, { length: N }).map(Number.call, Number);
        if (result.length > 10) {
            result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        return result;
    };
    ;
    ResultsComponent.prototype.advancedsearch = function () {
    };
    ResultsComponent.prototype.getPresentPage = function (N) {
        this.presentPage = N;
        this.searchdata.start = (this.presentPage) * this.searchdata.rows;
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.filterByDate = function () {
        this.searchdata.sort = 'last_modified desc';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.filterByContext = function () {
        delete this.searchdata.sort;
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.Display = function (S) {
        return (this.resultDisplay === S);
    };
    ResultsComponent.prototype.videoClick = function () {
        this.getPresentPage(0);
        this.resultDisplay = 'videos';
        this.searchdata.rows = 10;
        this.searchdata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+mp4)';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.imageClick = function () {
        this.getPresentPage(0);
        this.resultDisplay = 'images';
        this.searchdata.rows = 100;
        this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
        this.searchdata.resultDisplay = this.resultDisplay;
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.docClick = function () {
        this.getPresentPage(0);
        this.resultDisplay = 'all';
        delete this.searchdata.fq;
        this.searchdata.rows = 10;
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.incPresentPage = function () {
        this.presentPage = Math.min(this.noOfPages, this.presentPage + 1);
        this.getPresentPage(this.presentPage);
    };
    ResultsComponent.prototype.decPresentPage = function () {
        this.presentPage = Math.max(1, this.presentPage - 1);
        this.getPresentPage(this.presentPage);
    };
    ResultsComponent.prototype.getStyle = function (page) {
        return ((this.presentPage) === page);
    };
    ;
    ResultsComponent.prototype.ngOnInit = function () {
    };
    ResultsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-results',
            template: __webpack_require__(801),
            styles: [__webpack_require__(783)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* Store */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === 'function' && _e) || Object])
    ], ResultsComponent);
    return ResultsComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/results.component.js.map

/***/ }),

/***/ 616:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_query__ = __webpack_require__(178);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchBarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SearchBarComponent = (function () {
    function SearchBarComponent(route, router, store) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.store = store;
        this.searchdata = {
            query: '',
            verify: false,
            nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
            start: 0,
            indexof: 'off',
            meanCount: '5',
            resource: 'global',
            prefermaskfilter: '',
            maximumRecords: 10,
            timezoneOffset: 0
        };
        this.query$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["b" /* getquery */]);
        this.query$.subscribe(function (query) {
            _this.searchdata.query = query;
        });
    }
    ;
    SearchBarComponent.prototype.onquery = function (event) {
        this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_4__actions_query__["b" /* QueryAction */](event.target.value));
        this.submit();
    };
    SearchBarComponent.prototype.ngOnInit = function () {
        this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
    };
    SearchBarComponent.prototype.ngAfterViewInit = function () {
        this.vc.first.nativeElement.focus();
    };
    SearchBarComponent.prototype.submit = function () {
        this.router.navigate(['/search'], { queryParams: this.searchdata });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChildren"])('input'), 
        __metadata('design:type', Object)
    ], SearchBarComponent.prototype, "vc", void 0);
    SearchBarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-search-bar',
            template: __webpack_require__(802),
            styles: [__webpack_require__(784)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["b" /* Store */]) === 'function' && _c) || Object])
    ], SearchBarComponent);
    return SearchBarComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search-bar.component.js.map

/***/ }),

/***/ 617:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TermsComponent = (function () {
    function TermsComponent() {
    }
    TermsComponent.prototype.ngOnInit = function () {
    };
    TermsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-terms',
            template: __webpack_require__(803),
            styles: [__webpack_require__(785)]
        }), 
        __metadata('design:paramtypes', [])
    ], TermsComponent);
    return TermsComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/terms.component.js.map

/***/ }),

/***/ 618:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(625);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(621);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(627);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(626);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(624);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(623);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(631);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(619);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(629);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(622);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(630);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(628);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(633);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(1058);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/polyfills.js.map

/***/ }),

/***/ 771:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".banner {\n    width: 100%;\n    position: relative;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    top: -10%;\n    overflow: hidden;\n}\n\n.navbar-nav > li > a{\n  text-align: left;\n}\n\n.navbar-right{\n  border-top:none;\n}\n\n.image-banner {\n    position: relative;\n    height: 450px;\n    overflow: hidden;\n}\n\n.navbar-logo {\n    height: 30px;\n    padding-left: 20px;\n}\n\n.navbar-text {\n    padding-right: 30px;\n    font-size: 20px;\n}\n\n.text-center {\n    text-align: center;\n    font-family: \"Quicksand\", sans-serif;\n}\n\n.bold {\n    font-weight: 700;\n}\n\n@media screen and (max-width:990px) {\n    .image-banner {\n        height: 190px;\n    }\n    .banner {\n        top: 0;\n    }\n    .navbar-collapse.navbar-right {\n        text-align: right;\n    }\n}\n\n.about-navbar {\n    position: relative;\n    top: -5px;\n}\n\n.navbar {\n    margin-bottom: 0px !important;\n}\n\n.nav-about {\n    clear: both;\n    margin: -57px 0 0 0\n}\n\n.sub-details {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n}\n\n.sub-details h5 {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    margin: 20px 0 20px 0;\n}\n\n.sub-details p {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    text-align: justify;\n}\n\n.about-sub-details {\n    padding: 20px 0 20px 0;\n    border-top: 1px solid #eee;\n    border-bottom: 1px solid #eee;\n}\n\n.about-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n\n.contact-sub-details {\n    margin-bottom: 40px;\n}\n\n.contact-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n.navbar-fixed-bottom, .navbar-fixed-top{\n    position: relative !important;\n}\n\n.contents {\n    text-align: right;\n}\n\na {\n    text-decoration: none;\n    padding-right: 30px;\n    color: rgb(119,119,119);\n}\n\n.navbar-collapse.navbar-right {\n    padding-top: 15px;\n}\n\na:hover {\n    color: rgb(51,51,51);\n    text-decoration: none;\n}\n\n.navbar-brand {\n    padding-left: 100px;\n}\n@media only screen and (max-width: 768px) {\n  .navbar-logo{\n    margin-left: -77px;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 772:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 773:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 774:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "a{\n  text-decoration: none;\n  font-family: Arial, sans-serif;\n  padding-bottom: 1%;\n}\n\n.suggestion-box{\n  width: 100%;\n  border: solid;\n  background-color: white;\n  padding: 1%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 775:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "@media screen and (max-width:990px) {\n    .navbar-collapse.navbar-right {\n        text-align: right;\n    }\n}\n.navbar-nav > li > a{\n  text-align: left;\n}\n\n.navbar-right{\n  border-top:none;\n}\n\n.banner {\n    width: 100%;\n    position: relative;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    top: -10%;\n    overflow: hidden;\n}\n\n.image-banner {\n    position: relative;\n    height: 450px;\n    overflow: hidden;\n}\n\n.navbar-logo {\n    height: 30px;\n    padding-left: 20px;\n    margin-top: -4%;\n}\n\n.navbar-text {\n    padding-right: 30px;\n    font-size: 20px;\n}\n\n.text-center {\n    text-align: center;\n    font-family: \"Quicksand\", sans-serif;\n}\n\n.bold {\n    font-weight: 700;\n}\n\n@media screen and (max-width:990px) {\n    .image-banner {\n        height: 190px;\n    }\n    .banner {\n        top: 0;\n    }\n}\n\n.about-navbar {\n    position: relative;\n    top: -5px;\n}\n\n.navbar {\n    margin-bottom: 0px !important;\n}\n\n.nav-about {\n    clear: both;\n    margin: -57px 0 0 0\n}\n\n.sub-details {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n}\n\n.sub-details h5 {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    margin: 20px 0 20px 0;\n}\n\n.sub-details p {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    text-align: justify;\n}\n\n.about-sub-details {\n    padding: 20px 0 20px 0;\n    border-bottom: 1px solid #eee;\n}\n\n.about-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n\n.contact-sub-details {\n    margin-bottom: 40px;\n    line-height: 12px;\n}\n.contact-sub-details p{\n    line-height: 20px;\n}\n.contact-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n.navbar-fixed-bottom, .navbar-fixed-top{\n    position: relative !important;\n}\n.contact-title{\n    border-bottom: 1px solid #eee;\n}\n.form-horizontal{\n    margin: 20px;\n}\n.sub-btn{\n    width: 100%;\n}\n.close-btn{\n    padding: 10px;\n    position: relative;\n    top:5px;\n}\n\na {\n    text-decoration: none;\n    color: rgb(119,119,119);\n}\n\n.navbar-collapse.navbar-right {\n    padding-top: 15px;\n}\n\na:hover {\n    color: rgb(51,51,51);\n    text-decoration: none;\n}\na {\n  color: #1a0dab;\n  text-decoration: none;\n\n}\n\n.navbar-brand {\n    padding-left: 100px;\n}\n\n@media only screen and (max-width: 768px) {\n  .navbar-logo{\n    margin-left: -77px;\n  }\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 776:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".footer-bar {\r\n  width: 100%;\r\n  background: #f2f2f2;\r\n  padding: 0px 14px;\r\n  border-top: 1px solid #e4e4e4;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -ms-flex-wrap: wrap;\r\n      flex-wrap: wrap;\r\n  -webkit-box-pack: justify;\r\n      -ms-flex-pack: justify;\r\n          justify-content: space-between;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  margin-bottom: 0px;\r\n}\r\n\r\ndiv a {\r\n  padding: 0px 6px;\r\n  color: #666;\r\n  font-size: small;\r\n  line-height: 40px;\r\n  text-decoration: none;\r\n}\r\n\r\n@media(max-width: 750px) {\r\n  footer{\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n  }\r\n  .left-side {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n  }\r\n  .right-side {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n  }\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 777:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".starter-template{\r\n  margin-top: 10%;\r\n}\r\n\r\n#search-bar{\r\n  position: absolute;\r\n  left: 28%;\r\n}\r\n\r\n.footer-fixed{\r\n  position: fixed;\r\n  bottom: 0px;\r\n  width: 100%;\r\n}\r\n\r\n#set-susper-default{\r\n  display:none;\r\n}\r\n\r\n@media screen and (max-width: 480px) {\r\n  #set-susper-default h3{\r\n    font-size: 14px;\r\n  }\r\n  #set-susper-default ol{\r\n    font-size: 12px;\r\n  }\r\n  #install-susper{\r\n    font-size: 12px;\r\n  }\r\n  #cancel-installation{\r\n    font-size: 12px;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 281px) {\r\n  #set-susper-default{\r\n    bottom: 80px;\r\n  }\r\n  #set-susper-default h3{\r\n    font-size: 14px;\r\n  }\r\n  #set-susper-default ol{\r\n    font-size: 12px;\r\n  }\r\n  #install-susper{\r\n    font-size: 12px;\r\n  }\r\n  #cancel-installation{\r\n    font-size: 12px;\r\n  }\r\n}\r\n\r\n@media screen and (max-height: 584px) {\r\n  #set-susper-default{\r\n    bottom: 75px;\r\n  }\r\n  #set-susper-default h3{\r\n    font-size: 14px;\r\n  }\r\n  #set-susper-default ol{\r\n    font-size: 12px;\r\n  }\r\n  #install-susper{\r\n    font-size: 12px;\r\n  }\r\n  #cancel-installation{\r\n    font-size: 12px;\r\n  }\r\n}\r\n\r\n@media screen and (max-height: 530px) {\r\n  #set-susper-default{\r\n    bottom: 75px;\r\n  }\r\n  #set-susper-default h3{\r\n    font-size: 12px;\r\n  }\r\n  #set-susper-default ol{\r\n    font-size: 10px;\r\n  }\r\n  #install-susper{\r\n    font-size: 10px;\r\n  }\r\n  #cancel-installation{\r\n    font-size: 10px;\r\n  }\r\n}\r\n\r\n.navbar-fixed-bottom{\r\n  z-index: -1;\r\n}\r\n\r\n.navbar-brand\r\n{\r\n    position: absolute;\r\n    width: 100%;\r\n    left: 0;\r\n    text-align: center;\r\n    margin:0 auto;\r\n}\r\n\r\n.navbar-toggle {\r\n    z-index:3;\r\n}\r\nfooter{\r\n    position: absolute;\r\n    bottom: 0px;\r\n    left: 0px;\r\n    width:100%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 778:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".card {\n  /* Add shadows to create the \"card\" effect */\n  border: 1px solid rgba(150,150,150,0.3);\n  border-bottom-color: rgba(125,125,125,0.3);\n  margin-bottom: 16px;\n  padding: 22px 22px 18px 22px;\n  transition: 0.3s;\n  width: 100%;\n  margin-left: 20px;\n}\n\n/* Add some padding inside the card container */\n.card-container {\n  padding: 2px 16px;\n}\n\n/* Heading */\nh2 {\n  font-size: 2.6em;\n}\n\n/* Description */\np {\n  line-height: 20px;\n  font-family: Arial, sans-serif;\n  font-size: 13px;\n}\n\n/* Points of interest */\nh3 {\n  font-size: 1.3em;\n  margin-left: -15px;\n}\n\na {\n  color: #1a0dab;\n  text-decoration: none;\n  margin-left: -11px;\n}\n\n/** Screen Responsiveness **/\n@media screen and (max-width: 1143px) {\n  .card {\n    display: none;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 779:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".navbar-brand{\n    width: 140px;\n    height: auto;\n}\n\n.menu-image{\n  width: 60px;\n  height: 50px;\n}\n.navbar-default{\n  border-bottom: none;\n}\n\n.top-nav{\n  margin-bottom: 0px;\n  margin-top: -5%;\n  padding-top: 0.4%;\n}\n\n.menu-drop-image{\n  width: 25px;\n  height: auto;\n}\n\n.header{\n  display: inline-block;\n  width: 103px;\n  padding: 1%;\n  text-align: center;\n}\n\n.header-text{\n  font-size: small;\n  width: inherit;\n  text-align: center;\n}\n\n.dropdown-menu{\n  min-width: 240px;\n}\n\n.dropdown {\n  position: relative;\n  margin-left: -10px;\n}\n\n#navcontainer ul {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\n\n@media screen and (min-width:1920px) {\n  .navbar-brand{\n      width: 160px;\n      height: auto;\n  }\n  .top-nav {\n    margin-top: -5%;\n  }\n}\n\n@media screen and (min-width:768px) {\n  #navcontainer ul li {\n    display: inline;\n  }\n  .navbar-right {\n    padding-right: 20px;\n    font-size: 14px;\n    left: 92%;\n  }\n  #navcontainer, #side-menu {\n    margin-top: 8px;\n  }\n}\n\n@media screen and (max-width:1079px) {\n  .navbar-brand{\n      margin-top: 2px;\n      width: 120px;\n  }\n  .top-nav{\n    margin-top: -6%;\n  }\n}\n\n@media screen and (max-width:850px) {\n  .top-nav{\n    margin-top: -7%;\n  }\n}\n\n@media screen and (max-width:768px) {\n  .top-nav{\n    margin-top: -8%;\n  }\n  .navbar-brand{\n      margin-left: 38%;\n      height: auto;\n  }\n  #navbar-search {\n    margin-left: 21%;\n    margin-right: 8%;\n  }\n  .align-navsearch-btn {\n    margin-right: 1% !important;\n  }\n}\n\n@media screen and (min-width:768px) {\n  #navcontainer ul li {\n    display: inline;\n  }\n  .navbar-right {\n    padding-right: 20px;\n    font-size: 14px;\n    left: 95%;\n    position: absolute;\n  }\n  #navcontainer, #side-menu {\n    margin-top: 8px;\n  }\n}\n@media screen and (max-width:639px) {\n  .align-navsearch-btn {\n    margin-right: 2% !important;\n  }\n  .top-nav{\n    margin-top: -9%;\n  }\n}\n\n@media screen and (max-width:479px) {\n  .navbar-brand{\n      margin-left: 33%;\n  }\n  #navbar-search {\n    margin-left: 20%;\n    margin-right: 9%;\n  }\n  .align-navsearch-btn {\n    margin-right: 3% !important;\n  }\n}\n\n@media screen and (max-width:359px) {\n  .navbar-brand{\n    margin-left: 30%;\n  }\n}\n\n.fa {\n  color: #808080;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 780:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "@media screen and (max-width:990px) {\n  .navbar-collapse.navbar-right {\n    text-align: right;\n  }\n}\n.navbar-nav > li > a{\n  text-align: left;\n}\n\n.navbar-right{\n  border-top:none;\n}\n\n.bold{\n  font-weight: 700;\n}\n\n.nav-terms {\n  padding: 0px;\n  clear: both;\n  margin: -57px 0 0 0\n}\n.advsearch-navbar{\n  position: relative;\n  top:-5px;\n}\n\n.navbar {\n  margin-bottom: 0px !important;\n}\n\n.nav-about {\n  clear: both;\n  margin: -57px 0 0 0\n}\n\n.navbar-logo {\n  height: 30px;\n  padding-left: 20px;\n  margin-top: -4%;\n}\n.navbar-brand{\n  margin-left: 25px!important;\n}\nlabel {\n  font-weight: normal !important;\n}\n.btn-round-lg{\n  border-radius: 22.5px;\n}\n.btn-round{\n  border-radius: 11px;\n}\n\n.navbar-brand>img {\n  margin:-5px 0 0 0;\n}\n.navbar-logo {\n  height: 30px;\n  padding-left: 20px;\n}\n\n.navbar-text {\n  padding-right: 30px;\n  font-size: 20px;\n  position: relative;\n  top:-3px;\n}\n\n.text-center{\n  text-align: center;\n}\n\n.link{\n  margin-top:2px;\n  font-weight: 700;\n  line-height: 1.8;\n  color:#1565C0;\n  text-decoration: none !important;\n\n}\n.link:hover{\n  text-decoration: underline;\n}\n\n#left{\n  width:22.6993866%;\n}\n\n#right{\n  width:67.7%;\n}\np{\n  line-height: 20px;\n  text-align: justify;\n}\nh2{\n  line-height: 1.8;\n}\ndiv{\n  margin-top: 0.5%;\n  font-family: Arial,SansSerif;\n}\n@media only screen and (max-width: 500px) {\n  #left{\n    width: 100%;\n  }\n\n  #right{\n    width: 100%;\n  }\n}\n@media only screen and (max-width: 768px) {\n  .navbar-logo{\n    margin-left: -77px;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 781:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".not-found-banner{\n    text-align: center;\n    margin: 0 auto;\n    background: url(" + __webpack_require__(1057) + ");\n    background-size: cover;\n    height: 300px;\n    width: 100%;\n    position: relative;\n    top:-57px;\n}\n.not-found-banner h1{\n    font-size: 72px;\n}\n.not-found-banner h2{\n    font-size: 22px;\n    letter-spacing: 10px;\n}\n\n#search-bar{\n  position: absolute;\n  left: 27%;\n}\n\n@media screen and (min-width: 1920px) {\n  #search-bar{\n    left: 28%;\n  }\n}\n\n@media screen and (max-width: 991px) {\n  #search-bar{\n    left: 20%;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #search-bar{\n    left: 6%;\n  }\n}\n\n@media screen and (max-width: 479px) {\n  #search-bar{\n    left: 5%;\n  }\n}\n\n@media screen and (max-width: 359px) {\n  #search-bar{\n    left: 4%;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 782:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, ".card{\n  padding-left: 50px;\n  padding-top: 10px;\n  max-width: 450px;\n}\n.h3{\n  padding-bottom: 1%;\n}\n.related{\n  padding: 3px 32px 3px 0;\n  display: inline-block;\n  width: 180px;\n  float: left;\n}\n\n.rellink{\n  color: #1a0dab;\n  text-decoration: none;\n  font-family: Arial, sans-serif;\n  font-size: 13px;\n}\n.rellink:hover{\n  text-decoration: underline;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 783:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "/** Basic results 'All' **/\n.result {\n  padding-left: 50px;\n  padding-top: 10px;\n}\n\n.row{\n  min-height: 84vh;\n}\n\n.title {\n  font-size: large;\n  text-decoration: none;\n  white-space: nowrap;\n  overflow: hidden !important;\n  text-overflow: ellipsis;\n}\n\n.link > p {\n  color: #006621;\n  text-decoration: none;\n  word-wrap: break-word;\n  font-size: 14px;\n  font-style: normal;\n  font-family: Arial, sans-serif;\n  text-overflow: ellipsis;\n  overflow: hidden !important;\n  white-space: nowrap;\n  line-height: 1.2;\n}\n\na {\n  text-decoration: none;\n}\n\n.description {\n  text-align: justify;\n  color: #808080;\n  line-height: 1.4;\n  word-wrap: break-word;\n  margin-top: -8px;\n}\n\n.feed {\n  width: 670px;\n}\n\n.title-pointer:hover {\n  text-decoration: underline;\n}\n\n.title-pointer {\n  text-overflow: ellipsis;\n  overflow: hidden !important;\n  white-space: nowrap;\n  color: #1a0dab;\n  font-family: Arial, sans-serif;\n}\n/** END **/\n/** Screen responsiveness for result feed **/\n@media screen and (max-width:571px) {\n  .feed {\n    max-width: 100%;\n  }\n}\n/** END **/\n\n.page-link {\n  cursor: pointer;\n}\n\n#progress-bar {\n  margin-top: 1%;\n  font-size: small;\n  color: #808080;\n  padding-left: 60px;\n  margin-left: 0.3%;\n}\n\n.text-result {\n  margin-left: 2%;\n}\n\n.container-fluid{\n  position: relative;\n}\n\n.container-fluid ul{\n  padding-top: 6px;\n}\n\n.container-fluid li{\n  height: 15px;\n  line-height: 15px;\n  padding-top: 28px;\n}\n\n.container-fluid li a{\n  position: relative;\n  left: -25px;\n}\n\n.dropdown-menu > li {\n  font-size: small;\n  padding: 3px;\n  text-align: center;\n  text-decoration: none;\n}\n\n.dropdown-menu > li:hover {\n  padding: 10px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #f5f5f5;\n}\n\n.dropdown-menu > li:active {\n  padding: 5px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #1c65ba;\n  color: white;\n}\n\n#tools{\n  left: 140px;\n  position: relative;\n}\n\n.active_page {\n  background-color: #bdcdd4;\n}\n\n.active_view {\n  color: #4285f4 !important;\n  font-weight: 900 !important;\n  border-bottom: 3px solid #4285f4;\n}\n\n/** Rendered image properties **/\n.container {\n  width: 100%;\n  margin: 0;\n  top: 0;\n  bottom: 0;\n  padding: 0;\n}\n\n.grid {\n  padding-left: 30px;\n  padding-right: 30px;\n}\n\n.responsive-image {\n  max-width: 100%;\n  height: 200px;\n  padding-top: 20px;\n  padding: 0.6%;\n  display: inline-block;\n  float: left;\n}\n\n.image-pointer {\n  cursor: pointer;\n}\n/** END **/\n\n#search-options-field {\n  background-color: #f8f8f8;\n  padding-bottom: 3px;\n}\n\n#search-options {\n  margin-top: 0.5%;\n  margin-left: 9%;\n}\n\n#search-tools {\n  margin-left: 11.5%;\n}\n\n#search-tools {\n  padding-left: 60px;\n}\n\n#search-tools .btn {\n  border: none;\n  background: none;\n  font-size: small;\n}\n\n#search-options li {\n  display: inline;\n  cursor: pointer;\n  padding: 28px 16px 12px;\n  color: #777;\n  font-weight: 500;\n  font-size: 13px;\n  line-height: 15px;\n  font-family: Arial, sans-serif;\n}\n\n#search-options li:hover {\n  color: #222;\n}\n\n#tools {\n  text-decoration: none;\n  color: #777;\n  margin-left: 15%;\n}\n\n#tools:hover {\n  color: #222;\n}\n\n.dropdown-menu {\n  left:100%;\n\n}\n\n#tool-dropdown li {\n  text-align: left;\n  display: block;\n  padding-top: 16px;\n  padding-bottom: 24px;\n}\n\n#pag-bar {\n  padding-left: 60px;\n  padding-top: 20px;\n}\n\n.pagination-property {\n  max-width: 100%;\n  padding-bottom: 30px;\n}\n\n.pagination li span\n {\n       background-color: white;\n       border: 0px ;\n       font-size: 16px;\n }\n\n .active_page{\n       color: black;\n }\n\n.clean {\n  clear: both;\n}\n\n@media screen and (min-width:1920px) {\n  #tools {\n    margin-left: 27%;\n  }\n}\n\n@media screen and (max-width:1365px) {\n  #tools {\n    margin-left: 16%;\n  }\n}\n\n@media screen and (max-width:1279px) {\n  #search-options {\n    margin-left: 11%;\n  }\n  #tools {\n    margin-left: 17%;\n  }\n}\n\n@media screen and (max-width:1105px) {\n  #tools {\n    margin-left: 18%;\n  }\n}\n\n@media screen and (max-width:991px) {\n  #tools {\n    margin-left: 20%;\n  }\n}\n\n@media screen and (max-width:979px) {\n  #search-options {\n    margin-left: 12.5%;\n  }\n}\n\n@media screen and (max-width:767px) {\n  .result {\n    padding-left: 46px;\n    padding-right: 30px;\n  }\n  #progress-bar {\n    padding-left: 46px;\n    margin-bottom: -10px;\n  }\n  #search-options {\n    padding-left: 0px;\n    margin-left: 8%;\n  }\n  #pag-bar {\n    padding-left: 50px;\n  }\n  #search-tools {\n    padding-left: 50px;\n  }\n  #search-options li {\n    padding: 0px 8.3% 12px;\n  }\n  #tools {\n    margin-left: -19%;\n  }\n}\n\n@media screen and (max-width:741px) {\n  #tools {\n    margin-left: -26%;\n  }\n}\n\n@media screen and (max-width:639px) {\n  #search-options li {\n    padding: 0px 7.5% 12px;\n  }\n}\n\n@media screen and (max-width:479px) {\n  .result {\n    padding-left: 30px;\n    padding-right: 20px;\n  }\n  #progress-bar {\n    padding-left: 30px;\n  }\n  #pag-bar {\n    padding-left: 30px;\n  }\n  #search-tools {\n    padding-left: 30px;\n  }\n  #search-options {\n    margin-left: 5.5%;\n  }\n  #search-options li {\n    padding: 0px 7% 12px;\n  }\n}\n\n@media screen and (max-width:379px) {\n  #search-options li {\n    padding: 0px 6.2% 12px;\n  }\n}\n\n@media screen and (max-width:408px) {\n  #tools {\n    left: 20%;\n  }\n}\n\n@media screen and (max-width:320px) {\n  #search-options li {\n    padding: 0px 5.6% 12px;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 784:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "#nav-group{\n  background-color: white;\n  width: 584px;\n  color: black;\n  height: 8px;\n  top: 3px;\n  border-radius: 0px;\n  border: none;\n  border-style: solid;\n  border-color:rgba(0, 0, 0, 0);\n  border-width: 1px;\n  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);\n}\n\n\n#nav-input{\n  font-size: 16px;\n  font-weight: 400;\n  top: 4px;\n  color: black;\n  width: 511px;\n  height: 34px !important;\n  line-height: 34px ;\n  border-radius: 0px;\n  border: none;\n  box-shadow: none;\n  padding-left: 16px;\n  font-family: Arial, sans-serif;\n  position: initial;\n  padding-bottom: 2px;\n}\n\n#nav-button{\n  border-radius: 0px;\n  height: 38px;\n  background-color: white;\n  color: #0066ff;\n  box-shadow: none;\n  border: none;\n  position: initial;\n}\n\n#nav-group{\n  top:3px;\n}\n\n.navbar-form{\n  border-color: transparent !important;\n}\n\n@media screen and (min-width:1920px) {\n  #nav-group{\n    top:6px;\n  }\n}\n\n@media screen and (max-width: 979px) and (min-width: 768px) {\n  .navbar-form{\n    padding-left: 4px;\n    width: 100px;\n   }\n}\n\n@media screen and (max-width: 992px) {\n  #nav-input{\n    width: 50vw;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #nav-input{\n    width: 80vw;\n  }\n  .align-search-btn{\n    left: -9%;\n  }\n}\n\n@media screen and (max-width: 480px) {\n  .align-search-btn{\n    left: -6%;\n  }\n}\n\n@media screen and (max-width: 360px) {\n  .align-search-btn{\n    left: -5%;\n  }\n}\n\n@media screen and (min-width: 1920px) {\n  #nav-group {\n    left: 65%;\n  }\n}\n\n@media screen and (max-width: 968px) {\n  #nav-group {\n    left: -12%;\n  }\n  #nav-input {\n    width: 50vw;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #nav-group {\n    left: -22%;\n    width: 20px;\n  }\n  #nav-input {\n    width: 80vw;\n  }\n}\n\n@media screen and (max-width: 503px) {\n  #nav-group {\n    width: 5px;\n  }\n  #nav-input {\n    width: 80vw;\n  }\n}\n\n@media screen and (max-width: 359px) {\n  #nav-input {\n    width: 80vw;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 785:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(23)(false);
// imports


// module
exports.push([module.i, "@media screen and (max-width:990px) {\n\t.navbar-collapse.navbar-right {\n\t\ttext-align: right;\n\t}\n}\n\n.bold{\n\tfont-weight: 700;\n}\n\n.navbar-nav > li > a{\n  text-align: left;\n}\n\n.navbar-right{\n  border-top:none;\n}\n.nav-terms {\n\tpadding: 0px;\n    clear: both;\n    margin: -57px 0 0 0\n}\n\n.navbar-brand>img {\n\tmargin:-5px 0 0 0;\n}\n.navbar-logo {\n    height: 30px;\n    padding-left: 20px;\n}\n\n.about-navbar{\n\n}\n.navbar-text {\n    padding-right: 30px;\n    font-size: 20px;\n\tposition: relative;\n\ttop:-3px;\n}\n\n.text-center{\n\ttext-align: center;\n}\n\n.link{\n\tmargin-top:2px;\n\tfont-weight: 700;\n\tline-height: 1.1;\n\tcolor:#1565C0;\n\ttext-decoration: none !important;\n\n}\n.link:hover{\n\ttext-decoration: underline;\n}\n\n#left{\n\twidth:22.6993866%;\n}\n\n#right{\n\twidth:67.7%;\n}\np{\n\tline-height: 20px;\n    text-align: justify;\n}\nh2{\n\tline-height: 1.8;\n}\n\n@media only screen and (max-width: 768px) {\n\t#left{\n\t\t\twidth: 100%;\n\t}\n\n\t#right{\n\t\t\twidth: 100%;\n\t}\n  .navbar-brand{\n    margin-left: -77px;\n  }\n}\n@media only screen and (max-width: 923px)and (min-width: 768px) {\n  .navbar-brand{\n    margin-left: -27%!important;\n  }\n}\n\na {\n\ttext-decoration: none;\n\tpadding-right: 30px;\n\tcolor: rgb(119,119,119);\n}\n\n.navbar-collapse.navbar-right {\n\tpadding-top: 15px;\n}\n\na:hover {\n\tcolor: rgb(51,51,51);\n\ttext-decoration: none;\n}\n\n.navbar-brand {\n\tpadding-left: 100px;\n}\n\n\n\n\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 789:
/***/ (function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear-->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n<link href=\"https://fonts.googleapis.com/css?family=Quicksand\" rel=\"stylesheet\">\n<!-- Stop ignoring BootLintBear-->\n<nav class=\"navbar navbar-default nav-about\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <button type = \"button\" class = \"navbar-toggle\"\n              data-toggle = \"collapse\" data-target = \"#dropmenu\">\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand about-navbar\" href=\"//susper.com\">\n        <img alt=\"brand\" class=\"navbar-logo\" src=\"../../assets/images/susper.svg\">\n      </a>\n    </div>\n    <div class=\"collapse navbar-collapse\" id=\"dropmenu\">\n      <ul class=\"nav navbar-nav navbar-collapse navbar-right\">\n        <li><a routerLink=\"/terms\">Terms</a></li>\n        <li><a routerLink=\"/about\">About</a></li>\n        <li><a routerLink=\"/contact\">Contact</a></li>\n      </ul>\n    </div>\n  </div>\n</nav>\n\n<div class=\"image-banner\">\n    <img src=\"../../assets/images/mountain.jpg\" class=\"img-responsive banner\">\n</div>\n<div class=\"container\">\n    <br>\n    <h2 class=\"text-center\">Susper is a decentral Search Engine that uses the peer to peer system 'YaCy' and 'Apache Solr' to crawl and index search\n        results.\n    </h2>\n    <br>\n    <div class=\"about-sub-details\">\n        <div class=\"row\">\n            <h2 class=\"bold\">About Us</h2>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">About YaCy</h5>\n                <p>YaCy is a free search engine that anyone can use to build a search portal for their intranet or to help search\n                    the public internet. Read more about YaCy here - <a href=\"https://yacy.net/en/index.html\" target=\"_blank\">YaCy Decentralized Web Search</a></p>\n            </div>\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">Communication</h5>\n                <p>Facing issues while setting up project on local environment? Our chat channel is on gitter here: <a href=\"https://gitter.im/fossasia/susper.com\"\n                        target=\"_blank\">fossasia/susper.com</a> We'll be happy to help you out!'</p>\n            </div>\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">Contribute to our project</h5>\n                <p>Get involved as an Open Source developer, designer or tester and start your adventure today! Solve an issue\n                    or feature request on our repositories with <a href=\"https://github.com/fossasia/susper.com\" target=\"_blank\">FOSSASIA</a>Build\n                    up your developer profile and become part of a fantastic community.</p>\n            </div>\n        </div>\n        <!--About Us details ends-->\n    </div>\n    <!--about-sub-details ends here-->\n\n    <div class=\"contact-sub-details\">\n        <div class=\"row\">\n            <h2 class=\"bold\">Contact Us</h2>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-lg-12 col-sm-12 contact-sub-details\">\n                <p>If you would like to get in touch with us, you find our details on the <a href=\"contact\">contact page.</a></p>\n            </div>\n\n        </div>\n    </div>\n    <!--contact-sub-details ends here-->\n\n    <br>\n</div>\n<footer>\n    <!--footer navigation bar goes here-->\n    <app-footer-navbar></app-footer-navbar>\n</footer>\n"

/***/ }),

/***/ 790:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-dialog\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <!-- Start ignoring HTMLLintBear -->\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <!-- Stop ignoring HTMLLintBear -->\n      <h4 class=\"modal-title\" id=\"my-modal-label\">Advanced Search</h4>\n    </div>\n    <div class=\"modal-body\">\n      <div >\n        <ul class=\"nav nav-sidebar menugroup\">\n          <li style=\"cursor:pointer;cursor: hand;\" data-toggle=\"collapse\" >\n            <h3>selected</h3></li>\n          <li style=\"display: block\" *ngFor=\"let element of selectedelements\">\n            <a (click)=\"removeurl(element.modifier)\" class=\"menu-item-link\">\n              <input type=\"checkbox\" checked>{{element.name}}  {{element.count}}\n            </a>\n          </li>\n\n        </ul>\n      </div>\n\n      <div id=\"filtersearch\" *ngFor=\"let nav of navigation$|async\">\n        <ul class=\"nav nav-sidebar menugroup\">\n          <li style=\"cursor:pointer;cursor: hand;\" data-toggle=\"collapse\" [attr.data-target]=\"'#'+nav.facetname\">\n              <h3>{{nav.displayname}}</h3></li>\n          <li style=\"display: block\" *ngFor=\"let element of nav.elements\">\n            <a (click)=\"changeurl(element.modifier,element)\" class=\"menu-item-link\">\n              <input type=\"checkbox\">{{element.name}}  {{element.count}}\n            </a>\n          </li>\n\n        </ul>\n      </div>\n\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Search</button>\n    </div>\n  </div>\n</div>\n\n\n<div id=\"sidebar\" class=\"col-md-3\">\n</div>\n"

/***/ }),

/***/ 791:
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ }),

/***/ 792:
/***/ (function(module, exports) {

module.exports = "<div class=\"suggestion-box\">\n<div *ngFor=\"let result of results\">\n  <a [routerLink]=\"resultsearch\" [queryParams]=\"{query: result.label}\">{{result.label}}</a>\n</div>\n</div>\n"

/***/ }),

/***/ 793:
/***/ (function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear-->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n<link href=\"https://fonts.googleapis.com/css?family=Quicksand\" rel=\"stylesheet\">\n<!-- Stop ignoring BootLintBear-->\n<nav class=\"navbar navbar-default nav-about\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <button type = \"button\" class = \"navbar-toggle\"\n              data-toggle = \"collapse\" data-target = \"#dropmenu\">\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand contact-navbar\" href=\"//susper.com\">\n        <img alt=\"brand\" class=\"navbar-logo\" src=\"../../assets/images/susper.svg\">\n      </a>\n    </div>\n    <div class=\"collapse navbar-collapse\" id=\"dropmenu\">\n      <ul class=\"nav navbar-nav navbar-collapse navbar-right\">\n        <li><a routerLink=\"/terms\">Terms</a></li>\n        <li><a routerLink=\"/about\">About</a></li>\n        <li><a routerLink=\"/contact\">Contact</a></li>\n      </ul>\n    </div>\n  </div>\n</nav>\n\n<div class=\"image-banner\">\n  <img src=\"../../assets/images/boat.png\" class=\"img-responsive banner\">\n</div>\n\n<div class=\"container\">\n  <br>\n  <div class=\"about-sub-details\">\n    <div class=\"row contact-title\">\n      <h2 class=\"bold\">Contact Us</h2>\n      <br>\n    </div>\n    <br>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 sub-details\">\n        <h5 class=\"bold\">Susper</h5>\n        <p>93 Mau Than Street<br> Can Tho<br> Viet Nam<br> Phone +84 (0) 907 65 29 27<br> Email: support@susper.net<br> Board\n          of Directors: Phuc Hau Dang<br> Susper Ltd. is registered in Can Tho, Viet Nam.</p>\n      </div>\n    </div>\n    <!--Contact Us details ends-->\n  </div>\n  <!--Contact-sub-details ends here-->\n\n  <br>\n\n  <div class=\"contact-sub-details\">\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 contact-sub-details\">\n        <p>Report a safety or abuse issue affecting our products.<br> If you know of a safety or abuse problem with any of Susper's\n          services, we'd like to hear about it right away. Please use our <a [routerLink]=\"['/contact']\" (click)=\"open()\">contact</a> form to report the\n          issue.\n        </p>\n      </div>\n\n    </div>\n  </div>\n  <!--contact-sub-details ends here-->\n\n</div>\n<!--container ends here-->\n<footer>\n  <!--footer navigation bar goes here-->\n  <app-footer-navbar></app-footer-navbar>\n</footer>\n\n<modal #myModal>\n  <div>\n    <a (click)=\"close()\" class=\"close-btn\"> <i class=\"fa fa-times\" aria-hidden=\"true\" style=\"font-size: 2em\"></i> </a>\n\n\n  </div>\n  <form class=\"form-horizontal\" method=\"POST\" action=\"http://formspree.io/office@fossasia.org\">\n  <fieldset>\n\n  <!-- Form Name -->\n  <legend>Contact Form</legend>\n\n  <!-- Text input-->\n  <div class=\"form-group\">\n    <label class=\"col-md-3 control-label\" for=\"textinput\">Your Name<sup>*</sup></label>\n    <div class=\"col-md-9\">\n    <input id=\"textinput\" name=\"yourName\" type=\"text\" placeholder=\"Your Name\" class=\"form-control input-md\" required=\"\" >\n\n    </div>\n  </div>\n\n  <!-- Text input-->\n  <div class=\"form-group\">\n    <label class=\"col-md-3 control-label\"a for=\"emailinput\">Email<sup>*</sup></label>\n    <div class=\"col-md-9\">\n    <input id=\"emailinput\" name=\"email-address\" type=\"email\" placeholder=\"Email Address\" class=\"form-control input-md\" required=\"\"  >\n\n    </div>\n  </div>\n\n  <!-- Select Basic -->\n  <div class=\"form-group row\">\n    <label class=\"col-md-3 control-label\" for=\"countrycode\">Mobile Number<sup>*</sup></label>\n    <div class=\"col-md-9\">\n\n    <select id=\"countrycode\" name=\"countrycode\" class=\"form-control\">\n              <option data-countryCode=\"DZ\" value=\"213\">Algeria (+213)</option>\n              <option data-countryCode=\"AD\" value=\"376\">Andorra (+376)</option>\n              <option data-countryCode=\"AO\" value=\"244\">Angola (+244)</option>\n              <option data-countryCode=\"AI\" value=\"1264\">Anguilla (+1264)</option>\n              <option data-countryCode=\"AG\" value=\"1268\">Antigua &amp; Barbuda (+1268)</option>\n              <option data-countryCode=\"AR\" value=\"54\">Argentina (+54)</option>\n              <option data-countryCode=\"AM\" value=\"374\">Armenia (+374)</option>\n              <option data-countryCode=\"AW\" value=\"297\">Aruba (+297)</option>\n              <option data-countryCode=\"AU\" value=\"61\">Australia (+61)</option>\n              <option data-countryCode=\"AT\" value=\"43\">Austria (+43)</option>\n              <option data-countryCode=\"AZ\" value=\"994\">Azerbaijan (+994)</option>\n              <option data-countryCode=\"BS\" value=\"1242\">Bahamas (+1242)</option>\n              <option data-countryCode=\"BH\" value=\"973\">Bahrain (+973)</option>\n              <option data-countryCode=\"BD\" value=\"880\">Bangladesh (+880)</option>\n              <option data-countryCode=\"BB\" value=\"1246\">Barbados (+1246)</option>\n              <option data-countryCode=\"BY\" value=\"375\">Belarus (+375)</option>\n              <option data-countryCode=\"BE\" value=\"32\">Belgium (+32)</option>\n              <option data-countryCode=\"BZ\" value=\"501\">Belize (+501)</option>\n              <option data-countryCode=\"BJ\" value=\"229\">Benin (+229)</option>\n              <option data-countryCode=\"BM\" value=\"1441\">Bermuda (+1441)</option>\n              <option data-countryCode=\"BT\" value=\"975\">Bhutan (+975)</option>\n              <option data-countryCode=\"BO\" value=\"591\">Bolivia (+591)</option>\n              <option data-countryCode=\"BA\" value=\"387\">Bosnia Herzegovina (+387)</option>\n              <option data-countryCode=\"BW\" value=\"267\">Botswana (+267)</option>\n              <option data-countryCode=\"BR\" value=\"55\">Brazil (+55)</option>\n              <option data-countryCode=\"BN\" value=\"673\">Brunei (+673)</option>\n              <option data-countryCode=\"BG\" value=\"359\">Bulgaria (+359)</option>\n              <option data-countryCode=\"BF\" value=\"226\">Burkina Faso (+226)</option>\n              <option data-countryCode=\"BI\" value=\"257\">Burundi (+257)</option>\n              <option data-countryCode=\"KH\" value=\"855\">Cambodia (+855)</option>\n              <option data-countryCode=\"CM\" value=\"237\">Cameroon (+237)</option>\n              <option data-countryCode=\"CA\" value=\"1\">Canada (+1)</option>\n              <option data-countryCode=\"CV\" value=\"238\">Cape Verde Islands (+238)</option>\n              <option data-countryCode=\"KY\" value=\"1345\">Cayman Islands (+1345)</option>\n              <option data-countryCode=\"CF\" value=\"236\">Central African Republic (+236)</option>\n              <option data-countryCode=\"CL\" value=\"56\">Chile (+56)</option>\n              <option data-countryCode=\"CN\" value=\"86\">China (+86)</option>\n              <option data-countryCode=\"CO\" value=\"57\">Colombia (+57)</option>\n              <option data-countryCode=\"KM\" value=\"269\">Comoros (+269)</option>\n              <option data-countryCode=\"CG\" value=\"242\">Congo (+242)</option>\n              <option data-countryCode=\"CK\" value=\"682\">Cook Islands (+682)</option>\n              <option data-countryCode=\"CR\" value=\"506\">Costa Rica (+506)</option>\n              <option data-countryCode=\"HR\" value=\"385\">Croatia (+385)</option>\n              <option data-countryCode=\"CU\" value=\"53\">Cuba (+53)</option>\n              <option data-countryCode=\"CY\" value=\"90392\">Cyprus North (+90392)</option>\n              <option data-countryCode=\"CY\" value=\"357\">Cyprus South (+357)</option>\n              <option data-countryCode=\"CZ\" value=\"42\">Czech Republic (+42)</option>\n              <option data-countryCode=\"DK\" value=\"45\">Denmark (+45)</option>\n              <option data-countryCode=\"DJ\" value=\"253\">Djibouti (+253)</option>\n              <option data-countryCode=\"DM\" value=\"1809\">Dominica (+1809)</option>\n              <option data-countryCode=\"DO\" value=\"1809\">Dominican Republic (+1809)</option>\n              <option data-countryCode=\"EC\" value=\"593\">Ecuador (+593)</option>\n              <option data-countryCode=\"EG\" value=\"20\">Egypt (+20)</option>\n              <option data-countryCode=\"SV\" value=\"503\">El Salvador (+503)</option>\n              <option data-countryCode=\"GQ\" value=\"240\">Equatorial Guinea (+240)</option>\n              <option data-countryCode=\"ER\" value=\"291\">Eritrea (+291)</option>\n              <option data-countryCode=\"EE\" value=\"372\">Estonia (+372)</option>\n              <option data-countryCode=\"ET\" value=\"251\">Ethiopia (+251)</option>\n              <option data-countryCode=\"FK\" value=\"500\">Falkland Islands (+500)</option>\n              <option data-countryCode=\"FO\" value=\"298\">Faroe Islands (+298)</option>\n              <option data-countryCode=\"FJ\" value=\"679\">Fiji (+679)</option>\n              <option data-countryCode=\"FI\" value=\"358\">Finland (+358)</option>\n              <option data-countryCode=\"FR\" value=\"33\">France (+33)</option>\n              <option data-countryCode=\"GF\" value=\"594\">French Guiana (+594)</option>\n              <option data-countryCode=\"PF\" value=\"689\">French Polynesia (+689)</option>\n              <option data-countryCode=\"GA\" value=\"241\">Gabon (+241)</option>\n              <option data-countryCode=\"GM\" value=\"220\">Gambia (+220)</option>\n              <option data-countryCode=\"GE\" value=\"7880\">Georgia (+7880)</option>\n              <option data-countryCode=\"DE\" value=\"49\">Germany (+49)</option>\n              <option data-countryCode=\"GH\" value=\"233\">Ghana (+233)</option>\n              <option data-countryCode=\"GI\" value=\"350\">Gibraltar (+350)</option>\n              <option data-countryCode=\"GR\" value=\"30\">Greece (+30)</option>\n              <option data-countryCode=\"GL\" value=\"299\">Greenland (+299)</option>\n              <option data-countryCode=\"GD\" value=\"1473\">Grenada (+1473)</option>\n              <option data-countryCode=\"GP\" value=\"590\">Guadeloupe (+590)</option>\n              <option data-countryCode=\"GU\" value=\"671\">Guam (+671)</option>\n              <option data-countryCode=\"GT\" value=\"502\">Guatemala (+502)</option>\n              <option data-countryCode=\"GN\" value=\"224\">Guinea (+224)</option>\n              <option data-countryCode=\"GW\" value=\"245\">Guinea - Bissau (+245)</option>\n              <option data-countryCode=\"GY\" value=\"592\">Guyana (+592)</option>\n              <option data-countryCode=\"HT\" value=\"509\">Haiti (+509)</option>\n              <option data-countryCode=\"HN\" value=\"504\">Honduras (+504)</option>\n              <option data-countryCode=\"HK\" value=\"852\">Hong Kong (+852)</option>\n              <option data-countryCode=\"HU\" value=\"36\">Hungary (+36)</option>\n              <option data-countryCode=\"IS\" value=\"354\">Iceland (+354)</option>\n              <option data-countryCode=\"IN\" value=\"91\">India (+91)</option>\n              <option data-countryCode=\"ID\" value=\"62\">Indonesia (+62)</option>\n              <option data-countryCode=\"IR\" value=\"98\">Iran (+98)</option>\n              <option data-countryCode=\"IQ\" value=\"964\">Iraq (+964)</option>\n              <option data-countryCode=\"IE\" value=\"353\">Ireland (+353)</option>\n              <option data-countryCode=\"IL\" value=\"972\">Israel (+972)</option>\n              <option data-countryCode=\"IT\" value=\"39\">Italy (+39)</option>\n              <option data-countryCode=\"JM\" value=\"1876\">Jamaica (+1876)</option>\n              <option data-countryCode=\"JP\" value=\"81\">Japan (+81)</option>\n              <option data-countryCode=\"JO\" value=\"962\">Jordan (+962)</option>\n              <option data-countryCode=\"KZ\" value=\"7\">Kazakhstan (+7)</option>\n              <option data-countryCode=\"KE\" value=\"254\">Kenya (+254)</option>\n              <option data-countryCode=\"KI\" value=\"686\">Kiribati (+686)</option>\n              <option data-countryCode=\"KP\" value=\"850\">Korea North (+850)</option>\n              <option data-countryCode=\"KR\" value=\"82\">Korea South (+82)</option>\n              <option data-countryCode=\"KW\" value=\"965\">Kuwait (+965)</option>\n              <option data-countryCode=\"KG\" value=\"996\">Kyrgyzstan (+996)</option>\n              <option data-countryCode=\"LA\" value=\"856\">Laos (+856)</option>\n              <option data-countryCode=\"LV\" value=\"371\">Latvia (+371)</option>\n              <option data-countryCode=\"LB\" value=\"961\">Lebanon (+961)</option>\n              <option data-countryCode=\"LS\" value=\"266\">Lesotho (+266)</option>\n              <option data-countryCode=\"LR\" value=\"231\">Liberia (+231)</option>\n              <option data-countryCode=\"LY\" value=\"218\">Libya (+218)</option>\n              <option data-countryCode=\"LI\" value=\"417\">Liechtenstein (+417)</option>\n              <option data-countryCode=\"LT\" value=\"370\">Lithuania (+370)</option>\n              <option data-countryCode=\"LU\" value=\"352\">Luxembourg (+352)</option>\n              <option data-countryCode=\"MO\" value=\"853\">Macao (+853)</option>\n              <option data-countryCode=\"MK\" value=\"389\">Macedonia (+389)</option>\n              <option data-countryCode=\"MG\" value=\"261\">Madagascar (+261)</option>\n              <option data-countryCode=\"MW\" value=\"265\">Malawi (+265)</option>\n              <option data-countryCode=\"MY\" value=\"60\">Malaysia (+60)</option>\n              <option data-countryCode=\"MV\" value=\"960\">Maldives (+960)</option>\n              <option data-countryCode=\"ML\" value=\"223\">Mali (+223)</option>\n              <option data-countryCode=\"MT\" value=\"356\">Malta (+356)</option>\n              <option data-countryCode=\"MH\" value=\"692\">Marshall Islands (+692)</option>\n              <option data-countryCode=\"MQ\" value=\"596\">Martinique (+596)</option>\n              <option data-countryCode=\"MR\" value=\"222\">Mauritania (+222)</option>\n              <option data-countryCode=\"YT\" value=\"269\">Mayotte (+269)</option>\n              <option data-countryCode=\"MX\" value=\"52\">Mexico (+52)</option>\n              <option data-countryCode=\"FM\" value=\"691\">Micronesia (+691)</option>\n              <option data-countryCode=\"MD\" value=\"373\">Moldova (+373)</option>\n              <option data-countryCode=\"MC\" value=\"377\">Monaco (+377)</option>\n              <option data-countryCode=\"MN\" value=\"976\">Mongolia (+976)</option>\n              <option data-countryCode=\"MS\" value=\"1664\">Montserrat (+1664)</option>\n              <option data-countryCode=\"MA\" value=\"212\">Morocco (+212)</option>\n              <option data-countryCode=\"MZ\" value=\"258\">Mozambique (+258)</option>\n              <option data-countryCode=\"MN\" value=\"95\">Myanmar (+95)</option>\n              <option data-countryCode=\"NA\" value=\"264\">Namibia (+264)</option>\n              <option data-countryCode=\"NR\" value=\"674\">Nauru (+674)</option>\n              <option data-countryCode=\"NP\" value=\"977\">Nepal (+977)</option>\n              <option data-countryCode=\"NL\" value=\"31\">Netherlands (+31)</option>\n              <option data-countryCode=\"NC\" value=\"687\">New Caledonia (+687)</option>\n              <option data-countryCode=\"NZ\" value=\"64\">New Zealand (+64)</option>\n              <option data-countryCode=\"NI\" value=\"505\">Nicaragua (+505)</option>\n              <option data-countryCode=\"NE\" value=\"227\">Niger (+227)</option>\n              <option data-countryCode=\"NG\" value=\"234\">Nigeria (+234)</option>\n              <option data-countryCode=\"NU\" value=\"683\">Niue (+683)</option>\n              <option data-countryCode=\"NF\" value=\"672\">Norfolk Islands (+672)</option>\n              <option data-countryCode=\"NP\" value=\"670\">Northern Marianas (+670)</option>\n              <option data-countryCode=\"NO\" value=\"47\">Norway (+47)</option>\n              <option data-countryCode=\"OM\" value=\"968\">Oman (+968)</option>\n              <option data-countryCode=\"PW\" value=\"680\">Palau (+680)</option>\n              <option data-countryCode=\"PA\" value=\"507\">Panama (+507)</option>\n              <option data-countryCode=\"PG\" value=\"675\">Papua New Guinea (+675)</option>\n              <option data-countryCode=\"PY\" value=\"595\">Paraguay (+595)</option>\n              <option data-countryCode=\"PE\" value=\"51\">Peru (+51)</option>\n              <option data-countryCode=\"PH\" value=\"63\">Philippines (+63)</option>\n              <option data-countryCode=\"PL\" value=\"48\">Poland (+48)</option>\n              <option data-countryCode=\"PT\" value=\"351\">Portugal (+351)</option>\n              <option data-countryCode=\"PR\" value=\"1787\">Puerto Rico (+1787)</option>\n              <option data-countryCode=\"QA\" value=\"974\">Qatar (+974)</option>\n              <option data-countryCode=\"RE\" value=\"262\">Reunion (+262)</option>\n              <option data-countryCode=\"RO\" value=\"40\">Romania (+40)</option>\n              <option data-countryCode=\"RU\" value=\"7\">Russia (+7)</option>\n              <option data-countryCode=\"RW\" value=\"250\">Rwanda (+250)</option>\n              <option data-countryCode=\"SM\" value=\"378\">San Marino (+378)</option>\n              <option data-countryCode=\"ST\" value=\"239\">Sao Tome &amp; Principe (+239)</option>\n              <option data-countryCode=\"SA\" value=\"966\">Saudi Arabia (+966)</option>\n              <option data-countryCode=\"SN\" value=\"221\">Senegal (+221)</option>\n              <option data-countryCode=\"CS\" value=\"381\">Serbia (+381)</option>\n              <option data-countryCode=\"SC\" value=\"248\">Seychelles (+248)</option>\n              <option data-countryCode=\"SL\" value=\"232\">Sierra Leone (+232)</option>\n              <option data-countryCode=\"SG\" value=\"65\">Singapore (+65)</option>\n              <option data-countryCode=\"SK\" value=\"421\">Slovak Republic (+421)</option>\n              <option data-countryCode=\"SI\" value=\"386\">Slovenia (+386)</option>\n              <option data-countryCode=\"SB\" value=\"677\">Solomon Islands (+677)</option>\n              <option data-countryCode=\"SO\" value=\"252\">Somalia (+252)</option>\n              <option data-countryCode=\"ZA\" value=\"27\">South Africa (+27)</option>\n              <option data-countryCode=\"ES\" value=\"34\">Spain (+34)</option>\n              <option data-countryCode=\"LK\" value=\"94\">Sri Lanka (+94)</option>\n              <option data-countryCode=\"SH\" value=\"290\">St. Helena (+290)</option>\n              <option data-countryCode=\"KN\" value=\"1869\">St. Kitts (+1869)</option>\n              <option data-countryCode=\"SC\" value=\"1758\">St. Lucia (+1758)</option>\n              <option data-countryCode=\"SD\" value=\"249\">Sudan (+249)</option>\n              <option data-countryCode=\"SR\" value=\"597\">Suriname (+597)</option>\n              <option data-countryCode=\"SZ\" value=\"268\">Swaziland (+268)</option>\n              <option data-countryCode=\"SE\" value=\"46\">Sweden (+46)</option>\n              <option data-countryCode=\"CH\" value=\"41\">Switzerland (+41)</option>\n              <option data-countryCode=\"SI\" value=\"963\">Syria (+963)</option>\n              <option data-countryCode=\"TW\" value=\"886\">Taiwan (+886)</option>\n              <option data-countryCode=\"TJ\" value=\"7\">Tajikstan (+7)</option>\n              <option data-countryCode=\"TH\" value=\"66\">Thailand (+66)</option>\n              <option data-countryCode=\"TG\" value=\"228\">Togo (+228)</option>\n              <option data-countryCode=\"TO\" value=\"676\">Tonga (+676)</option>\n              <option data-countryCode=\"TT\" value=\"1868\">Trinidad &amp; Tobago (+1868)</option>\n              <option data-countryCode=\"TN\" value=\"216\">Tunisia (+216)</option>\n              <option data-countryCode=\"TR\" value=\"90\">Turkey (+90)</option>\n              <option data-countryCode=\"TM\" value=\"7\">Turkmenistan (+7)</option>\n              <option data-countryCode=\"TM\" value=\"993\">Turkmenistan (+993)</option>\n              <option data-countryCode=\"TC\" value=\"1649\">Turks &amp; Caicos Islands (+1649)</option>\n              <option data-countryCode=\"TV\" value=\"688\">Tuvalu (+688)</option>\n              <option data-countryCode=\"UG\" value=\"256\">Uganda (+256)</option>\n              <option data-countryCode=\"GB\" value=\"44\">UK (+44)</option>\n              <option data-countryCode=\"UA\" value=\"380\">Ukraine (+380)</option>\n              <option data-countryCode=\"AE\" value=\"971\">United Arab Emirates (+971)</option>\n              <option data-countryCode=\"UY\" value=\"598\">Uruguay (+598)</option>\n              <option data-countryCode=\"US\" value=\"1\">USA (+1)</option>\n              <option data-countryCode=\"UZ\" value=\"7\">Uzbekistan (+7)</option>\n              <option data-countryCode=\"VU\" value=\"678\">Vanuatu (+678)</option>\n              <option data-countryCode=\"VA\" value=\"379\">Vatican City (+379)</option>\n              <option data-countryCode=\"VE\" value=\"58\">Venezuela (+58)</option>\n              <option data-countryCode=\"VN\" value=\"84\">Vietnam (+84)</option>\n              <option data-countryCode=\"VG\" value=\"84\">Virgin Islands - British (+1284)</option>\n              <option data-countryCode=\"VI\" value=\"84\">Virgin Islands - US (+1340)</option>\n              <option data-countryCode=\"WF\" value=\"681\">Wallis &amp; Futuna (+681)</option>\n              <option data-countryCode=\"YE\" value=\"969\">Yemen (North)(+969)</option>\n              <option data-countryCode=\"YE\" value=\"967\">Yemen (South)(+967)</option>\n              <option data-countryCode=\"ZM\" value=\"260\">Zambia (+260)</option>\n              <option data-countryCode=\"ZW\" value=\"263\">Zimbabwe (+263)</option>\n\n      </select>\n\n    <input id=\"telephone\" name=\"telephone\" type=\"number\" placeholder=\"Mobile Number\"(ngModelChange)=\"checkValidity()\" [(ngModel)]=\"tpnoInput\" class=\"form-control input-md\" required=\"\">\n\n    </div>\n  </div>\n\n  <!-- Textarea -->\n  <div class=\"form-group\">\n    <label class=\"col-md-3 control-label\" for=\"message\">Message<sup>*</sup></label>\n    <div class=\"col-md-9\">\n      <textarea class=\"form-control\" id=\"message\" name=\"message\" placeholder=\"Minimum 100 words\" required=\"\" (ngModelChange)=\"checkValidity()\" [(ngModel)]=\"contactMessage\"></textarea>\n    </div>\n  </div>\n\n  <!-- Button -->\n  <div class=\"form-group\">\n    <label class=\"col-md-12 control-label\" for=\"submit\"></label>\n    <div class=\"col-md-12\">\n      <button id=\"submit\" name=\"submit\" class=\"btn btn-info sub-btn\" type=\"submit\" #submitButton disabled>Submit</button>\n    </div>\n  </div>\n\n  </fieldset>\n  </form>\n\n</modal>\n"

/***/ }),

/***/ 794:
/***/ (function(module, exports) {

module.exports = "<footer>\n    <div class=\"footer-bar\">\n        <div class=\"left-side\">\n            <a routerLink=\"/about\" routerLinkActive=\"active\">About</a>\n            <a href=\"//blog.fossasia.org\">Blogs</a>\n            <a href=\"//github.com/fossasia/susper.com\">Code</a>\n        </div>\n        <div class=\"right-side\">\n          <a routerLink=\"/advancedsearch\" routerLinkActive=\"active\">Advanced Search</a>\n            <a routerLink=\"/terms\" routerLinkActive=\"active\">Terms</a>\n            <a routerLink=\"/contact\" routerLinkActive=\"active\">Contact</a>\n        </div>\n    </div>\n</footer>\n"

/***/ }),

/***/ 795:
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n    <div class=\"starter-template\">\n        <h2 class=\"yacy\">\n            <img src=\"assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></h2>\n        <h2 class=\"yacy\" id=\"greeting\"></h2>\n        <div id=\"set-susper-default\">\n            <h3>Set Susper as your default search engine on Mozilla!</h3>\n            <ol>\n                <!-- Start ignoring BootLintBear -->\n                <li><button id=\"install-susper\">Install susper</button></li>\n                <li>Mark the checkbox to set Susper as your default search engine</li>\n                <li>Start searching!</li>\n            </ol>\n            <button id=\"cancel-installation\">Cancel</button>\n        </div>\n        <!-- Stop ignoring BootLintBear -->\n        <div id=\"search-bar\">\n            <app-search-bar></app-search-bar>\n        </div>\n\n    </div>\n    <!--starter-template ends here-->\n</div>\n<!--ontainer-fluid ends here-->\n\n<div class=\"footer-fixed\">\n\n    <!--footer navigation bar goes here-->\n    <app-footer-navbar></app-footer-navbar>\n</div>\n\n"

/***/ }),

/***/ 796:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"results?.length > 0\" class=\"card\">\n<div>\n  <h2><b>{{this.results[0].label}}</b></h2>\n  <p>{{this.results[0].description}}</p>\n</div>\n<div class=\"card-container\">\n  <h3><b>Related Searches</b></h3>\n\n  <div *ngFor=\"let result of results\">\n    <a [routerLink]=\"resultsearch\" [queryParams]=\"{query: result.label}\">{{result.label}}</a>\n  </div>\n  </div>\n</div>\n\n"

/***/ }),

/***/ 797:
/***/ (function(module, exports) {

module.exports = "<nav class=\"top-nav navbar navbar-static-top navbar-default\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\" id=\"navcontainer\">\n            <ul>\n                <li>\n                    <a href=\"/\">\n                        <img class=\"navbar-brand\" src=\"assets/images/susper.svg\">\n                    </a>\n                </li>\n                <li id=\"navbar-search\">\n                    <app-search-bar></app-search-bar>\n                </li>\n            </ul>\n        </div>\n\n        <div class=\"navbar-collapse collapse\" style=\"display:none\" id=\"side-menu\">\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li class=\"dropdown\">\n                    <a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\" data-proofer-ignore><i class=\"fa fa-bars\" aria-hidden=\"true\" style=\"font-size: 2em\"></i></a>\n                    <ul class=\"dropdown-menu\">\n                        <li>\n                            <div class=\"header\" id=\"header-download\">\n                                <a href=\"//blog.fossasia.org\" target=\"_blank\">\n                                    <i class=\"fa fa-newspaper-o\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"blog-icon\"></i>\n                                    <p class=\"header-text\">Blog</p>\n                                </a>\n                            </div>\n                            <div class=\"header\" id=\"header-code\">\n                                <a href=\"//github.com/fossasia/susper.com\" target=\"_blank\">\n                                    <i class=\"fa fa-code\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"code-icon\"></i>\n                                    <p class=\"header-text\">Code</p>\n                                </a>\n                            </div>\n                        </li>\n                        <li>\n                            <div class=\"header\" id=\"header-git\">\n                                <a href=\"//github.com/fossasia/susper.com\" target=\"_blank\">\n                                    <i class=\"fa fa-github\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"github-icon\"></i>\n                                </a>\n                                <p class=\"header-text\">Github</p>\n                            </div>\n                            <div class=\"header\" id=\"header-bugs\">\n                                <a href=\"//github.com/fossasia/susper.com/issues\" target=\"_blank\">\n                                    <i class=\"fa fa-bug\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"bug-icon\"></i>\n                                </a>\n                                <p class=\"header-text\">Bug Reports</p>\n                            </div>\n                        </li>\n                      <li>\n                          <div class=\"header\" id=\"header-contact\">\n                            <a routerLink=\"/contact\" routerLinkActive=\"active\">\n                              <i class=\"fa fa-phone\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"contact-icon\"></i>\n                            </a>\n                            <p class=\"header-text\">Contact</p>\n                          </div>\n                          <div class=\"header\" id=\"header-search\">\n                            <a routerLink=\"/advancedsearch\" routerLinkActive=\"active\">\n                              <i class=\"fa fa-search\" aria-hidden=\"true\" style=\"font-size: 2em\" id=\"search-icon\"></i>\n                            </a>\n                            <p class=\"header-text\">Advanced Search</p>\n                          </div>\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n\n<script>\n    $(document).ready(function () {\n        var isFirefox = typeof InstallTrigger !== 'undefined';\n        if (isFirefox === false) {\n            $(\"#navbar-search\").addClass(\"align-navsearch-btn\");\n        }\n    }\n</script>\n"

/***/ }),

/***/ 798:
/***/ (function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear-->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n<link href=\"https://fonts.googleapis.com/css?family=Quicksand\" rel=\"stylesheet\">\n<!-- Stop ignoring BootLintBear-->\n<nav class=\"navbar navbar-default nav-about\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <button type = \"button\" class = \"navbar-toggle\"\n              data-toggle = \"collapse\" data-target = \"#dropmenu\">\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n        <span class = \"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand advsearch-navbar\" href=\"//susper.com\">\n        <img alt=\"brand\" class=\"navbar-logo\" src=\"../../assets/images/susper.svg\">\n      </a>\n    </div>\n    <div class=\"collapse navbar-collapse\" id=\"dropmenu\">\n      <ul class=\"nav navbar-nav navbar-collapse navbar-right\">\n        <li><a routerLink=\"/terms\">Terms</a></li>\n        <li><a routerLink=\"/about\">About</a></li>\n        <li><a routerLink=\"/contact\">Contact</a></li>\n      </ul>\n    </div>\n  </div>\n</nav>\n\n\n\n<div class=\"container\">\n  <h3 style=\"color: #dd4b39;font-family: Arial,SansSerif\">Advanced Search</h3>\n  <hr>\n    <h4>Find pages with</h4>\n    <form>\n      <div class=\"row\">\n        <div class=\"form-group\">\n          <div class=\"col-md-4\"><label for=\"words\">all these words:</label></div>\n          <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"words\"></div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"col-md-4\"><label for=\"exact\">this exact word or phrase</label></div>\n          <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"exact\"></div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"col-md-4\"><label for=\"any\">any of these words</label></div>\n          <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"any\"></div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"col-md-4\"><label for=\"none\">none of these words</label></div>\n          <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"none\"></div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"col-md-4\"><label for=\"number\">numbers ranging from</label></div>\n          <div class=\"col-md-2\"><input type=\"text\" class=\"form-control\" id=\"number\"></div>\n\n          <div class=\"col-md-2\" style=\"text-align: center\"><label for=\"to\">to</label></div>\n          <div class=\"col-md-2\"><input type=\"text\" class=\"form-control\" id=\"to\"></div>\n        </div>\n\n      </div>\n    </form>\n  <hr>\n\n    <h4>\n      Then narrow your results by...\n    </h4>\n    <form>\n      <div class=\"row\">\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"language\">language</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"language\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"region\">region</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"region\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"last update\">last update</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"last update\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"site\">site</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"site\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"terms appearing\">terms appearing</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"terms appearing\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"safe search\">safe search</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"safe search\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"file type\">file type</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"file type\"></div>\n      </div>\n      <div class=\"form-group\">\n        <div class=\"col-md-4\"><label for=\"usage rights\">usage rights</label></div>\n        <div class=\"col-md-6\"><input type=\"text\" class=\"form-control\" id=\"usage rights\"></div>\n      </div>\n    </div>\n    </form>\n  <div>\n    <button style=\"border-color: white;background-color: #4d90fe;border: 1px solid #3079ed\"><span style=\"color: white\">Advanced Search</span></button>\n  </div>\n\n</div>\n\n  <!--footer navigation bar goes here-->\n  <app-footer-navbar></app-footer-navbar>\n"

/***/ }),

/***/ 799:
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid not-found-banner\">\n  <h2 class=\"yacy\">\n      <a href=\"/\" class=\"susperlogo\" id=\"homepage\">\n      <img src=\"../../assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></a></h2>\n  <h1>404</h1>\n  <h2>Page not found</h2>\n</div>\n<div id=\"search-bar\">\n  <app-search-bar></app-search-bar>\n</div>\n\n"

/***/ }),

/***/ 800:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"results?.length > 0\" class=\"card\">\n    <h3>Searches related to {{this.keyword}}</h3>\n    <div *ngFor=\"let result of results\" class=\"related\">\n      <a [routerLink]=\"resultsearch\" [queryParams]=\"{query: result.label}\" class=\"rellink\">{{result.label}}</a>\n    </div>\n  </div>\n\n"

/***/ }),

/***/ 801:
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n<div class=\"row\">\n    <div class=\"container-fluid\" id=\"search-options-field\">\n        <ul type=\"none\" id=\"search-options\">\n            <li [class.active_view]=\"Display('all')\" (click)=\"docClick()\">All</li>\n            <li [class.active_view]=\"Display('images')\" (click)=\"imageClick()\">Images</li>\n            <li [class.active_view]=\"Display('videos')\" (click)=\"videoClick()\">Videos</li>\n          <li class=\"dropdown\">\n                <a href=\"#\" id=\"tools\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n                    Tools\n                </a>\n                <ul class=\"dropdown-menu\" aria-labelledby=\"tools\" id=\"tool-dropdown\">\n                    <li (click)=\"filterByContext()\">Context Ranking</li>\n                    <li (click)=\"filterByDate()\">Sort by Date</li>\n                    <li data-toggle=\"modal\" data-target=\"#myModal\" (click)=\"advancedsearch()\">Advanced Search</li>\n                </ul>\n            </li>\n        </ul>\n    </div>\n    <div class=\"col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-lg-10 col-lg-offset-1\">\n        <div class=\"container-fluid\" id=\"progress-bar\">\n            {{message}}\n        </div>\n    </div>\n    <!-- Basic results 'All' -->\n  <div class=\"text-result\" *ngIf=\"Display('all')\">\n    <div class=\"feed col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-lg-10 col-lg-offset-1\">\n            <div *ngFor=\"let item of items$|async\" class=\"result\">\n                <div class=\"title\">\n                    <a class=\"title-pointer\" href=\"{{item.link}}\">{{item.title}}</a>\n                </div>\n                <div class=\"link\">\n                    <p>{{item.link}}</p>\n                </div>\n                <div class=\"description\">\n                    <p>{{item.pubDate|date:'MMMM d, yyyy'}} - {{item.description}}</p>\n                </div>\n            </div>\n      <app-related-search [hidden]=\"hidefooter\"></app-related-search>\n        </div>\n    </div>\n\n  <app-infobox [hidden]=\"hidefooter\" class=\"infobox col-md-4\" *ngIf=\"Display('all')\"></app-infobox>\n  <!-- END -->\n    <!-- Image section -->\n    <div class=\"container\">\n        <div class=\"grid\" *ngIf=\"Display('images')\">\n            <div class=\"cell\" *ngFor=\"let item of items$|async\">\n                <a class=\"image-pointer\" href=\"{{item.link}}\"><img class=\"responsive-image\" src=\"{{item.link}}\"></a>\n            </div>\n        </div>\n    </div>\n    <!-- END -->\n        <div class=\"video-result\" *ngIf=\"Display('videos')\">\n            <div *ngFor=\"let item of items$|async\" class=\"result\">\n                <div class=\"title\">\n                    <a class=\"title-pointer\" href=\"{{item.path}}\">{{item.title}}</a>\n                </div>\n                <div class=\"link\">\n                    <p>{{item.link}}</p>\n                </div>\n            </div>\n\n        </div>\n\n        <br>\n        <div class=\"clean\"></div>\n        <div class=\"pagination-property\" *ngIf=\"noOfPages>1\">\n            <nav aria-label=\"Page navigation\" *ngIf=\"(items$ | async)?.length!=0\">\n                <div class=\"col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-lg-10 col-lg-offset-1\">\n                <ul class=\"pagination\" id=\"pag-bar\">\n                    <li class=\"page-item\"><span class=\"page-link\" href=\"#\" (click)=\"decPresentPage()\">Previous</span></li>\n                    <li class=\"page-item\" *ngFor=\"let num of getNumber(maxPage)\"><span class=\"page-link\" *ngIf=\"presentPage>=4 && num<=noOfPages\" [class.active_page]=\"getStyle(presentPage-3+num)\"\n                            (click)=\"getPresentPage(presentPage-3+num)\" href=\"#\">{{presentPage-3+num}}</span>\n                        <span class=\"page-link\" *ngIf=\"presentPage<4 && num<=noOfPages\" [class.active_page]=\"num+1 == presentPage\" (click)=\"getPresentPage(num)\"\n                            href=\"#\">{{num+1}}</span></li>\n                    <li class=\"page-item\"><span class=\"page-link\" (click)=\"incPresentPage()\">Next</span></li>\n                </ul>\n                </div>\n            </nav>\n        </div>\n<div class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n    <app-advancedsearch></app-advancedsearch>\n</div>\n\n<!--footer navigation bar goes here-->\n</div>\n<app-footer-navbar [hidden]=\"hidefooter\"></app-footer-navbar>\n"

/***/ }),

/***/ 802:
/***/ (function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear -->\n<form class=\"navbar-form navbar-left\">\n<!-- Stop ignoring BootLintBear -->\n  <div class=\"input-group\" id=\"nav-group\">\n      <div class=\"input-text\">\n      <input #input type=\"text\" name=\"query\" class=\"form-control\" id=\"nav-input\" (keyup)=\"onquery($event)\"\n           [(ngModel)]=\"searchdata.query\">\n      </div>\n    <div class=\"input-group-btn\">\n      <button class=\"btn btn-default\" id=\"nav-button\" type=\"submit\" (click)=\"submit()\">\n        <i class=\"glyphicon glyphicon-search\"></i>\n      </button>\n    </div>\n  </div>\n  <app-auto-complete></app-auto-complete>\n</form>\n<script>\n  $(document).ready(function(){\n    var isFirefox = typeof InstallTrigger !== 'undefined';\n    if(isFirefox === false){\n      $(\".input-group-btn\").addClass(\"align-search-btn\");\n    }\n  }\n</script>\n"

/***/ }),

/***/ 803:
/***/ (function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear-->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n<link href=\"https://fonts.googleapis.com/css?family=Quicksand\" rel=\"stylesheet\">\n<!-- Stop ignoring BootLintBear-->\n<nav class=\"navbar navbar-default nav-terms\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n          <button type = \"button\" class = \"navbar-toggle\"\n                  data-toggle = \"collapse\" data-target = \"#dropmenu\">\n            <span class = \"icon-bar\"></span>\n            <span class = \"icon-bar\"></span>\n            <span class = \"icon-bar\"></span>\n          </button>\n            <a class=\"navbar-brand about-navbar\" href=\"//susper.com\">\n                <img alt=\"brand\" class=\"navbar-logo\" src=\"../../assets/images/susper.svg\">\n            </a>\n        </div>\n      <div class=\"collapse navbar-collapse\" id=\"dropmenu\">\n          <ul class=\"nav navbar-nav navbar-collapse navbar-right\">\n          <li><a routerLink=\"/terms\">Terms</a></li>\n          <li><a routerLink=\"/about\">About</a></li>\n        <li><a routerLink=\"/contact\">Contact</a></li>\n          </ul>\n        </div>\n    </div>\n</nav>\n\n<div class=\"container\">\n    <div id=\"left\" class=\"col-lg-4 col-md-3 col-sm-12\">\n        <br><br><br>\n        <h4 style=\"color:blue;\" class=\"link\">Terms of Service</h4>\n    </div>\n    <div id = \"right\"class =\"col-lg-8 col-md-9 col-sm-12\">\n        <br><br>\n        <h2>Welcome to susper!</h2>\n        <p>Thanks for using our products and services (“Services”). The Services are provided by FOSSASIA community, located\n            at 93 Mau Than, Can Tho City, Viet Nam.\n            <br><br> By using our Services, you are agreeing to these terms. Please read them carefully.\n        </p>\n        <h2>Using our Services</h2>\n        <p>You must follow any policies made available to you within the Services.\n            <br><br> Don’t misuse our Services. For example, don’t interfere with our Services or try to access them using\n            a method other than the interface and the instructions that we provide. You may use our Services only as permitted\n            by law, including applicable export and re-export control laws and regulations. We may suspend or stop providing\n            our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.\n            <br><br> Using our Services does not give you ownership of any intellectual property rights in our Services or\n            the content you access. You may not use content from our Services unless you obtain permission from its owner\n            or are otherwise permitted by law. These terms do not grant you the right to use any branding or logos used in\n            our Services. Don’t remove, obscure, or alter any legal notices displayed in or along with our Services.\n            <br><br> Our Services display some content that is not susper’s. This content is the sole responsibility of the\n            entity that makes it available. We may review content to determine whether it is illegal or violates our policies,\n            and we may remove or refuse to display content that we reasonably believe violates our policies or the law. But\n            that does not necessarily mea.n that we review content, so please don’t assume that we do.\n            <br><br> In connection with your use of the Services, we may send you service announcements, administrative messages,\n            and other information. You may opt out of some of those communications.\n            <br><br> Some of our Services are available on mobile devices. Do not use such Services in a way that distracts\n            you and prevents you from obeying traffic or safety laws.\n            <br><br>\n        </p>\n        <h2>Your susper Account</h2>\n        <p>\n            You may need a susper Account in order to use some of our Services. You may create your own susper Account, or your susper\n            Account may be assigned to you by an administrator, such as your employer or educational institution. If you\n            are using a susper Account assigned to you by an administrator, different or additional terms may apply and your\n            administrator may be able to access or disable your account.\n            <br><br> To protect your susper Account, keep your password confidential. You are responsible for the activity\n            that happens on or through your susper Account. Try not to reuse your susper Account password on third-party\n            applications. If you learn of any unauthorized use of your password or susper Account, change your password and\n            take measures to secure your account.\n            <br><br>\n        </p>\n        <h2>Privacy and Copyright Protection</h2>\n        <p>susper’s privacy policies ensures that your personal data is safe and protected. By using our Services, you agree\n            that susper can use such data in accordance with our privacy policies.\n            <br><br> We respond to notices of alleged copyright infringement and terminate accounts of repeat infringers.\n            If you think somebody is violating your copyrights and want to notify us, you can find information about submitting\n            notices and susper’s policy about responding to notices on our website.\n            <br><br>\n        </p>\n        <h2>Your Content in our Services</h2>\n        <p>Some of our Services allow you to upload, submit, store, send or receive content. You retain ownership of any intellectual\n            property rights that you hold in that content. In short, what belongs to you stays yours.\n            <br><br> When you upload, submit, store, send or receive content to or through our Services, you give susper\n            (and those we work with) a worldwide license to use, host, store, reproduce, modify, create derivative works\n            (such as those resulting from translations, adaptations or other changes we make so that your content works better\n            with our Services), communicate, publish, publicly perform, publicly display and distribute such content. The\n            rights you grant in this license are for the limited purpose of operating, promoting, and improving our Services,\n            and to develop new ones. This license continues even if you stop using our Services (for example, for a business\n            listing you have added to susper Maps). Some Services may offer you ways to access and remove content that has\n            been provided to that Service. Also, in some of our Services, there are terms or settings that narrow the scope\n            of our use of the content submitted in those Services. Make sure you have the necessary rights to grant this\n            license for any content that you submit to our Services.\n            <br><br> If you have a susper Account, we may display your Profile name, Profile photo, and actions you take\n            on susper or on third-party applications connected to your susper Account in our Services, including displaying\n            in ads and other commercial contexts. We will respect the choices you make to limit sharing or visibility settings\n            in your susper Account.\n            <br><br>\n        </p>\n        <h2>About Software in our Services</h2>\n        <p>When a Service requires or includes downloadable software, this software may update automatically on your device\n            once a new version or feature is available. Some Services may let you adjust your automatic update settings.\n            <br><br> susper gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use\n            the software provided to you by susper as part of the Services. This license is for the sole purpose of enabling\n            you to use and enjoy the benefit of the Services as provided by susper, in the manner permitted by these terms.\n            <br><br> Most of our services are offered through Free Software and/or Open Source Software. You may copy, modify,\n            distribute, sell, or lease these applications and share the source code of that software as stated in the License\n            agreement provided with the Software.\n            <br><br>\n        </p>\n        <h2>Modifying and Terminating our Services</h2>\n        <p>We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may\n            suspend or stop a Service altogether.\n            <br><br> You can stop using our Services at any time. susper may also stop providing Services to you, or add\n            or create new limits to our Services at any time.\n            <br><br> We believe that you own your data and preserving your access to such data is important. If we discontinue\n            a Service, where reasonably possible, we will give you reasonable advance notice and a chance to get information\n            out of that Service.\n            <br><br>\n        </p>\n        <h2>Our Warranties and Disclaimers</h2>\n        <p>We provide our Services using a reasonable level of skill and care and we hope that you will enjoy using them. But\n            there are certain things that we don’t promise about our Services.\n            <br><br> Other than as expressly set out in these terms or additional terms, neither susper nor its suppliers\n            or distributors make any specific promises about the Services. For example, we don’t make any commitments about\n            the content within the Services, the specific functions of the Services, or their reliability, availability,\n            or ability to meet your needs. We provide the Services “as is”.\n            <br><br> Some jurisdictions provide for certain warranties, like the implied warranty of merchantability, fitness\n            for a particular purpose and non-infringement. To the extent permitted by law, we exclude all warranties.\n            <br><br>\n        </p>\n        <h2>Liability for our Services</h2>\n        <p>When permitted by law, susper, and susper’s suppliers and distributors, will not be responsible for lost profits,\n            revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages.\n            <br><br> To the extent permitted by law, the total liability of susper, and its suppliers and distributors, for\n            any claims under these terms, including for any implied warranties, is limited to the amount you paid us to use\n            the Services (or, if we choose, to supplying you the Services again).\n            <br><br> In all cases, susper, and its suppliers and distributors, will not be liable for any loss or damage\n            that is not reasonably foreseeable.\n            <br><br> We recognize that in some countries, you might have legal rights as a consumer. If you are using the\n            Services for a personal purpose, then nothing in these terms or any additional terms limits any consumer legal\n            rights which may not be waived by contract.\n            <br><br>\n        </p>\n        <h2>Business uses of our Services</h2>\n        <p>If you are using our Services on behalf of a business, that business accepts these terms. It will hold harmless and\n            indemnify susper and its affiliates, officers, agents, and employees from any claim, suit or action arising from\n            or related to the use of the Services or violation of these terms, including any liability or expense arising\n            from claims, losses, damages, suits, judgments, litigation costs and attorneys’ fees.\n            <br><br>\n            <h2>About these Terms</h2>\n            <p>We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to\n                the law or changes to our Services. You should look at the terms regularly. We’ll post notice of modifications\n                to these terms on this page. We’ll post notice of modified additional terms in the applicable Service. Changes\n                will not apply retroactively and will become effective no sooner than fourteen days after they are posted.\n                However, changes addressing new functions for a Service or changes made for legal reasons will be effective\n                immediately. If you do not agree to the modified terms for a Service, you should discontinue your use of\n                that Service.\n                <br><br> If there is a conflict between these terms and the additional terms, the additional terms will control\n                for that conflict.\n                <br> These terms control the relationship between susper and you. They do not create any third party beneficiary\n                rights.\n                <br><br> If you do not comply with these terms, and we don’t take action right away, this doesn’t mean that\n                we are giving up any rights that we may have (such as taking action in the future).\n                <br><br> If it turns out that a particular term is not enforceable, this will not affect any other terms.<br><br>                You agree that the laws of Can Tho, Viet Nam will apply to any disputes arising out of or relating to these\n                terms or the Services. All claims arising out of or relating to these terms or the services will be litigated\n                exclusively in the courts of Can Tho City, Viet Nam, and you and susper consent to personal jurisdiction\n                in those courts.\n                <br><br> For information about how to contact susper, please visit our contact page.\n                <br><br>\n            </p>\n    </div>\n</div>\n\n\n<footer>\n    <!--footer navigation bar goes here-->\n    <app-footer-navbar></app-footer-navbar>\n</footer>\n"

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reselect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__ = __webpack_require__(787);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search__ = __webpack_require__(613);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__query__ = __webpack_require__(612);
/* harmony export (immutable) */ __webpack_exports__["a"] = reducer;
/* unused harmony export getSearchState */
/* unused harmony export getQueryState */
/* unused harmony export getSearchResults */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getItems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getTotalResults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNavigation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getquery; });







/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
var reducers = {
    search: __WEBPACK_IMPORTED_MODULE_5__search__["a" /* reducer */],
    query: __WEBPACK_IMPORTED_MODULE_6__query__["a" /* reducer */],
};
var developmentReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__["compose"])(__WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__["storeFreeze"], __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["h" /* combineReducers */])(reducers);
var productionReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__ngrx_store__["h" /* combineReducers */])(reducers);
function reducer(state, action) {
    if (__WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].production) {
        return productionReducer(state, action);
    }
    else {
        return developmentReducer(state, action);
    }
}
var getSearchState = function (state) { return state.search; };
var getQueryState = function (state) { return state.query; };
var getSearchResults = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_reselect__["createSelector"])(getSearchState, __WEBPACK_IMPORTED_MODULE_5__search__["b" /* getsearchresults */]);
var getItems = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_reselect__["createSelector"])(getSearchState, __WEBPACK_IMPORTED_MODULE_5__search__["c" /* getItems */]);
var getTotalResults = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_reselect__["createSelector"])(getSearchState, __WEBPACK_IMPORTED_MODULE_5__search__["d" /* getTotalResults */]);
var getNavigation = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_reselect__["createSelector"])(getSearchState, __WEBPACK_IMPORTED_MODULE_5__search__["e" /* getNavigation */]);
var getquery = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_reselect__["createSelector"])(getQueryState, __WEBPACK_IMPORTED_MODULE_6__query__["b" /* getpresentquery */]);
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.js.map

/***/ })

},[1059]);
//# sourceMappingURL=main.bundle.js.map