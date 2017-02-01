webpackJsonp([0,3],{

/***/ 328:
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
            template: __webpack_require__(663),
            styles: [__webpack_require__(658)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/app.component.js.map

/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(672);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(673);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
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
    function SearchService(http, jsonp) {
        this.http = http;
        this.jsonp = jsonp;
        this.server = 'yacy.searchlab.eu';
        this.searchURL = 'http://' + this.server + '/solr/select?callback=?';
        this.suggestUrl = 'http://' + this.server + '/suggest.json?callback=?';
        this.homepage = 'http://susper.com';
        this.logo = '../images/susper.svg';
    }
    SearchService.prototype.getsearchresults = function (searchquery) {
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
            .get('http://yacy.searchlab.eu/solr/select', { search: params }).map(function (res) {
            console.log(res.json()[0].channels[0].items);
            return res;
        });
    };
    SearchService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Jsonp */]) === 'function' && _b) || Object])
    ], SearchService);
    return SearchService;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/search.service.js.map

/***/ },

/***/ 381:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 381;


/***/ },

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__polyfills_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(499);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_40" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/main.js.map

/***/ },

/***/ 498:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__navbar_navbar_component__ = __webpack_require__(501);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index_index_component__ = __webpack_require__(500);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__results_results_component__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_router__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__search_service__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_common__ = __webpack_require__(83);
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
                __WEBPACK_IMPORTED_MODULE_10__not_found_not_found_component__["a" /* NotFoundComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["b" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_11__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["d" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["e" /* JsonpModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_router__["c" /* RouterModule */].forRoot(appRoutes)
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

/***/ 499:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(498);
/* unused harmony namespace reexport */
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.js.map

/***/ },

/***/ 500:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(104);
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
            startRecord: 0,
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
            template: __webpack_require__(664),
            styles: [__webpack_require__(659)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], IndexComponent);
    return IndexComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/index.component.js.map

/***/ },

/***/ 501:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(104);
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
            startRecord: 0,
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
        this.router.navigate(['/search', this.searchdata]);
    };
    NavbarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-navbar',
            template: __webpack_require__(665),
            styles: [__webpack_require__(660)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NavbarComponent);
    return NavbarComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/navbar.component.js.map

/***/ },

/***/ 502:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(104);
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
            template: __webpack_require__(666),
            styles: [__webpack_require__(661)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], NotFoundComponent);
    return NotFoundComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/not-found.component.js.map

/***/ },

/***/ 503:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search_service__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(104);
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
    function ResultsComponent(searchservice, route, activatedroute) {
        var _this = this;
        this.searchservice = searchservice;
        this.route = route;
        this.activatedroute = activatedroute;
        this.items = [];
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
        this.activatedroute.queryParams.subscribe(function (query) {
            _this.presentPage = query['start'] / _this.searchdata.rows;
            _this.searchdata.query = query['query'];
            _this.searchdata.sort = query['sort'];
            _this.begin = Number(query['start']) + 1;
            searchservice.getsearchresults(query).subscribe(function (res) {
                _this.items = res.json()[0].channels[0].items;
                _this.totalResults = Number(res.json()[0].channels[0].totalResults);
                _this.end = Math.min(_this.totalResults, _this.begin + _this.searchdata.rows - 1);
                _this.message = 'showing results ' + _this.begin + ' to ' + _this.end + ' of ' + _this.totalResults;
                _this.noOfPages = Math.ceil(_this.totalResults / _this.searchdata.rows);
                _this.maxPage = Math.min(_this.searchdata.rows, _this.noOfPages);
            });
        });
        this.message = 'loading...';
        this.presentPage = 0;
        this.start = (this.presentPage) * this.searchdata.rows;
        this.begin = this.start + 1;
        this.end = Math.min(this.totalResults, this.begin + this.searchdata.rows - 1);
    }
    ResultsComponent.prototype.getNumber = function (N) {
        return Array.apply(null, { length: N }).map(Number.call, Number);
    };
    ;
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
    ResultsComponent.prototype.imageClick = function () {
        this.imageDisplay = true;
        this.searchdata.rows = 100;
        this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
        this.route.navigate(['/search'], { queryParams: this.searchdata });
    };
    ResultsComponent.prototype.docClick = function () {
        this.imageDisplay = false;
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
    ResultsComponent.prototype.ngOnInit = function () {
        this.presentPage = 0;
    };
    ResultsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'app-results',
            template: __webpack_require__(667),
            styles: [__webpack_require__(662)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__search_service__["a" /* SearchService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]) === 'function' && _c) || Object])
    ], ResultsComponent);
    return ResultsComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/results.component.js.map

/***/ },

/***/ 504:
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

/***/ 505:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(519);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(518);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(516);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(517);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(515);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(520);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(686);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/home/travis/build/fossasia/susper.com/repo/src/polyfills.js.map

/***/ },

/***/ 658:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 659:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 660:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 661:
/***/ function(module, exports) {

module.exports = ".not-found-banner{\n    text-align: center;\n    margin: 0 auto;\n    background: url(../../assets/images/not-found-bg.jpg);\n    background-size: cover;\n    height: 300px;\n    width: 100%;\n}\n.not-found-banner h1{\n    font-size: 72px;\n}\n.not-found-banner h2{\n    font-size: 22px;\n    letter-spacing: 10px;\n}\n"

/***/ },

/***/ 662:
/***/ function(module, exports) {

module.exports = ".result{\n  padding: 10px;\n}\n.title >a{\n  color:blue;\n  font-size: medium;\n  font-weight: bold;\n  text-decoration:none;\n}\n\n.link >a{\n  color:#3c7a3c;\n  text-decoration:none;\n}\n.link, .title >a:hover{\n  text-decoration: underline;\n}\n.page-link{\n  cursor: pointer;\n}\n\n#progressBar{\n  background-color: #f5f5f5;\n  margin-top: 1%;\n}\n\n.dropdown-menu > li {\n  padding: 5px;\n  text-align: center;\n  text-decoration: none;\n}\n\n.dropdown-menu > li :hover{\n  background-color: #f5f5f5;\n}\n.dropdown-menu > li :active{\n  background-color: #1c65ba;\n  color: white;\n}\n\n.active_page{\n  background-color: #bdcdd4;\n}\n\nimg.resImg{\n  width: 250px;\n  height: 300px;\n  padding: 0.2%;\n  float: left;\n}\n"

/***/ },

/***/ 663:
/***/ function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n<router-outlet></router-outlet>\n"

/***/ },

/***/ 664:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n  <div class=\"starter-template\">\n\n    <h2 class=\"yacy\"><a href=\"http://yacy.net\" class=\"yacylogo\" id=\"homepage\"><img src=\"assets/images/susper.svg\"\n                                                                                   alt=\"YaCy\" id=\"biglogo\"\n                                                                                   style=\"margin: auto;\"/></a></h2>\n    <h2 class=\"yacy\" id=\"greeting\"></h2>\n    <form class=\"search form-inline\" id=\"searchform\">\n      <fieldset class=\"maininput\">\n        <div class=\"input-group\">\n          <input name=\"query\" id=\"search\" type=\"text\" size=\"40\" maxlength=\"80\" value=\"\" autofocus=\"autofocus\"\n                 onFocus=\"this.select()\" placeholder=\"Search susper\" class=\"form-control searchinput typeahead\"\n                 [(ngModel)]=\"searchdata.query\"/>\n          <div class=\"input-group-btn\">\n            <button id=\"Enter\" name=\"Enter\" (click)=\"submit()\" class=\"btn btn-primary\" type=\"submit\">Search</button>\n          </div>\n        </div>\n      </fieldset>\n    </form>\n  </div>\n</div>\n"

/***/ },

/***/ 665:
/***/ function(module, exports) {

module.exports = "<nav class=\"navbar navbar-fixed-top navbar-default\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <img class=\"navbar-brand\" src=\"assets/images/susper.svg\">\n\n    </div>\n\n    <div class=\"navbar-collapse collapse\">\n      <form class=\"navbar-form navbar-left\">\n        <div class=\"input-group\">\n          <input type=\"text\" name=\"query\" class=\"form-control\" placeholder=\"Search\" [(ngModel)]=\"searchdata.query\">\n          <div class=\"input-group-btn\">\n            <button class=\"btn btn-default\" type=\"submit\" (click)=\"submit()\">\n              <i class=\"glyphicon glyphicon-search\"></i>\n            </button>\n          </div>\n        </div>\n      </form>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li id=\"header_help\" class=\"dropdown\">\n          <a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\"><span\n            class=\"glyphicon glyphicon-question-sign\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li id=\"header_profile\"><a href=\"yacysearch/about.html\">About This Page</a></li>\n            <li id=\"header_tutorial\"><a href=\"http://yacy.net/tutorials/\">YaCy Tutorials</a></li>\n            <li class=\"divider\"></li>\n            <li id=\"header_download\"><a href=\"http://yacy.net\" target=\"_blank\"><i>external</i>&nbsp;&nbsp;&nbsp;Download\n              YaCy</a></li>\n            <li id=\"header_community\"><a href=\"http://forum.yacy.de\" target=\"_blank\"><i>external</i>&nbsp;&nbsp;&nbsp;Community\n              (Web Forums)</a></li>\n            <li id=\"header_wiki\"><a href=\"http://wiki.yacy.de\" target=\"_blank\"><i>external</i>&nbsp;&nbsp;&nbsp;Project\n              Wiki</a></li>\n            <li id=\"header_git\"><a href=\"https://github.com/yacy/yacy_search_server/commits/master\" target=\"_blank\"><i>external</i>&nbsp;&nbsp;&nbsp;Git\n              Repository</a></li>\n            <li id=\"header_bugs\"><a href=\"http://bugs.yacy.net\" target=\"_blank\"><i>external</i>&nbsp;&nbsp;&nbsp;Bugtracker</a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n"

/***/ },

/***/ 666:
/***/ function(module, exports) {

module.exports = "\n<div class=\"container-fluid not-found-banner\">\n    <h2 class=\"yacy\"><a href=\"http://yacy.net\" class=\"yacylogo\" id=\"homepage\"><img src=\"../../assets/images/susper.svg\" alt=\"YaCy\" id=\"biglogo\" style=\"margin: auto;\"/></a></h2>\n    <h1>404</h1>\n    <h2>Page not found</h2>\n</div>\n\n    <form class=\"search form-inline\"  id=\"searchform\" >\n      <fieldset class=\"maininput\">\n        <div class=\"input-group\">\n          <input name=\"query\" id=\"search\" type=\"text\" size=\"40\" maxlength=\"80\" value=\"\" autofocus=\"autofocus\" onFocus=\"this.select()\" class=\"form-control searchinput typeahead\" [(ngModel)]=\"searchdata.query\"/>\n          <div class=\"input-group-btn\">\n            <button id=\"Enter\" name=\"Enter\" (click)=\"submit()\" class=\"btn btn-primary\" type=\"submit\">Search</button>\n          </div>\n        </div>\n      </fieldset>\n      </form>\n"

/***/ },

/***/ 667:
/***/ function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-1\">\n      <p>SIDEBAR</p>\n    </div>\n    <div class=\"col-md-11\">\n      <div class=\"btn-group\">\n        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n          Search Tools <span class=\"caret\"></span></button>\n        <ul class=\"dropdown-menu\" role=\"menu\">\n          <li><span class=\"page-link\" (click)=\"filterByContext()\"> Context Ranking</span></li>\n          <li><span class=\"page-link\" (click)=\"filterByDate()\"> Sort by Date</span></li>\n        </ul>\n      </div>\n      <div class=\"btn-group\">\n        <button type=\"button\" class=\"btn btn-default\" [class.active_page]=\"!imageDisplay\" (click)=\"docClick()\">\n          Documents\n        </button>\n        <button type=\"button\" class=\"btn btn-default\" [class.active_page]=\"imageDisplay\" (click)=\"imageClick()\">Images\n        </button>\n      </div>\n      <div class=\"container-fluid\" id=\"progressBar\">\n        {{message}}\n      </div>\n      <div class=\"text-result\" *ngIf=\"!imageDisplay\">\n        <div *ngFor='let item of items' class='result'>\n          <div class='title'>\n            <a href='{{item.path}}'>{{item.title}}</a>\n          </div>\n          <div class='link'>\n            <a href='{{item.link}}'>{{item.link}}</a>\n          </div>\n          <div>\n            {{item.pubDate|date:'fullDate'}}\n          </div>\n        </div>\n      </div>\n      <div class=\"image-result\" *ngIf=\"imageDisplay\">\n        <div *ngFor='let item of items'>\n          <img class=\"resImg\" src=\"{{item.link}}\">\n        </div>\n      </div>\n      <br/>\n      <nav aria-label=\"Page navigation\">\n        <ul class=\"pagination\">\n          <li class=\"page-item\"><span class=\"page-link\" href=\"#\" (click)=\"decPresentPage()\">Previous</span></li>\n          <li class=\"page-item\" *ngFor=\"let num of getNumber(maxPage)\"><span class=\"page-link\"\n                                                                             *ngIf=\"presentPage>=4 && num<=noOfPages\"\n                                                                             [class.active_page]=\"getStyle(presentPage-3+num)\"\n                                                                             (click)=\"getPresentPage(presentPage-3+num)\"\n                                                                             href=\"#\">{{presentPage-3+num}}</span>\n            <span class=\"page-link\" *ngIf=\"presentPage<4 && num<=noOfPages\" [class.active_page]=\"getStyle(num)\"\n                  (click)=\"getPresentPage(num)\" href=\"#\">{{num+1}}</span></li>\n          <li class=\"page-item\"><span class=\"page-link\" (click)=\"incPresentPage()\">Next</span></li>\n        </ul>\n      </nav>\n    </div>\n  </div>\n</div>\n\n\n"

/***/ },

/***/ 687:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(382);


/***/ }

},[687]);
//# sourceMappingURL=main.bundle.map