# susper.com

Susper is a decentral Search Engine that uses the peer to peer system yacy and Apache Solr to crawl and index search results.

[![Build Status](https://travis-ci.org/fossasia/susper.com.svg?branch=gh-pages)](https://travis-ci.org/fossasia/susper.com?branch=gh-pages)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c5b7e2ca3e4640c9b38e2f3274072583)](https://www.codacy.com/app/dev_19/open-event-webapp?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fossasia/open-event-webapp&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/fossasia/open-event-webapp/badges/gpa.svg?branch=development)](https://codeclimate.com/github/fossasia/open-event-webapp)
[![codecov](https://codecov.io/gh/fossasia/susper.com/branch/gh-pages/graph/badge.svg)](https://codecov.io/gh/fossasia/gh-pages)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fossasia/susper.com?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##Communication

Our chat channel is on gitter here: https://gitter.im/fossasia/susper.com

## Components and Technology

This is a search front-end for YaCy. Retrieval of search results using YaCys search API and display using AJAX technology.

* Solr, JSON(P) and JavaScript / backbone.js - driven

Search results are displayed using AJAX-technology from a Solr server which is embedded into YaCy. All search results must be provided by a YaCy search server which includes a Solr with a specialized JSON result writer. When a search request is made in one of the search templates, a http request is made to YaCy. The response is done in JSON because that can much better be parsed than XML in JavaScript. To overcome the same orgin policy in JavaScript, the result is capsuled into a JSONP response. This enables you to run YaCy anywhere and to use the results from this server somewhere else, maybe in static web pages, even from a file system. We implemented a proper model view of search results using the MV*-Fra­me­work backbone.js.

* Industry-Strength Search Efficiency

Because the search results come right from a Solr instance using a specialized result writer, these templates can provide industry-strength search portals. This is an unique combination of Solr, JSON(P), flexible JavaScript presentation the beautiful YAML4 CSS Framework and the easiness of web index creation with YaCy.

* Standard Compliance

There are standards for search request queries (i.e. SRU) and search request responses (i.e. opensearch). YaCy provides both! Actually these search templates send SRU requests to YaCy and the jsonp result writer in Solr (inside YaCy) returns a into-JSON transformed version of openseach. If you like, then you can also get search results from the same query url by replacing the "wt=yjson"-parameter by "wt=opensearch".

* Beautiful CSS Framework

These pages are made with the YAML4 CSS Framework and it will serve you very well for the creation of own search portals. Just use the template as provided in the git repository (see below: 'Clone This!') and create your own search portal.

## Installation

### How do I install on a Server

Please check out [the documentation here](/docs/INSTALLATION.md).

### How do I install on my local machine

Please check out [the documentation here](/docs/INSTALLATION_LOCAL.md).

### How do I install on Google Cloud

To install the system on Google Cloud please refer to the [Google Cloud installation readme](/docs/INSTALLATION_GOOGLE.md).

#### How do I install on AWS

To install the system on AWS please refer to the [AWS installation readme](/docs/INSTALLATION_AWS.md).

#### How do I install on Digital Ocean

To install the system on Digital Ocean please refer to the [Digital Ocean installation readme](/docs/INSTALLATION_DIGITALOCEAN.md).

#### How do I deploy Web App Generator with Heroku

Please read how to deploy to [Heroku here](/docs/INSTALLATION_HEROKU.md)  


## Contributions, Bug Reports, Feature Requests

This is an Open Source project and we would be happy to see contributors who report bugs and file feature requests submitting pull requests as well. Please report issues here https://github.com/fossasia/susper.com/issues


## Issue and Branch Policy

Before making a pull request, please file an issue. So, other developers have the chance to give feedback or discuss details. Match every pull request with an issue please and add the issue number in description e.g. like "Fixes #123".

We have the following branches   
 * **development**   
	 All development goes on in this branch. If you're making a contribution,
	 you are supposed to make a pull request to _development_.
	 PRs must pass a build check and unit-tests check on Travis
 * **gh-pages**   
   This contains shipped code. After significant features/bugfixes are accumulated on development, we make a version update, and make a release.


## LICENSE

The repository is licensed under Creative Commons Attribution 2.0 License (CC-BY 2.0).

## Maintainers

The project is maintained by
* Michael Christen ([@Orbiter](https://github.com/Orbiter))
* Mario Behling ([@mariobehling](http://github.com/mariobehling))

