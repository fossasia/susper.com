
Webdriver Manager [![Build Status](https://travis-ci.org/angular/webdriver-manager.png?branch=master)](https://travis-ci.org/angular/webdriver-manager) [![Join the chat at https://gitter.im/angular/webdriver-manager](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular/webdriver-manager?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
=================

A selenium server and browser driver manager for your end to end tests. This is the same tool as `webdriver-manager` from the [Protractor](https://github.com/angular/protractor) repository.

**Note:** Version 9 and lower please reference [pose/webdriver-manager](https://github.com/pose/webdriver-manager). If there are features that existed in version 9 and lower, please open up an issue with the missing feature or a create a pull request.

Getting Started
---------------

```
npm install -g webdriver-manager
```

Setting up a Selenium Server
----------------------------

Prior to starting the selenium server, download the selenium server jar and driver binaries. By default it will download the selenium server jar and chromedriver binary.

```
webdriver-manager update
```

Starting the Selenium Server
----------------------------

By default, the selenium server will run on `http://localhost:4444/wd/hub`.


```
webdriver-manager start
```

Other useful commands
---------------------

View different versions of server and driver files:

```
webdriver-manager status
```

Clear out the server and driver files. If `webdriver-manager start` does not work, try to clear out the saved files.

```
webdriver-manager clean
```

Mobile Support
--------------

See [`mobile.md`](mobile.md).
