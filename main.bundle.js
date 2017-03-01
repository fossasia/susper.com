webpackJsonp([0,3],{

/***/ 156:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect__ = __webpack_require__(711);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reselect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__ = __webpack_require__(522);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ngrx_core_compose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__ = __webpack_require__(695);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ngrx_store_freeze__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search__ = __webpack_require__(539);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__query__ = __webpack_require__(538);
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
            template: __webpack_require__(705),
            styles: [__webpack_require__(698)]
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(718);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(719);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__polyfills_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(534);





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
            template: __webpack_require__(704),
            styles: [__webpack_require__(697)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */]) === 'function' && _c) || Object])
    ], AdvancedsearchComponent);
    return AdvancedsearchComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/advancedsearch.component.js.map

/***/ },

/***/ 533:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__ = __webpack_require__(536);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index_index_component__ = __webpack_require__(535);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__results_results_component__ = __webpack_require__(540);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__search_service__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_common__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__advancedsearch_advancedsearch_component__ = __webpack_require__(532);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngrx_store_devtools__ = __webpack_require__(528);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ngrx_store__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__reducers_index__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__ = __webpack_require__(541);
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
                __WEBPACK_IMPORTED_MODULE_16__search_bar_search_bar_component__["a" /* SearchBarComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["b" /* BrowserModule */],
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

/***/ 534:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(533);
/* unused harmony namespace reexport */
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.js.map

/***/ },

/***/ 535:
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
            template: __webpack_require__(706),
            styles: [__webpack_require__(699)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], IndexComponent);
    return IndexComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.component.js.map

/***/ },

/***/ 536:
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
            template: __webpack_require__(707),
            styles: [__webpack_require__(700)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NavbarComponent);
    return NavbarComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/navbar.component.js.map

/***/ },

/***/ 537:
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
            template: __webpack_require__(708),
            styles: [__webpack_require__(701)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NotFoundComponent);
    return NotFoundComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/not-found.component.js.map

/***/ },

/***/ 538:
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

/***/ 539:
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

/***/ 540:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_service__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reducers__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(42);
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
        this.activatedroute.queryParams.subscribe(function (query) {
            if (query['fq']) {
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
        });
        this.presentPage = 0;
    }
    ResultsComponent.prototype.getNumber = function (N) {
        return Array.apply(null, { length: N }).map(Number.call, Number);
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
        this.resultDisplay = 'videos';
        this.searchdata.rows = 10;
        this.searchdata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+gif)';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.imageClick = function () {
        this.resultDisplay = 'images';
        this.searchdata.rows = 100;
        this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.docClick = function () {
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
            template: __webpack_require__(709),
            styles: [__webpack_require__(702)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* Store */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ChangeDetectorRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* ChangeDetectorRef */]) === 'function' && _e) || Object])
    ], ResultsComponent);
    return ResultsComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/results.component.js.map

/***/ },

/***/ 541:
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
            template: __webpack_require__(710),
            styles: [__webpack_require__(703)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__ngrx_store__["a" /* Store */]) === 'function' && _c) || Object])
    ], SearchBarComponent);
    return SearchBarComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search-bar.component.js.map

/***/ },

/***/ 542:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(549);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(551);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(550);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(548);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(547);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(543);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(553);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(546);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(554);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(552);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(557);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(743);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/polyfills.js.map

/***/ },

/***/ 697:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 698:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 699:
/***/ function(module, exports) {

module.exports = ".starter-template{\n  margin-top: 10%;\n}\n\n#search-bar{\n  position: absolute;\n}\n\n#set-susper-default{\n  display:none;\n}\n\n@media screen and (max-width: 480px) {\n  #set-susper-default h3{\n    font-size: 14px;\n  }\n  #set-susper-default ol{\n    font-size: 12px;\n  }\n  #install-susper{\n    font-size: 12px;\n  }\n  #cancel-installation{\n    font-size: 12px;\n  }\n}\n"

/***/ },

/***/ 700:
/***/ function(module, exports) {

module.exports = "\n#nav-group{\n  left:10%;\n}\n#nav-input{\n  width: 550px;\n  height: 40px;\n  border-radius: 0px;\n}\n#nav-button{\n  border-left: none;\n  border-radius: 0px;\n  height: 40px;\n  background-color: white;\n  color: #5C5254;\n}\nnavbar-brand{\n  width: 170%;\n}\n.menu-image{\n\n  width: 60px;\n  height: 50px;\n}\n.menu-drop-image{\n  width: 25px;\n  height: auto;\n}\n.header{\n  display:inline-table;\n  width: 60px;\n  padding: 4%;\n  padding-left: 8%;\n  padding-right: 8%;\n  text-align: center;\n}\n.header-text{\n  font-size: small;\n  width: inherit;\n  text-align: center;\n}\n.dropdown-menu{\n  width: 400px;\n}\n\n#tutorial-icon {\n    padding-left: 15px;\n}\n\n#github-icon {\n    padding-left: 5px;\n}\n\n#bug-icon {\n    padding-left: 10px;\n}\n"

/***/ },

/***/ 701:
/***/ function(module, exports) {

module.exports = ".not-found-banner{\n    text-align: center;\n    margin: 0 auto;\n    background: url(../../assets/images/not-found-bg.jpg);\n    background-size: cover;\n    height: 300px;\n    width: 100%;\n    position: relative;\n    top:-57px;\n}\n.not-found-banner h1{\n    font-size: 72px;\n}\n.not-found-banner h2{\n    font-size: 22px;\n    letter-spacing: 10px;\n}\n\n#search-bar{\n  position: absolute;\n  left: 300px;\n}\n"

/***/ },

/***/ 702:
/***/ function(module, exports) {

module.exports = ".result{\n  padding-left: 100px;\n  padding-top: 30px;\n}\n.title >a{\n  color:darkblue;\n  font-size: large;\n  text-decoration:none;\n}\n\n.link > p{\n  color:#006621;\n  text-decoration:none;\n}\n.title >a:hover{\n  text-decoration: underline;\n}\n.page-link{\n  cursor: pointer;\n}\n\n#progress-bar{\n  margin-top: 1%;\n  font-size: small;\n  color: #88aaaa;\n  padding-left: 100px;\n}\n\n.dropdown-menu > li {\n  font-size: small;\n  padding: 5px;\n  text-align: center;\n  text-decoration: none;\n}\n\n.dropdown-menu > li :hover{\n  padding: 10px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #f5f5f5;\n}\n.dropdown-menu > li :active{\n  padding: 5px;\n  padding-right: 20px;\n  padding-left: 20px;\n  background-color: #1c65ba;\n  color: white;\n}\n\n.active_page{\n  background-color: #bdcdd4;\n}\n.active_view{\n  color: #50a1ff;\n}\n\nimg.res-img{\n  max-width: 350px;\n  max-height: 300px;\n  padding-top: 20px;\n  padding: 0.6%;\n  float: left;\n}\n#search-options{\n  margin-top: 1.75%;\n  margin-bottom: 0%;\n  padding-left: 70px;\n}\n#search-options .btn{\n  border: none;\n  background: none;\n  font-size: small;\n}\n#search-tools .btn{\n  border: none;\n  background: none;\n  font-size: small;\n}\n\n#pag-bar{\n    padding-left: 100px;\n    padding-top: 20px;\n}\n\n.pagination-property {\n    max-width: 300px;\n}\n\n.image-result {\n    padding-left: 80px;\n}\n"

/***/ },

/***/ 703:
/***/ function(module, exports) {

module.exports = "#nav-input{\n  width: 40vw;\n  height: 40px;\n  border-radius: 0px;\n}\n\n#nav-button{\n  border-left: none;\n  border-radius: 0px;\n  height: 40px;\n  background-color: white;\n  color: #0066ff;\n}\n\n#nav-group{\n  left: 60%;\n}\n\n@media screen and (min-width: 1920px) {\n  #nav-group{\n    left: 65%;\n  }\n}\n\n@media screen and (max-width: 991px) {\n  #nav-group{\n    left: 35%;\n  }\n  #nav-input{\n    width: 50vw;\n  }\n}\n\n@media screen and (max-width: 767px) {\n  #nav-group{\n    left: 4%;\n  }\n  #nav-input{\n    width: 80vw;\n  }\n}\n\n@media screen and (max-width: 479px) {\n  #nav-group{\n    left: 2%;\n  }\n  #nav-input{\n    width: 80vw;\n  }\n}\n\n@media screen and (max-width: 359px) {\n  #nav-group{\n    left: 0%;\n  }\n  #nav-input{\n    width: 80vw;\n  }\n}\n"

/***/ },

/***/ 704:
/***/ function(module, exports) {

module.exports = "<div class=\"modal-dialog\" role=\"document\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <!-- Start ignoring HTMLLintBear -->\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <!-- Stop ignoring HTMLLintBear -->\n      <h4 class=\"modal-title\" id=\"my-modal-label\">Advanced Search</h4>\n    </div>\n    <div class=\"modal-body\">\n      <div id=\"filtersearch\" *ngFor=\"let nav of navigation$|async\">\n        <ul class=\"nav nav-sidebar menugroup\">\n          <li style=\"cursor:pointer;cursor: hand;\" data-toggle=\"collapse\" [attr.data-target]=\"'#'+nav.facetname\">\n              <h3>{{nav.displayname}}</h3></li>\n          <li style=\"display: block\" *ngFor=\"let element of nav.elements\">\n            <a (click)=\"changeurl(element.modifier)\" class=\"menu-item-link\">\n              <input type=\"checkbox\">{{element.name}}  {{element.count}}\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n      <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Search</button>\n    </div>\n  </div>\n</div>\n\n\n<div id=\"sidebar\" class=\"col-md-3\">\n</div>\n"

/***/ },

/***/ 705:
/***/ function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ },

/***/ 706:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n    <div class=\"starter-template\">\n        <h2 class=\"yacy\">\n            <img src=\"assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></h2>\n        <h2 class=\"yacy\" id=\"greeting\"></h2>\n        <div id=\"set-susper-default\">\n            <h3>Set Susper as your default search engine on Mozilla!</h3>\n            <ol>\n                <!-- Start ignoring BootLintBear -->\n                <li><button id=\"install-susper\">Install susper</button></li>\n                <li>Mark the checkbox to set Susper as your default search engine</li>\n                <li>Start searching!</li>\n            </ol>\n            <button id=\"cancel-installation\">Cancel</button>\n        </div>\n        <!-- Stop ignoring BootLintBear -->\n        <div id=\"search-bar\">\n            <app-search-bar></app-search-bar>\n        </div>\n  </div>\n"

/***/ },

/***/ 707:
/***/ function(module, exports) {

module.exports = "<link rel=\"stylesheet\" href=\"//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css\">\n    <nav class=\"navbar navbar-fixed-top navbar-default\">\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header\">\n                <a href=\"/\">\n                    <img class=\"navbar-brand\" src=\"assets/images/susper.svg\">\n                </a>\n            </div>\n            <div class=\"navbar-collapse collapse\">\n                <app-search-bar></app-search-bar>\n                <ul class=\"nav navbar-nav navbar-right\">\n                    <li class=\"dropdown\">\n                        <a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\" data-proofer-ignore><i class=\"fa fa-bars\" aria-hidden=\"true\" style=\"font-size: 2em\"></i></a>\n                        <ul class=\"dropdown-menu\">\n                            <li id=\"header-profile\"><a href=\"yacysearch/about.html\">About This Page</a></li>\n                            <li class=\"divider\"></li>\n                            <li>\n                                <div class=\"header\" id=\"header-download\">\n                                    <a href=\"//yacy.net\" target=\"_blank\">\n                                        <i class=\"fa fa-download\" aria-hidden=\"true\" style=\"font-size: 4em\"></i>\n                                        <p class=\"header-text\">Download</p>\n                                    </a>\n                                </div>\n                                <div class=\"header\" id=\"header-community\">\n                                    <a href=\"//forum.yacy.de\" target=\"_blank\">\n                                        <i class=\"fa fa-users\" aria-hidden=\"true\" style=\"font-size: 4em\"></i>\n                                    </a>\n                                    <p class=\"header-text\">Community</p>\n                                </div>\n                                <div class=\"header\" id=\"header-wiki\">\n                                    <a href=\"//wiki.yacy.de\" target=\"_blank\">\n                                        <i class=\"fa fa-wikipedia-w\" aria-hidden=\"true\" style=\"font-size: 4em\"></i>\n                                    </a>\n                                    <p class=\"header-text\">Wiki</p>\n                                </div>\n                            </li>\n                            <li>\n                                <div class=\"header\" id=\"header-git\">\n                                    <a href=\"//github.com/yacy/yacy_search_server/commits/master\" target=\"_blank\">\n                                        <i class=\"fa fa-github\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"github-icon\"></i>\n                                    </a>\n                                    <p class=\"header-text\">Github</p>\n                                </div>\n                                <div class=\"header\" id=\"header-bugs\">\n                                    <a href=\"//bugs.yacy.net\" target=\"_blank\">\n                                        <i class=\"fa fa-bug\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"bug-icon\"></i>\n                                    </a>\n                                    <p class=\"header-text\">Bug</p>\n                                </div>\n                                <div class=\"header\">\n                                    <a href=\"//yacy.net/tutorials/\">\n                                        <i class=\"fa fa-play\" aria-hidden=\"true\" style=\"font-size: 4em\" id=\"tutorial-icon\"></i>\n                                    </a>\n                                    <p class=\"header-text\"> Tutorial</p>\n                                </div>\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </nav>\n"

/***/ },

/***/ 708:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid not-found-banner\">\n  <h2 class=\"yacy\">\n      <a href=\"/\" class=\"susperlogo\" id=\"homepage\">\n      <img src=\"../../assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"></a></h2>\n  <h1>404</h1>\n  <h2>Page not found</h2>\n</div>\n<div id=\"search-bar\">\n  <app-search-bar></app-search-bar>\n</div>\n\n"

/***/ },

/***/ 709:
/***/ function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n    <div class=\"container\">\n        <!-- Start ignoring BootLintBear -->\n        <div class=\"row\">\n            <div class=\"col-md-offset-1\">\n                <!-- Stop ignoring BootLintBear -->\n            </div>\n            <div class=\"col-md-11\">\n                <div class=\"btn-group\" id=\"search-options\">\n                    <button type=\"button\" class=\"btn btn-default\" [class.active_view]=\"Display('all')\" (click)=\"docClick()\">\n                        All\n                    </button>\n                    <button type=\"button\" class=\"btn btn-default\" [class.active_view]=\"Display('images')\" (click)=\"imageClick()\">Images</button>\n                    <button type=\"button\" class=\"btn btn-default\" [class.active_view]=\"Display('videos')\" (click)=\"videoClick()\">Videos</button>\n                    <div class=\"btn-group\">\n                        <button type=\"button\" class=\"btn btn-default\" id=\"tools\" data-toggle=\"collapse\" data-target=\"#search-tools\">\n                            Tools <span class=\"caret\"></span></button>\n                    </div>\n                </div>\n                <div class=\"collapse\" id=\"search-tools\">\n                    <button class=\"btn btn-default\" (click)=\"filterByContext()\" type=\"button\"> Context Ranking</button>\n                    <button class=\"btn btn-default\" (click)=\"filterByDate()\" type=\"button\"> Sort by Date</button>\n                    <button class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#myModal\" (click)=\"advancedsearch()\" type=\"button\"> Advanced Search</button>\n                </div>\n                <hr>\n                <div class=\"container-fluid\" id=\"progress-bar\">\n                    {{message}}\n                </div>\n                <div class=\"text-result\" *ngIf=\"Display('all')\">\n                    <div *ngFor=\"let item of items$|async\" class=\"result\">\n                        <div class=\"title\">\n                            <a href=\"{{item.link}}\">{{item.title}}</a>\n                        </div>\n                        <div class=\"link\">\n                            <p>{{item.link}}</p>\n                        </div>\n                        <div>\n                            {{item.pubDate|date:'fullDate'}}\n                        </div>\n                    </div>\n                </div>\n                <div class=\"image-result\" *ngIf=\"Display('images')\">\n                    <div *ngFor=\"let item of items$|async\">\n                        <img class=\"res-img\" src=\"{{item.link}}\">\n                    </div>\n                </div>\n                <div class=\"video-result\" *ngIf=\"Display('videos')\">\n                    <div *ngFor=\"let item of items\" class=\"result\">\n                        <div class=\"title\">\n                            <a href=\"{{item.path}}\">{{item.title}}</a>\n                        </div>\n                        <div class=\"link\">\n                            <p>{{item.link}}</p>\n                        </div>\n                    </div>\n                </div>\n                <br>\n                <div class=\"pagination-property\">\n                    <nav aria-label=\"Page navigation\">\n                        <ul class=\"pagination\" id=\"pag-bar\">\n                            <li class=\"page-item\"><span class=\"page-link\" href=\"#\" (click)=\"decPresentPage()\">Previous</span></li>\n                            <li class=\"page-item\" *ngFor=\"let num of getNumber(maxPage)\"><span class=\"page-link\"\n                                                                             *ngIf=\"presentPage>=4 && num<=noOfPages\"\n                                                                             [class.active_page]=\"getStyle(presentPage-3+num)\"\n                                                                             (click)=\"getPresentPage(presentPage-3+num)\"\n                                                                             href=\"#\">{{presentPage-3+num}}</span>\n                                <span class=\"page-link\" *ngIf=\"presentPage<4 && num<=noOfPages\" [class.active_page]=\"getStyle(num)\"\n                  (click)=\"getPresentPage(num)\" href=\"#\">{{num+1}}</span></li>\n                            <li class=\"page-item\"><span class=\"page-link\" (click)=\"incPresentPage()\">Next</span></li>\n                        </ul>\n                    </nav>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"modal fade\" id=\"my-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n        <app-advancedsearch></app-advancedsearch>\n    </div>\n\n\n\n"

/***/ },

/***/ 710:
/***/ function(module, exports) {

module.exports = "<!-- Start ignoring BootLintBear -->\n<form class=\"navbar-form navbar-left\">\n<!-- Stop ignoring BootLintBear -->\n  <div class=\"input-group\" id=\"nav-group\">\n    <input #input type=\"text\" name=\"query\" class=\"form-control\" id=\"nav-input\" placeholder=\"Search\" (keyup)=\"onquery($event)\"\n           [(ngModel)]=\"searchdata.query\">\n    <div class=\"input-group-btn\">\n      <button class=\"btn btn-default\" id=\"nav-button\" type=\"submit\" (click)=\"submit()\">\n        <i class=\"glyphicon glyphicon-search\"></i>\n      </button>\n    </div>\n  </div>\n</form>\n"

/***/ },

/***/ 744:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(406);


/***/ }

},[744]);
//# sourceMappingURL=main.bundle.map