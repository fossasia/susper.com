# Changelog

## v1.0.1 2016-02-06

  * If the input string includes an unexpected < which messes up address part, then truncate unexpected data (similar to OSX Mail)

## v1.0.0 2016-01-11

  * Start using semver compatible versioning scheme, starting from v1.0.0
  * Replaced jshint with eslint
  * Dropped node 0.8 from the test targets. Should still work though

## v0.3.2 2015-01-07

  * Added changelog
  * Allow semicolon (;) as address separator in addition to comma (,). Backport from https://github.com/whiteout-io/addressparser/pull/5
