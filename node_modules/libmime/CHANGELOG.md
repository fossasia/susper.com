# Changelog

## v3.0.0 2016-12-08

  * Updated encoded-word generation. Previously a minimal value was encoded, so it was possible to have multiple encoded words in a string separated by non encoded-words. This was an issue with some webmail clients that stripped out the non-encoded parts between encoded-words so the updated method uses wide match by encoding from the first word with unicode characters to the last word. "a =?b?= c =?d?= e" -> "a =?bcd?= e"

## v2.1.3 2016-12-08

  * Revert dot as a special symbol

## v2.1.2 2016-11-21

  * Quote special symbols as defined in RFC (surajwy)

## v2.1.1 2016-11-15

  * Fixed issue with special symbols in attachment filenames

## v2.1.0 2016-07-24

  * Changed handling of base64 encoded mime words where multiple words are joined together if possible. This fixes issues with multi byte characters getting split into different mime words (against the RFC but occurs)

## v2.0.3 2016-02-29

  * Fixed an issue with rfc2231 filenames

## v2.0.2 2016-02-11

  * Fixed an issue with base64 mime words encoding

## v2.0.1 2016-02-11

  * Fix base64 mime-word encoding. Final string length was calculated invalidly

## v2.0.0 2016-01-04

  * Replaced jshint with eslint
  * Refactored file structure

## v1.2.1 2015-10-05

Added support for emojis in header params (eg. filenames)

## v1.2.0 2015-10-05

Added support for emojis in header params (eg. filenames)

## v1.1.0 2015-09-24

Updated encoded word encoding with quoted printable, should be more like required in https://tools.ietf.org/html/rfc2047#section-5

## v1.0.0 2015-04-15

Changed versioning scheme to use 1.x instead of 0.x versions. Bumped dependency versions, no actual code changes.

## v0.1.7 2015-01-19

Updated unicode filename handling – only revert to parameter continuation if the value actually includes
non-ascii characters or is too long. Previously filenames were encoded if they included anything
besides letters, numbers, dot or space.

## v0.1.6 2014-10-25

Fixed an issue with `encodeWords` where a trailing space was invalidly included in a word if the word
ended with an non-ascii character.

## v0.1.5 2014-09-12

Do not use quotes for continuation encoded filename parts. Fixes an issue with Gmail where the Gmail webmail keeps the charset as part of the filename.
