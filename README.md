# susper.com

Susper is a decentralized Search Engine that uses the peer to peer system yacy and Apache Solr to crawl and index search results.

[![Build Status](https://travis-ci.org/fossasia/susper.com.svg?branch=angular)](https://travis-ci.org/fossasia/susper.com?branch=angular)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2ba119419e7444b3b505bb37b4525deb)](https://www.codacy.com/app/shiven15094/susper-com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fossasia/susper.com&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/fossasia/susper.com/badges/gpa.svg?branch=gh-pages)](https://codeclimate.com/github/fossasia/susper.com)
[![codecov](https://codecov.io/gh/fossasia/susper.com/branch/master/graph/badge.svg)](https://codecov.io/gh/fossasia/susper.com)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fossasia/susper.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Communication

Our chat channel is on gitter : https://gitter.im/fossasia/susper.com

## Components and Technology

This is a search front-end for YaCy. Retrieval of search results using YaCy search API and display using AJAX technology.

* Solr, JSON(P) and JavaScript / backbone.js - driven

Search results are displayed using AJAX-technology from a Solr server which is embedded into YaCy. All search results must be provided by a YaCy search server which includes a Solr with a specialized JSON result writer. When a search request is made in one of the search templates, a http request is made to YaCy. The response is done in JSON because that can much better be parsed than XML in JavaScript. To overcome the same orgin policy in JavaScript, the result is capsuled into a JSONP response. This enables you to run YaCy anywhere and to use the results from this server somewhere else, maybe in static web pages, even from a file system. We implemented a proper model view of search results using the MV*-Fra­me­work backbone.js.

* Industry-Strength Search Efficiency

Because the search results come right from a Solr instance using a specialized result writer, these templates can provide industry-strength search portals. This is an unique combination of Solr, JSON(P), flexible JavaScript presentation the beautiful YAML4 CSS Framework and the easiness of web index creation with YaCy.

* Standard Compliance

There are standards for search request queries (i.e. SRU) and search request responses (i.e. opensearch). YaCy provides both! Actually these search templates send SRU requests to YaCy and the jsonp result writer in Solr (inside YaCy) returns a into-JSON transformed version of openseach. If you like, then you can also get search results from the same query url by replacing the "wt=yjson"-parameter by "wt=opensearch".

* Beautiful CSS Framework

These pages are made with the YAML4 CSS Framework and it will serve you very well for the creation of own search portals. Just use the template as provided in the git repository (see below: 'Clone This!') and create your own search portal.

## Technology Stack
##### Components
* HTML - Structure of the web page generated.
* CSS - Styling options and details ofthe web page.
* Javascript(JSON) - Used to store information for deploying the application such as dependencies.
* Angular2 - Structure for deployment of the web page.

## Services and Dependencies
* Bower - The goal is to use [Bower](http://bower.io) to manage front-end dependencies in future.

## Requirements
* [Angular-cli](https://github.com/angular/angular-cli#installation)
* node --version >= 6
* npm --version >= 3

## Installation
First we will need to install angular-cli by using the following command:
```sh
$ npm install -g @angular/cli@latest
```
After installing angular-cli we need to install our required node modules, so we will do that by using the following command:
```sh
$ npm install
```
## How to deploy?
##### Running on localhost:
* **Step 1:** Fork susper repository and clone it to your desktop
* **Step 2:** Then cd into that cloned folder
* **Step 3:** Deploy locally by running this :```$ ng serve```

#### For deploying with [Github Pages](https://pages.github.com/):
With these very simple steps you can have susper deployed:
* **Step 1:** Fork susper repository and clone it to your desktop
* **Step 2:** Then checkout to your master branch `$ git checkout angular`
* **Step 3:** Deploy running this : ```$ ng github-pages:deploy --message "Optional commit message" --base-href="/susper/"```
* **Step 4:** Visit `https://yourusername.github.io/susper` and you should see the search running
* **Step 5:** As you search you might see that that it cant find anything, to resolve this, on search you will see there is a red shield on search bar, click on it and allow to load scripts
* **Step 6:** Reload and you will have a function susper search page deployed with github pages.

## Contributions, Bug Reports, Feature Requests

This is an Open Source project and we would be happy to see contributors who report bugs and file feature requests submitting pull requests as well. Please report issues here https://github.com/fossasia/susper.com/issues .Presently active work is being done on moving susper to angular2 framework , on a separate branch 'angular' .


## Issue and Branch Policy

Before making a pull request, please file an issue. So, other developers have the chance to give feedback or discuss details. Match every pull request with an issue please and add the issue number in description e.g. like "Fixes #123".

We have the following branches
 * **gh-pages**
   This contains shipped code. After significant features/bugfixes are accumulated on development, we make a version update, and make a release.
 * **angular**
 This contains the code that is related to angular2 version of susper, where all the development of converting susper to angular2 framework is being done.If you're making a contribution related to angular issues,
    you are supposed to make a pull request to _angular_.
    PRs must pass a build check and unit-tests check on Travis

## LICENSE

The repository is licensed under Creative Commons Attribution 2.0 License (CC-BY 2.0).

## Maintainers

The project is maintained by
* Michael Christen ([@Orbiter](https://github.com/Orbiter))
* Mario Behling ([@mariobehling](http://github.com/mariobehling))

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Update Angular-CLI

To update Angular-CLI to a new version, you must update both the global package and your project's local package.

Global package

```bash
npm uninstall -g @angular/cli
npm cache clean
npm install -g @angular/cli@latest
```

Local package

```bash
rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
npm install --save-dev @angular/cli@latest
npm install
```

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
