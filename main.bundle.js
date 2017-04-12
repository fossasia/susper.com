webpackJsonp([0,3],{

/***/ 156:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect__ = __webpack_require__(717);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reselect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__ = __webpack_require__(522);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__ = __webpack_require__(697);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__query__ = __webpack_require__(540);
/* harmony export (immutable) */ exports["e"] = reducer;
/* unused harmony export getSearchState */
/* unused harmony export getQueryState */
/* unused harmony export getSearchResults */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return getItems; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return getTotalResults; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return getNavigation; });
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return getquery; });







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
var developmentReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__["compose"])(__WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__["storeFreeze"], __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* combineReducers */])(reducers);
var productionReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* combineReducers */])(reducers);
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

/***/ },

/***/ 345:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(349);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return QueryAction; });

var ActionTypes = {
    QUERYCHANGE: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* type */])('[Query] Change'),
};
var QueryAction = (function () {
    function QueryAction(payload) {
        this.payload = payload;
        this.type = ActionTypes.QUERYCHANGE;
    }
    return QueryAction;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/query.js.map

/***/ },

/***/ 346:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(349);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SearchAction; });
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

/***/ },

/***/ 347:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
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
    function AppComponent() {
        this.title = 'Susper';
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(710),
            styles: [__webpack_require__(701)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/app.component.js.map

/***/ },

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(724);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(725);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_search__ = __webpack_require__(346);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SearchService; });
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
        var _this = this;
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* URLSearchParams */]();
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
            .get('http://yacy.searchlab.eu/solr/select', { search: params }).subscribe(function (res) {
            _this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_5__actions_search__["a" /* SearchAction */](res.json()[0]));
        });
    };
    SearchService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Jsonp */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */]) === 'function' && _c) || Object])
    ], SearchService);
    return SearchService;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search.service.js.map

/***/ },

/***/ 349:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = type;
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

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/environment.js.map

/***/ },

/***/ 405:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 405;


/***/ },

/***/ 406:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__polyfills_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(536);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_40" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/main.js.map

/***/ },

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AboutComponent; });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-about',
            template: __webpack_require__(708),
            styles: [__webpack_require__(699)]
        }), 
        __metadata('design:paramtypes', [])
    ], AboutComponent);
    return AboutComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/about.component.js.map

/***/ },

/***/ 533:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(156);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AdvancedsearchComponent; });
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
        this.activatedroute.queryParams.subscribe(function (query) {
            _this.querylook = Object.assign({}, query);
            _this.navigation$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["c" /* getNavigation */]);
        });
    }
    AdvancedsearchComponent.prototype.changeurl = function (modifier) {
        console.log(modifier);
        this.querylook['query'] = this.querylook['query'] + '+' + decodeURIComponent(modifier);
        console.log(this.querylook);
        this.route.navigate(['/search'], { queryParams: this.querylook });
    };
    AdvancedsearchComponent.prototype.ngOnInit = function () {
    };
    AdvancedsearchComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-advancedsearch',
            template: __webpack_require__(709),
            styles: [__webpack_require__(700)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */]) === 'function' && _c) || Object])
    ], AdvancedsearchComponent);
    return AdvancedsearchComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/advancedsearch.component.js.map

/***/ },

/***/ 534:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__ = __webpack_require__(538);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index_index_component__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__results_results_component__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__search_service__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__ = __webpack_require__(539);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_common__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__advancedsearch_advancedsearch_component__ = __webpack_require__(533);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngrx_store_devtools__ = __webpack_require__(528);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__reducers_index__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__ = __webpack_require__(543);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__about_about_component__ = __webpack_require__(532);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__footer_navbar_footer_navbar_component__ = __webpack_require__(535);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
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
    { path: '404', component: __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__["a" /* NotFoundComponent */] },
    { path: '**', redirectTo: '/404' },
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_6__index_index_component__["a" /* IndexComponent */],
                __WEBPACK_IMPORTED_MODULE_7__results_results_component__["a" /* ResultsComponent */],
                __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__["a" /* NotFoundComponent */],
                __WEBPACK_IMPORTED_MODULE_12__advancedsearch_advancedsearch_component__["a" /* AdvancedsearchComponent */],
                __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__["a" /* SearchBarComponent */],
                __WEBPACK_IMPORTED_MODULE_17__about_about_component__["a" /* AboutComponent */],
                __WEBPACK_IMPORTED_MODULE_18__footer_navbar_footer_navbar_component__["a" /* FooterNavbarComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["c" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_11__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["d" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["e" /* JsonpModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_router__["c" /* RouterModule */].forRoot(appRoutes),
                __WEBPACK_IMPORTED_MODULE_14__ngrx_store__["h" /* StoreModule */].provideStore(__WEBPACK_IMPORTED_MODULE_15__reducers_index__["e" /* reducer */]),
                __WEBPACK_IMPORTED_MODULE_13__ngrx_store_devtools__["a" /* StoreDevtoolsModule */].instrumentOnlyWithExtension(),
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_9__search_service__["a" /* SearchService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/app.module.js.map

/***/ },

/***/ 535:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FooterNavbarComponent; });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-footer-navbar',
            template: __webpack_require__(711),
            styles: [__webpack_require__(702)]
        }), 
        __metadata('design:paramtypes', [])
    ], FooterNavbarComponent);
    return FooterNavbarComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/footer-navbar.component.js.map

/***/ },

/***/ 536:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(534);
/* unused harmony namespace reexport */
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.js.map

/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(68);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return IndexComponent; });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-index',
            template: __webpack_require__(712),
            styles: [__webpack_require__(703)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], IndexComponent);
    return IndexComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.component.js.map

/***/ },

/***/ 538:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(68);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NavbarComponent; });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-navbar',
            template: __webpack_require__(713),
            styles: [__webpack_require__(704)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NavbarComponent);
    return NavbarComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/navbar.component.js.map

/***/ },

/***/ 539:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(68);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NotFoundComponent; });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-not-found',
            template: __webpack_require__(714),
            styles: [__webpack_require__(705)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NotFoundComponent);
    return NotFoundComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/not-found.component.js.map

/***/ },

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_query__ = __webpack_require__(345);
/* unused harmony export CHANGE */
/* harmony export (immutable) */ exports["a"] = reducer;
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return getpresentquery; });

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

/***/ },

/***/ 541:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_search__ = __webpack_require__(346);
/* unused harmony export CHANGE */
/* harmony export (immutable) */ exports["a"] = reducer;
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return getsearchresults; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return getItems; });
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return getTotalResults; });
/* harmony export (binding) */ __webpack_require__.d(exports, "e", function() { return getNavigation; });

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
                totalResults: Number(search_1.channels[0].totalResults),
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

/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_service__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(110);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ResultsComponent; });
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
    function ResultsComponent(domsanitizer, searchservice, route, activatedroute, store, ref) {
        var _this = this;
        this.domsanitizer = domsanitizer;
        this.searchservice = searchservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.store = store;
        this.ref = ref;
        this.hoverBox = false;
        this.myUrlList = [];
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
        this.activatedroute.queryParams.subscribe(function (query) {
            console.log(query);
            if (query['fq']) {
                console.log(query['fq']);
                if (query['fq'].includes('png')) {
                    _this.resultDisplay = 'images';
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
            _this.presentPage = query['start'] / _this.searchdata.rows;
            _this.searchdata.query = query['query'];
            _this.querylook = Object.assign({}, query);
            _this.searchdata.sort = query['sort'];
            _this.begin = Number(query['start']) + 1;
            _this.message = 'loading...';
            _this.start = (_this.presentPage) * _this.searchdata.rows;
            _this.begin = _this.start + 1;
            searchservice.getsearchresults(query);
            _this.items$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["a" /* getItems */]);
            _this.totalResults$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["b" /* getTotalResults */]);
            _this.totalResults$.subscribe(function (totalResults) {
                _this.end = Math.min(totalResults, _this.begin + _this.searchdata.rows - 1);
                _this.message = 'showing results ' + _this.begin + ' to ' + _this.end + ' of ' + totalResults;
                _this.noOfPages = Math.ceil(totalResults / _this.searchdata.rows);
                _this.maxPage = Math.min(_this.searchdata.rows, _this.noOfPages);
            });
            _this.items$.subscribe(function (m) {
                for (var i = 0; i < m.length; i++) {
                    _this.myUrlList[i] = _this.domsanitizer.bypassSecurityTrustResourceUrl(m[i].link);
                    console.log(_this.myUrlList);
                }
            });
        });
        this.presentPage = 0;
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
    // display content on hover
    // --------------------------------
    ResultsComponent.prototype.overTitle = function () {
        if (this.hoverBox === true) {
            this.hoverBox = false;
        }
        else {
            this.hoverBox = true;
        }
    };
    ResultsComponent.prototype.trachHero = function (index, item) {
        console.log('item', item);
        return item ? item.id : undefined;
    };
    // ---------------------------------
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
        this.searchdata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+gif)';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.imageClick = function () {
        this.getPresentPage(0);
        this.resultDisplay = 'images';
        this.searchdata.rows = 100;
        this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
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
        this.presentPage = 0;
    };
    ResultsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-results',
            template: __webpack_require__(715),
            styles: [__webpack_require__(706)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["b" /* DomSanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["b" /* DomSanitizer */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */]) === 'function' && _e) || Object, (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ChangeDetectorRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ChangeDetectorRef */]) === 'function' && _f) || Object])
    ], ResultsComponent);
    return ResultsComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/results.component.js.map

/***/ },

/***/ 543:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_query__ = __webpack_require__(345);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SearchBarComponent; });
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
        this.query$ = store.select(__WEBPACK_IMPORTED_MODULE_3__reducers__["d" /* getquery */]);
        this.query$.subscribe(function (query) {
            _this.searchdata.query = query;
            if (_this.searchdata.query !== '') {
                _this.submit();
            }
        });
    }
    ;
    SearchBarComponent.prototype.onquery = function (event) {
        console.log(event.target.value);
        this.store.dispatch(new __WEBPACK_IMPORTED_MODULE_4__actions_query__["b" /* QueryAction */](event.target.value));
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* ViewChildren */])('input'), 
        __metadata('design:type', Object)
    ], SearchBarComponent.prototype, "vc", void 0);
    SearchBarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-search-bar',
            template: __webpack_require__(716),
            styles: [__webpack_require__(707)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */]) === 'function' && _c) || Object])
    ], SearchBarComponent);
    return SearchBarComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search-bar.component.js.map

/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(551);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(547);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(553);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(552);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(550);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(549);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(557);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(546);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(548);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(554);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(559);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(749);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/polyfills.js.map

/***/ },

/***/ 699:
/***/ function(module, exports) {

module.exports = ".banner {\n    width: 100%;\n    position: relative;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    top: -10%;\n    overflow: hidden;\n}\n\n.image-banner {\n    position: relative;\n    height: 450px;\n    overflow: hidden;\n}\n\n.navbar-logo {\n    height: 30px;\n    padding-left: 20px;\n}\n\n.navbar-text {\n    padding-right: 30px;\n    font-size: 20px;\n}\n\n.text-center {\n    text-align: center;\n    font-family: \"Quicksand\", sans-serif;\n}\n\n.bold {\n    font-weight: 700;\n}\n\n@media screen and (max-width:990px) {\n    .image-banner {\n        height: 190px;\n    }\n    .banner {\n        top: 0;\n    }\n}\n\n.about-navbar {\n    position: relative;\n    top: -5px;\n}\n\n.navbar {\n    margin-bottom: 0px !important;\n}\n\n.nav-about {\n    clear: both;\n    margin: -57px 0 0 0\n}\n\n.sub-details {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n}\n\n.sub-details h5 {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    margin: 20px 0 20px 0;\n}\n\n.sub-details p {\n    font-family: Roboto, sans-serif;\n    line-height: 1.4;\n    font-size: 14px;\n    text-align: justify;\n}\n\n.about-sub-details {\n    padding: 20px 0 20px 0;\n    border-top: 1px solid #eee;\n    border-bottom: 1px solid #eee;\n}\n\n.about-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n\n.contact-sub-details {\n    margin-bottom: 40px;\n}\n\n.contact-sub-details .row h2 {\n    font-family: \"Quicksand\", sans-serif;\n    padding: 5px 10px;\n    font-weight: 500;\n    font-size: 24px;\n}\n.navbar-fixed-bottom, .navbar-fixed-top{\n    position: relative !important;\n}\n"

/***/ },

/***/ 700:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 701:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 702:
/***/ function(module, exports) {

module.exports = ".fixed-bottom{\r\n    position: relative;\r\n    bottom: 0px;\r\n    margin: 0;\r\n}\r\n"

/***/ },

/***/ 703:
/***/ function(module, exports) {

module.exports = ".starter-template{\r\n  margin-top: 10%;\r\n}\r\n\r\n#search-bar{\r\n  position: absolute;\r\n  left: 27%;\r\n}\r\n\r\n@media screen and (min-width: 1920px) {\r\n  #search-bar{\r\n    left: 28%;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 991px) {\r\n  #search-bar{\r\n    left: 20%;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 767px) {\r\n  #search-bar{\r\n    left: 6%;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 479px) {\r\n  #search-bar{\r\n    left: 5%;\r\n  }\r\n}\r\n\r\n@media screen and (max-width: 359px) {\r\n  #search-bar{\r\n    left: 4%;\r\n  }\r\n}\r\n\r\n#set-susper-default{\r\n  display:none;\r\n}\r\n\r\n@media screen and (max-width: 480px) {\r\n  #set-susper-default h3{\r\n    font-size: 14px;\r\n  }\r\n  #set-susper-default ol{\r\n    font-size: 12px;\r\n  }\r\n  #install-susper{\r\n    font-size: 12px;\r\n  }\r\n  #cancel-installation{\r\n    font-size: 12px;\r\n  }\r\n}\r\n\r\n.navbar-fixed-bottom{\r\n  z-index: -1;\r\n}\r\n\r\n.navbar-brand\r\n{\r\n    position: absolute;\r\n    width: 100%;\r\n    left: 0;\r\n    text-align: center;\r\n    margin:0 auto;\r\n}\r\n\r\n.navbar-toggle {\r\n    z-index:3;\r\n}\r\nfooter{\r\n    position: absolute;\r\n    bottom: 0px;\r\n    left: 0px;\r\n    width:100%;\r\n}\r\n"

/***/ },

/***/ 704:
/***/ function(module, exports) {

module.exports = ".navbar-brand{\n    width: 140px;\n    height: auto;\n}\n\n.menu-image{\n  width: 60px;\n  height: 50px;\n}\n\n.menu-drop-image{\n  width: 25px;\n  height: auto;\n}\n\n.header{\n  display:inline-table;\n  width: 60px;\n  padding: 4%;\n  padding-left: 8%;\n  padding-right: 8%;\n  text-align: center;\n}\n\n.header-text{\n  font-size: small;\n  width: inherit;\n  text-align: center;\n}\n\n.dropdown-menu{\n  width: 200px;\n}\n\n#navcontainer ul {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\n\n@media screen and (min-width:1920px) {\n  .navbar-brand{\n      width: 170px;\n      height: auto;\n  }\n}\n\n@media screen and (min-width:768px) {\n  #navcontainer ul li {\n    display: inline;\n  }\n\n  #navcontainer, #side-menu {\n    margin-top: 8px;\n  }\n}\n\n@media screen and (max-width:1079px) {\n  .navbar-brand{\n      margin-top: 2px;\n      width: 130px;\n  }\n}\n\n@media screen and (max-width:767px) {\n  .navbar-brand{\n      margin-left: 38%;\n      height: auto;\n  }\n  #navbar-search {\n    margin-left: 7%;\n    margin-right: 8%;\n  }\n  .align-navsearch-btn {\n    margin-right: 1% !important;\n  }\n}\n\n@media screen and (max-width:639px) {\n  .align-navsearch-btn {\n    margin-right: 2% !important;\n  }\n}\n\n@media screen and (max-width:479px) {\n  .navbar-brand{\n      margin-left: 33%;\n  }\n  #navbar-search {\n    margin-left: 5%;\n    margin-right: 9%;\n  }\n  .align-navsearch-btn {\n    margin-right: 3% !important;\n  }\n}\n\n@media screen and (max-width:359px) {\n  .navbar-brand{\n      margin-left: 30%;\n  }\n}\n\n.fa {\n  color: #808080;\n}\n"

/***/ },

/***/ 705:
/***/ function(module, exports) {

module.exports = ".not-found-banner{\n    text-align: center;\n    margin: 0 auto;\n    background: url(../../assets/images/not-found-bg.jpg);\n    background-size: cover;\n    height: 300px;\n    width: 100%;\n    position: relative;\n    top:-57px;\n}\n.not-found-banner h1{\n    font-size: 72px;\n}\n.not-found-banner h2{\n    font-size: 22px;\n    letter-spacing: 10px;\n}\n\n#search-bar{\n  position: absolute;\n  left: 27%;\n}\n\n@media screen and (min-width: 1920px) {\n  #search-bar{\n    left: 28%;\n  }\n}\n\n@media screen and (max-width: 991px) {\n  #search-bar{\n    left: 20%;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #search-bar{\n    left: 6%;\n  }\n}\n\n@media screen and (max-width: 479px) {\n  #search-bar{\n    left: 5%;\n  }\n}\n\n@media screen and (max-width: 359px) {\n  #search-bar{\n    left: 4%;\n  }\n}\n"

/***/ },

/***/ 706:
/***/ function(module, exports) {

module.exports = ".result {\n  padding-left: 60px;\n  padding-top: 30px;\n}\n\n.title >a {\n  color: darkblue;\n  font-size: large;\n  text-decoration: none;\n}\n\n.link > p {\n  color: #006621;\n  text-decoration: none;\n}\n\n.title >a:hover {\n  text-decoration: underline;\n}\n\n.description {\n  text-align: justify;\n}\n\n.page-link {\n  cursor: pointer;\n}\n\n#progress-bar {\n  margin-top: 1%;\n  font-size: small;\n  color: #88aaaa;\n  padding-left: 60px;\n}\n\n.dropdown-menu > li {\n  font-size: small;\n  padding: 5px;\n  text-align: center;\n  text-decoration: none;\n}\n\n.dropdown-menu > li:hover {\n  padding: 10px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #f5f5f5;\n}\n\n.dropdown-menu > li:active {\n  padding: 5px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #1c65ba;\n  color: white;\n}\n\n.active_page {\n  background-color: #bdcdd4;\n}\n\n.active_view {\n  color: #4285f4 !important;\n  border-bottom: 3px solid #4285f4;\n}\n\nimg.res-img {\n  max-width: 350px;\n  max-height: 300px;\n  padding-top: 20px;\n  padding: 0.6%;\n  float: left;\n}\n\n#search-options-field {\n  background-color: #f8f8f8;\n  padding-bottom: 6px;\n}\n\n#search-options {\n  margin-top: 2.2%;\n  margin-left: 9%;\n}\n\n#search-tools {\n  margin-left: 11.5%;\n}\n\n#search-tools {\n  padding-left: 60px;\n}\n\n#search-tools .btn {\n  border: none;\n  background: none;\n  font-size: small;\n}\n\n#search-options li {\n  display: inline;\n  cursor: pointer;\n  padding: 28px 20px 12px;\n  color: #777;\n  font-weight: 500;\n  font-size: 13px;\n}\n\n#search-options li:hover {\n  color: #222;\n}\n\n#tools {\n  text-decoration: none;\n  color: #777;\n  margin-left: 23%;\n}\n\n#tools:hover {\n  color: #222;\n}\n\n.dropdown-menu {\n  min-width: 140px;\n}\n\n#tool-dropdown li {\n  text-align: left;\n  display: block;\n  padding: 4px 12px;\n}\n\n#pag-bar {\n  padding-left: 60px;\n  padding-top: 20px;\n}\n\n.pagination-property {\n  max-width: 100%;\n}\n\n.image-result {\n  padding-left: 80px;\n}\n\n.clean {\n  clear: both;\n}\n\n@media screen and (min-width:1920px) {\n  #tools {\n    margin-left: 27%;\n  }\n}\n\n@media screen and (max-width:1365px) {\n  #tools {\n    margin-left: 21.5%;\n  }\n}\n\n@media screen and (max-width:1279px) {\n  #search-options {\n    margin-left: 11%;\n  }\n  #tools {\n    margin-left: 17%;\n  }\n}\n\n@media screen and (max-width:991px) {\n  #tools {\n    margin-left: 26%;\n  }\n}\n\n@media screen and (max-width:979px) {\n  #search-options {\n    margin-left: 12.5%;\n  }\n  #tools {\n    margin-left: 18%;\n  }\n}\n\n@media screen and (max-width:767px) {\n  .result {\n    padding-left: 50px;\n    padding-right: 30px;\n  }\n  #progress-bar {\n    padding-left: 50px;\n    margin-bottom: -10px;\n  }\n  #search-options {\n    padding-left: 0px;\n    margin-top: 75px;\n    margin-left: 8%;\n  }\n  #pag-bar {\n    padding-left: 50px;\n  }\n  #search-tools {\n    padding-left: 50px;\n  }\n  #search-options li {\n    padding: 0px 8.3% 12px;\n  }\n  #tools {\n    margin-left: 0%;\n  }\n}\n\n@media screen and (max-width:639px) {\n  #search-options li {\n    padding: 0px 7.5% 12px;\n  }\n}\n\n@media screen and (max-width:479px) {\n  .result {\n    padding-left: 30px;\n    padding-right: 20px;\n  }\n  #progress-bar {\n    padding-left: 30px;\n  }\n  #pag-bar {\n    padding-left: 30px;\n  }\n  #search-tools {\n    padding-left: 30px;\n  }\n  #search-options {\n    margin-left: 5.5%;\n  }\n  #search-options li {\n    padding: 0px 7% 12px;\n  }\n}\n\n@media screen and (max-width:379px) {\n  #search-options li {\n    padding: 0px 6.2% 12px;\n  }\n}\n\n@media screen and (max-width:320px) {\n  #search-options li {\n    padding: 0px 5.6% 12px;\n  }\n}\n\n.box {\n  display: none;\n  width: 100%;\n  text-align: right;\n}\n\na:hover + .box, .box:hover{\n  display:block;\n  position: absolute;\n  z-index:100;\n}\n\niframe {\n  overflow-x: hidden;\n}\n"

/***/ },

/***/ 707:
/***/ function(module, exports) {

module.exports = "#nav-input{\n  width: 40vw;\n  height: 40px;\n  border-radius: 0px;\n  border: none;\n  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0 ,0, 0, 0.08);\n}\n\n#nav-button{\n  border-left: none;\n  border-radius: 0px;\n  height: 40px;\n  background-color: white;\n  color: #0066ff;\n  border-bottom: none;\n  border-top: none;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);\n}\n\n#nav-group{\n  top:3px;\n}\n\n.navbar-form{\n  border-color: transparent !important;\n}\n\n@media screen and (min-width:1920px) {\n  #nav-group{\n    top:6px;\n  }\n}\n\n@media screen and (max-width: 979px) and (min-width: 768px) {\n  .navbar-form{\n    padding-left: 5px;\n   }\n}\n\n@media screen and (max-width: 991px) {\n  #nav-input{\n    width: 50vw;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #nav-input{\n    width: 80vw;\n  }\n  .align-search-btn{\n    left: -9%;\n  }\n}\n\n@media screen and (max-width: 480px) {\n  .align-search-btn{\n    left: -6%;\n  }\n}\n\n@media screen and (max-width: 360px) {\n  .align-search-btn{\n    left: -5%;\n  }\n}\n"

/***/ },

/***/ 708:
/***/ function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear-->\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n<link href=\"https://fonts.googleapis.com/css?family=Quicksand\" rel=\"stylesheet\">\n<!-- Stop ignoring BootLintBear-->\n<nav class=\"navbar navbar-default nav-about\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n            <a class=\"navbar-brand about-navbar\" href=\"//susper.com\">\n                <img alt=\"brand\" class=\"navbar-logo\" src=\"../../assets/images/susper.svg\">\n            </a>\n        </div>\n        <p class=\"navbar-text navbar-right\">About Page</p>\n    </div>\n</nav>\n<div class=\"image-banner\">\n    <img src=\"../../assets/images/mountain.jpg\" class=\"img-responsive banner\">\n</div>\n<div class=\"container\">\n    <br>\n    <h2 class=\"text-center\">Susper is a decentral Search Engine that uses the peer to peer system 'YaCy' and 'Apache Solr' to crawl and index search\n        results.\n    </h2>\n    <br>\n    <div class=\"about-sub-details\">\n        <div class=\"row\">\n            <h2 class=\"bold\">About Us</h2>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">About YaCy</h5>\n                <p>YaCy is a free search engine that anyone can use to build a search portal for their intranet or to help search\n                    the public internet. Read more about YaCy here - <a href=\"https://yacy.net/en/index.html\" target=\"_blank\">YaCy Decentralized Web Search</a></p>\n            </div>\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">Communication</h5>\n                <p>Facing issues while setting up project on local environment? Our chat channel is on gitter here: <a href=\"https://gitter.im/fossasia/susper.com\"\n                        target=\"_blank\">fossasia/susper.com</a> We'll be happy to help you out!'</p>\n            </div>\n            <div class=\"col-lg-4 col-sm-12 sub-details\">\n                <h5 class=\"bold\">Contribute to our project</h5>\n                <p>Get involved as an Open Source developer, designer or tester and start your adventure today! Solve an issue\n                    or feature request on our repositories with <a href=\"https://github.com/fossasia/susper.com\" target=\"_blank\">FOSSASIA</a>Build\n                    up your developer profile and become part of a fantastic community.</p>\n            </div>\n        </div>\n        <!--About Us details ends-->\n    </div>\n    <!--about-sub-details ends here-->\n\n    <div class=\"contact-sub-details\">\n        <div class=\"row\">\n            <h2 class=\"bold\">Contact Us</h2>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-lg-12 col-sm-12 contact-sub-details\">\n                <p>If you would like to get in touch with us, you find our details on the <a href=\"contact\">contact page.</a></p>\n            </div>\n\n        </div>\n    </div>\n    <!--contact-sub-details ends here-->\n\n    <br>\n</div>\n<footer>\n    <!--footer navigation bar goes here-->\n    <app-footer-navbar></app-footer-navbar>\n</footer>\n"

/***/ },

/***/ 709:
/***/ function(module, exports) {

module.exports = "<div class=\"modal-dialog\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <!-- Start ignoring HTMLLintBear -->\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <!-- Stop ignoring HTMLLintBear -->\n      <h4 class=\"modal-title\" id=\"my-modal-label\">Advanced Search</h4>\n    </div>\n    <div class=\"modal-body\">\n      <div id=\"filtersearch\" *ngFor=\"let nav of navigation$|async\">\n        <ul class=\"nav nav-sidebar menugroup\">\n          <li style=\"cursor:pointer;cursor: hand;\" data-toggle=\"collapse\" [attr.data-target]=\"'#'+nav.facetname\">\n              <h3>{{nav.displayname}}</h3></li>\n          <li style=\"display: block\" *ngFor=\"let element of nav.elements\">\n            <a (click)=\"changeurl(element.modifier)\" class=\"menu-item-link\">\n              <input type=\"checkbox\">{{element.name}}  {{element.count}}\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Search</button>\n    </div>\n  </div>\n</div>\n\n\n<div id=\"sidebar\" class=\"col-md-3\">\n</div>\n"

/***/ },

/***/ 710:
/***/ function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ },

/***/ 711:
/***/ function(module, exports) {

module.exports = "<nav class=\"navbar navbar-default fixed-bottom\" role=\"navigation\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n                    <span class=\"icon-bar\"></span>\n                        <span class=\"icon-bar\"></span>\n                        <span class=\"icon-bar\"></span>\n                </button>\n  </div>\n  <div class=\"navbar-collapse collapse\">\n    <ul class=\"nav navbar-nav navbar-left\">\n      <li><a routerLink=\"/about\" routerLinkActive=\"active\">About Susper</a></li>\n      <li><a href=\"//blog.fossasia.org\">Blogs</a></li>\n      <li><a href=\"//github.com/fossasia/susper.com\">Code</a></li>\n    </ul>\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li><a href=\"#\">Terms</a></li>\n      <li><a href=\"#\">Contact</a></li>\n    </ul>\n  </div>\n</nav>\n"

/***/ },

/***/ 712:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n    <div class=\"starter-template\">\n        <h2 class=\"yacy\">\n            <img src=\"assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></h2>\n        <h2 class=\"yacy\" id=\"greeting\"></h2>\n        <div id=\"set-susper-default\">\n            <h3>Set Susper as your default search engine on Mozilla!</h3>\n            <ol>\n                <!-- Start ignoring BootLintBear -->\n                <li><button id=\"install-susper\">Install susper</button></li>\n                <li>Mark the checkbox to set Susper as your default search engine</li>\n                <li>Start searching!</li>\n            </ol>\n            <button id=\"cancel-installation\">Cancel</button>\n        </div>\n        <!-- Stop ignoring BootLintBear -->\n        <div id=\"search-bar\">\n            <app-search-bar></app-search-bar>\n        </div>\n        <footer>\n            <!--footer navigation bar goes here-->\n            <app-footer-navbar></app-footer-navbar>\n        </footer>\n    </div>\n    "

/***/ },

/***/ 713:
/***/ function(module, exports) {

module.exports = "<link rel=\"stylesheet\" href=\"//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css\">\n<nav class=\"navbar navbar-fixed-top navbar-default\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\" id=\"navcontainer\">\n            <ul>\n                <li>\n                    <a href=\"/\">\n                        <img class=\"navbar-brand\" src=\"assets/images/susper.svg\">\n                    </a>\n                </li>\n                <li id=\"navbar-search\">\n                    <app-search-bar></app-search-bar>\n                </li>\n            </ul>\n        </div>\n\n        <div class=\"navbar-collapse collapse\" style=\"display:none\" id=\"side-menu\">\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li class=\"dropdown\">\n                    <a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\" data-proofer-ignore><i class=\"fa fa-bars\" aria-hidden=\"true\" style=\"font-size: 2em\"></i></a>\n                    <ul class=\"dropdown-menu\">\n                        <li>\n                            <div class=\"header\" id=\"header-download\">\n                                <a href=\"//blog.fossasia.org\" target=\"_blank\">\n                                    <i class=\"fa fa-newspaper-o\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"blog-icon\"></i>\n                                    <p class=\"header-text\">Blog</p>\n                                </a>\n                            </div>\n                            <div class=\"header\" id=\"header-code\">\n                                <a href=\"//github.com/fossasia/susper.com\" target=\"_blank\">\n                                    <i class=\"fa fa-code\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"code-icon\"></i>\n                                    <p class=\"header-text\">Code</p>\n                                </a>\n                            </div>\n                        </li>\n                        <li>\n                            <div class=\"header\" id=\"header-git\">\n                                <a href=\"//github.com/fossasia/susper.com\" target=\"_blank\">\n                                    <i class=\"fa fa-github\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"github-icon\"></i>\n                                </a>\n                                <p class=\"header-text\">Github</p>\n                            </div>\n                            <div class=\"header\" id=\"header-bugs\">\n                                <a href=\"//github.com/fossasia/susper.com/issues\" target=\"_blank\">\n                                    <i class=\"fa fa-bug\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"bug-icon\"></i>\n                                </a>\n                                <p class=\"header-text\">Bug Reports</p>\n                            </div>\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n\n<script>\n    $(document).ready(function () {\n        var isFirefox = typeof InstallTrigger !== 'undefined';\n        if (isFirefox === false) {\n            $(\"#navbar-search\").addClass(\"align-navsearch-btn\");\n        }\n    }\n</script>"

/***/ },

/***/ 714:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid not-found-banner\">\n  <h2 class=\"yacy\">\n      <a href=\"/\" class=\"susperlogo\" id=\"homepage\">\n      <img src=\"../../assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></a></h2>\n  <h1>404</h1>\n  <h2>Page not found</h2>\n</div>\n<div id=\"search-bar\">\n  <app-search-bar></app-search-bar>\n</div>\n\n"

/***/ },

/***/ 715:
/***/ function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n<div class=\"row\">\n    <div class=\"container-fluid\" id=\"search-options-field\">\n        <ul type=\"none\" id=\"search-options\">\n            <li [class.active_view]=\"Display('all')\" (click)=\"docClick()\">All</li>\n            <li [class.active_view]=\"Display('images')\" (click)=\"imageClick()\">Images</li>\n            <li [class.active_view]=\"Display('videos')\" (click)=\"videoClick()\">Videos</li>\n            <li class=\"dropdown\">\n                <a href=\"#\" id=\"tools\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n                    Tools\n                </a>\n                <ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"tools\" id=\"tool-dropdown\">\n                    <li (click)=\"filterByContext()\">Context Ranking</li>\n                    <li (click)=\"filterByDate()\">Sort by Date</li>\n                    <li data-toggle=\"modal\" data-target=\"#myModal\" (click)=\"advancedsearch()\">Advanced Search</li>\n                </ul>\n            </li>\n        </ul>\n    </div>\n    <div class=\"col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-lg-10 col-lg-offset-1\">\n        <div class=\"container-fluid\" id=\"progress-bar\">\n            {{message}}\n        </div>\n        <div class=\"text-result\" *ngIf=\"Display('all')\">\n            <div *ngFor=\"let item of items$|async let i = index; trackBy: trachHero\" class=\"result\">\n                <div class=\"title\" (mouseover)=\"overTitle()\" (mouseleave)=\"overTitle()\">\n                    <a href=\"{{item.link}}\">{{item.title}}</a>\n                    <div class=\"box\">\n                        <iframe width=\"400px\" height=\"400px\" [src]=\"myUrlList[i]\" scrolling=\"no\"></iframe>\n                    </div>\n                </div>\n                <div class=\"link\">\n                    <p>{{item.link}}</p>\n                </div>\n                <div class=\"description\">\n                    <p>{{item.description}}</p>\n                </div>\n                <div>\n                    {{item.pubDate|date:'fullDate'}}\n                </div>\n            </div>\n        </div>\n        <div class=\"image-result\" *ngIf=\"Display('images')\">\n            <div *ngFor=\"let item of items$|async\">\n                <img class=\"res-img\" src=\"{{item.link}}\" onerror=\"this.style.display='none'\">\n            </div>\n        </div>\n        <div class=\"video-result\" *ngIf=\"Display('videos')\">\n            <div *ngFor=\"let item of items$|async\" class=\"result\">\n                <div class=\"title\">\n                    <a href=\"{{item.path}}\">{{item.title}}</a>\n                </div>\n                <div class=\"link\">\n                    <p>{{item.link}}</p>\n                </div>\n            </div>\n        </div>\n        <br>\n        <div class=\"pagination-property\">\n            <nav aria-label=\"Page navigation\">\n                <ul class=\"pagination\" id=\"pag-bar\">\n                    <li class=\"page-item\"><span class=\"page-link\" href=\"#\" (click)=\"decPresentPage()\">Previous</span></li>\n                    <li class=\"page-item\" *ngFor=\"let num of getNumber(maxPage)\"><span class=\"page-link\" *ngIf=\"presentPage>=4 && num<=noOfPages\" [class.active_page]=\"getStyle(presentPage-3+num)\"\n                            (click)=\"getPresentPage(presentPage-3+num)\" href=\"#\">{{presentPage-3+num}}</span>\n                        <span class=\"page-link\" *ngIf=\"presentPage<4 && num<=noOfPages\" [class.active_page]=\"getStyle(num)\" (click)=\"getPresentPage(num)\"\n                            href=\"#\">{{num+1}}</span></li>\n                    <li class=\"page-item\"><span class=\"page-link\" (click)=\"incPresentPage()\">Next</span></li>\n                </ul>\n            </nav>\n        </div>\n    </div>\n</div>\n<div class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n    <app-advancedsearch></app-advancedsearch>\n</div>\n"

/***/ },

/***/ 716:
/***/ function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear -->\n<form class=\"navbar-form navbar-left\">\n<!-- Stop ignoring BootLintBear -->\n  <div class=\"input-group\" id=\"nav-group\">\n    <input #input type=\"text\" name=\"query\" class=\"form-control\" id=\"nav-input\" (keyup)=\"onquery($event)\"\n           [(ngModel)]=\"searchdata.query\">\n    <div class=\"input-group-btn\">\n      <button class=\"btn btn-default\" id=\"nav-button\" type=\"submit\" (click)=\"submit()\">\n        <i class=\"glyphicon glyphicon-search\"></i>\n      </button>\n    </div>\n  </div>\n</form>\n<script>\n  $(document).ready(function(){\n    var isFirefox = typeof InstallTrigger !== 'undefined';\n    if(isFirefox === false){\n      $(\".input-group-btn\").addClass(\"align-search-btn\");\n    }\n  }\n</script>\n"

/***/ },

/***/ 750:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(406);


/***/ }

},[750]);
//# sourceMappingURL=main.bundle.map