# Changelog

## 3.3.2 2016-09-05

  * Fetch envelope from message object

## v3.3.0 2016-09-05

  * Updated dependencies

## v3.2.0 2016-07-08

  * If the first MX fails, then try the next one

## v3.1.0 2016-05-11

  * Bumped dependencies

## v3.0.7 2016-04-11

  * Upgraded smtp-connection to fix issues with internationalized email addresses

## v3.0.5 2016-02-17

  * Yet another smtp-connection bump

## v3.0.4 2016-02-16

  * Yet another smtp-connection bump to get proxied sockets working

## v3.0.3 2016-02-15

  * Bumped smtp-connection dependency to fix an issue with proxied sockets and TLS

## v3.0.2 2016-02-13

  * Fixed an issue with proxy support

## v3.0.1 2016-02-11

  * Bumped dependencies

## v3.0.0 2016-02-11

  * Bumped dependencies
  * Always try to use STARTTLS first and fallback to plaintext if it fails

## v2.1.1 2016-02-10

  * Bumped dependencies

## v2.1.0 2016-02-09

  * Added new option `getSocket`

## v2.0.1 2016-01-20

  * Bumped dependencies

## v2.0.0 2016-01-04

  * Locked dependencies

## v2.0.0-beta.1 2016-01-04

  * Fixed invalid source ulr in package.json

## v2.0.0-beta.0 2016-01-04

  * Replaced jshint with eslint
  * Replaced logger interface. Instead of emitting 'log' events, use a bunyan-compatible logger
  * Support IPv6 literal addresses

## v1.1.0 2015-10-08

If MX record is not found, fallback to A or AAAA

## v1.0.2 2015-03-09

Bumped smtp-connection version and replaced simplesmtp based tests with smtp-server based ones.

## v1.0.0 2014-07-30

Fixed a bug with stream buffering. Uses [mail.resolveContent](https://github.com/andris9/Nodemailer#resolvecontent) provided by Nodemailer v1.1.

As the change includes a method from Nodemailer 1.1 and not 1.0, then changed the version scheme to use proper semver instead of 0.x.
