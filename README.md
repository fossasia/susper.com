# susper.com

Susper is a decentralized Search Engine that uses the peer to peer system yacy and Apache Solr to crawl and index search results.

[![Build Status](https://travis-ci.org/fossasia/susper.com.svg?branch=master)](https://travis-ci.org/fossasia/susper.com)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2ba119419e7444b3b505bb37b4525deb)](https://www.codacy.com/app/shiven15094/susper-com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fossasia/susper.com&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/fossasia/susper.com/badges/gpa.svg?branch=gh-pages)](https://codeclimate.com/github/fossasia/susper.com)
[![codecov](https://codecov.io/gh/fossasia/susper.com/branch/master/graph/badge.svg)](https://codecov.io/gh/fossasia/susper.com)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fossasia/susper.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


[![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/?repo=https://github.com/fossasia/susper.com) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/fossasia/susper.com)

## Communication

Our chat channel is on gitter: https://gitter.im/fossasia/susper.com

## Components and Technology

This is a front-end for Susper running on Yacy server. The retrieval of search results is done using YaCy search API.

* Solr and Javascript(JSON)

Search results are displayed using Solr server which is embedded into YaCy. All search results must be provided by a YaCy search server which includes a Solr with a specialized JSON result writer. When a search request is made in one of the search templates, an HTTP request is made to YaCy. The response is done in JSON because that can much better be parsed than XML in JavaScript. To overcome the same origin policy in JavaScript, the result is capsuled into a JSONP response.

## Technology Stack
* HTML - Structure of the web page generated.
* Bootstrap-3.3.7 - Used for responsive design
* CSS - Styling options and details of the web page.
* Javascript(JSON) - Used to store information for deploying the application such as dependencies.
* Angular-4 - Structure for deployment of the web page.

## Requirements
* [Angular-cli](https://github.com/angular/angular-cli#installation)
* node --version >= 6
* npm --version >= 3

## Installation
First, we will need to install angular-cli by using the following command:
```sh
$ npm install -g @angular/cli@latest
```
After installing angular-cli we need to install our required node modules, so we will do that by using the following command:
```sh
$ npm install
```
## How to deploy?
### Running on localhost:
* **Step 1:** Fork susper repository and clone it to your desktop
* **Step 2:** Then cd into that cloned folder
* **Step 3:** Deploy locally by running this:```$ ng serve```
* **Step 4:** Go to localhost:4200 where the application will be running locally.

### For deploying with [Github Pages](https://pages.github.com/):
With these very simple steps you can have susper deployed:

* **Step 1:** Fork susper repository and clone it to your desktop.
* **Step 2:** Then checkout to your master branch `$ git checkout master`
* **Step 3:** Deploy running this: ```ng build``` and then ```npm run deploy```
* **Step 4:** Visit `https://yourusername.github.io/susper` and you should see the Susper search running.
* **Step 5:** As you search you might see that it cant find anything, to resolve this, on search you will see there is a red shield on the search bar, click on it and allow to load unsafe scripts.
* **Step 6:** Reload and you will have a fully functioning Susper search deployed on GitHub pages.

### For deploying with [Surge](https://surge.sh/):

Surge will automatically generate deployment link whenever a pull request passes 
CI. 

Suppose pull request number is 200 and it passes Travis CI. The deployment link can be found here: `https://pr-200-fossasia-susper.surge.sh`

## Contributions, Bug Reports, Feature Requests

This is an Open Source project and we would be happy to see contributors who report bugs and file feature requests submitting pull requests as well. Please report issues here https://github.com/fossasia/susper.com/issues

## Contributions Best Practices

**Commits**
* Write clear meaningful git commit messages (Do read http://chris.beams.io/posts/git-commit/)
* Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged. (More info at https://github.com/blog/1506-closing-issues-via-pull-requests )
* When you make very very minor changes to a PR of yours (like for example fixing a failing Travis build or some small style corrections or minor changes requested by reviewers) make sure you squash your commits afterwards so that you don't have an absurd number of commits for a very small fix. (Learn how to squash at https://davidwalsh.name/squash-commits-git )
* When you're submitting a PR for a UI-related issue, it would be really awesome if you add a screenshot of your change or a link to a deployment where it can be tested out along with your PR. It makes it very easy for the reviewers and you'll also get reviews quicker.

**Feature Requests and Bug Reports**
* When you file a feature request or when you are submitting a bug report to the [issue tracker](https://github.com/fossasia/susper.com/issues), make sure you add steps to reproduce it. Especially if that bug is some weird/rare one.

**Join the development**
* Before you join development, please set up the project on your local machine, run it and go through the application completely. Press any button you can find and see where it leads to. Explore. (Don't worry ... Nothing will happen to the app or to you due to the exploring :wink Only thing that will happen is, you'll be more familiar with what is where and might even get some cool ideas on how to improve various aspects of the app.)
* If you would like to work on an issue, drop in a comment at the issue. If it is already assigned to someone, but there is no sign of any work being done, please free to drop in a comment so that the issue can be assigned to you if the previous assignee has dropped it entirely.

Do read the [Open Source Developer Guide and Best Practices at FOSSASIA](https://blog.fossasia.org/open-source-developer-guide-and-best-practices-at-fossasia).


## Issue and Branch Policy

Before making a pull request, please file an issue. So, other developers have the chance to give feedback or discuss details. Match every pull request with an issue please and add the issue number in description e.g. like "Fixes #123".

We have the following branches:
 * **gh-pages**
   This branch contains the auto-generated build artifacts of the master branch that is generated by Travis. The build artifacts on this branch are used to build the site on susper.com .
 * **master**
 This contains the code that is related to Angular-4 version of Susper. If you're making a contribution related to Angular issues, you are supposed to make a pull request to _master_. PRs must pass a build check and unit-tests check on Travis.

## LICENSE

The repository is licensed under Creative Commons Attribution 2.0 License (CC-BY 2.0).

## Maintainers

The project is maintained by
* Michael Christen ([@Orbiter](https://github.com/Orbiter))
* Mario Behling ([@mariobehling](https://github.com/mariobehling))

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component component-name` to generate a new component. You can also use `ng g directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artefacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

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

## Extras
### Add Susper as default Search Engine in Google Chrome
![](https://media.giphy.com/media/JJW5Aj8LRIGbu/giphy.gif)
