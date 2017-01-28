# 10.2.5

## Bug Fixes

- ([b103850](https://github.com/angular/webdriver-manager/commit/b1038500466fe790cc8e3c2ff82dc3c7eb3796ba))
  fix(update): fix undefined gecko getBoolean error (#113)

  closes #107
- ([7fbacf5](https://github.com/angular/webdriver-manager/commit/7fbacf5bc902dd3ccd1c9fbf285c8ca9a1e48ee3))
  fix(start): set the port when standalone server starts

  closes #106

# 10.2.4

## Bug Fixes

- ([3984ea4](https://github.com/angular/webdriver-manager/commit/3984ea4e5cfd2edf0401a5e5310aecaaecb63555))
  fix(filemanager): respect proxy/ignoreSSL options in contentLength HEAD request (#101)


- ([946ee00](https://github.com/angular/webdriver-manager/commit/946ee005f7d316fd2d404c4bdbeae9a3802051af))
  fix(chrome_driver): use the x64 binary if chrome driver version is greater than 2.23 (#95)

  * fix(chrome_driver): use the x64 binary if chrome driver version is greater than 2.23
  * fix(chrome_driver): add semver to better determine version number
  * refactor(chrome_driver): check first to see if we have valid semver or not

  closes #93
- ([b183fad](https://github.com/angular/webdriver-manager/commit/b183fadd4ae0b47b0773d6979d090c74419ee327))
  fix(filemanager): Binaries can be downloaded from a custom CDN with alternate_cdn(#97)

  closes #96

## Features

- ([5241fc1](https://github.com/angular/webdriver-manager/commit/5241fc14eaf2b5cdf4b35362f260f6973cea0b1e))
  chore(chromedriver): update chromedriver version to 2.24 (#92)

  Chromedriver < 2.24 has issues with Chrome 54+
  (https://bugs.chromium.org/p/chromedriver/issues/detail?id=1451).

- ([61af7be](https://github.com/angular/webdriver-manager/commit/61af7be4edbaf070bdcc35dc85f11fb46ab9577e))
  feat(gecko): Add geckodriver, related config, and flags

  Users will still need 'marionette': true in their capabilities in order to use gecko driver.

# 10.2.3

## Bug Fixes

- ([fa48354](https://github.com/angular/webdriver-manager/commit/fa4835453385d4c79fcbba7bb6d408557c870bae))
  fix(downloader): fix against working proxy (#87)

- ([d6597e8](https://github.com/angular/webdriver-manager/commit/d6597e8a06004888371cca12b8e803c7d44eaf8d))
  fix(start): add the correct flags for windows (#83)

  closes #68
- ([c96090c](https://github.com/angular/webdriver-manager/commit/c96090c0f7cc24209b34f9634699e68669650070))
  fix(update): download standalone with proxy and ignore ssl (#81)

  closes #79

## Features

- ([7ec082a](https://github.com/angular/webdriver-manager/commit/7ec082a1bcc7f262237a616ec96592c36c28b89a))
  feat(start): add a gecko driver path to the start command (#86)

## Dependencies

- ([fe85c94](https://github.com/angular/webdriver-manager/commit/fe85c94e8db0680be25461cd3ea1ef59fc4d8fa4))
  dep(types): update typescript, remove typings in favor of @types (#84)

# 10.2.2

## Bug Fixes

- ([236a8ec](https://github.com/angular/webdriver-manager/commit/236a8ec901133cb21247fc452d7ef7c9d5fed172))
  fix(downloader): increase timeouts and unlink sync on download errors (#75)

  closes #62 and #63
- ([fa20ca8](https://github.com/angular/webdriver-manager/commit/fa20ca82e191b122ed49b144b8ebc53ee3b92a9d))
  fix(start): check if edge driver exists before adding to args (#73)

  closes #60
- ([8b61b71](https://github.com/angular/webdriver-manager/commit/8b61b71410dbca6e205fbc599b954fe61a8ee937))
  fix(start): use ie32 if specified via command line (#72)

  closes #68

## Features

- ([8346858](https://github.com/angular/webdriver-manager/commit/83468588fc21f7584b76a8c55afe659db045a4c9))
  feat(logging): add logging property to selenium standalone (#76)

  closes #61
- ([18f9f1d](https://github.com/angular/webdriver-manager/commit/18f9f1dfea02cd8f5c5a2cd5f09130f0ca24f68a))
  chore(selenium): add dev/urandom to selenium start args to prevent startup delays in linux


# 10.2.1

upgrade to latest chrome driver and selenium standalone server versions

# 10.2.0

- ([aa1b8b7](https://github.com/angular/webdriver-manager/commit/aa1b8b7cd9295f02b9bf69274e21eef1a7f3b7f0))
  feat(ios): iOS support (#57)

# 10.1.0

## Bug Fixes

- ([81c2aa3](https://github.com/angular/webdriver-manager/commit/81c2aa3ea6435934797b4d10c6734945484a641d))
  fix(iedriver): download url fix for iedriver (#54)

  closes #53

## Features

- ([57372eb](https://github.com/angular/webdriver-manager/commit/57372ebd076f6b1ccaf41d920601e867b7b3084c))
  feat(edge): add Microsoft Edge support in CLI (#56)

  closes #55
- ([d937245](https://github.com/angular/webdriver-manager/commit/d9372459c51a1aec553a79edaa32e497608a65de))
  feat(android): support android

# 10.0.4

## Dependency Upgrades

- ([970167a](https://github.com/angular/webdriver-manager/commit/970167a1b2db24fc8ca34db2994507ef0187ee7e))
  dep(typings): update typings (#42)

## Bug Fixes

- ([5073e23](https://github.com/angular/webdriver-manager/commit/5073e230574237047dd593a702f08f84907871bd))
  fix(folder): fix selenium folder location (#43)

# 10.0.3

## Bug Fixes

- ([d3724fb](https://github.com/angular/webdriver-manager/commit/d3724fbd9f6b0ceb481538f7f8f0088c8b004959))
  fix(config): simplify locating configuration file, selenium folder (#41)

  * Let the bin file decide which webdriver-manager to use
  * Use the configuration file / package from the default position
  * Selenium folder will always be located to webdriver-manager/selenium/

# 10.0.2

## Bug Fixes

- ([5bca026](https://github.com/angular/webdriver-manager/commit/5bca0266118dcabf2e2782820e5c9095f6d16ed4))
  fix(config): configuration file local look up when used as a dependency (#33)

  closes #32
- ([0cfcc88](https://github.com/angular/webdriver-manager/commit/0cfcc88f1383c400f72ea5e49f9600ff652f8214))
  fix(binary): Fix typo in fallback case when chalk isn't available.


# 10.0.1

## Bug Fixes

- ([a6f1edd](https://github.com/angular/webdriver-manager/commit/a6f1edd782251c96d35e79a3bb78b70c2b137aa9))
  fix(global): fix finding config.json for global installs and release 10.0.1 (#23)

# 10.0.0


## Bug Fixes

- ([70d32df](https://github.com/angular/webdriver-manager/commit/70d32df659f19510c25e97ea9a42c7f93813d448))
  fix(dir): check selenium dir and warn user that the folder does not exist (#17)

- ([0ec1443](https://github.com/angular/webdriver-manager/commit/0ec14435379161259435edc7c766388941f1a846))
  fix(binary): file type, unzipping, and permissions

  closes #7, #16

- ([a073fd0](https://github.com/angular/webdriver-manager/commit/a073fd0e9d0290e52ac3a808643b069c71b196c3))
  fix(npm): use global, local, and project without env

  closes #20


- ([6ccb9d8](https://github.com/angular/webdriver-manager/commit/6ccb9d8b9ac6daf79388c44e6d53f1d3d71fd3f8))
  fix(versions): versions option should stay consistent with existing webdriver-manager

  closes #6

- ([c34b05c](https://github.com/angular/webdriver-manager/commit/c34b05cc66849708a2fc515bc455a6a661c867d6))
  fix(bin): local, project, and global usage

- ([4a0caf5](https://github.com/angular/webdriver-manager/commit/4a0caf5a69cacda01df87d4b4cc35092e519d267))
  fix(dep): fix dependency for chalk

- ([15ae0e8](https://github.com/angular/webdriver-manager/commit/15ae0e815270c8af2441002492e3165edd3140df))
  fix(chmod): set permissions to 755

([1820fbc](https://github.com/angular/webdriver-manager/commit/1820fbc46ddc45b70911fb1678f1d99247ec7028))
  Initial commit

## Features

- ([374c3e7](https://github.com/angular/webdriver-manager/commit/374c3e719fce18a2f0a1b751b19bffb7d266cc69))
  feat(length): on update, check to see the file is the correct length

  closes #8
- ([8c47291](https://github.com/angular/webdriver-manager/commit/8c472918ac73390890bbc39fcc4c7a2e86d3b262))
  feat(local): use the local version of webdriver-tool if it is installed

  closes #5

- ([f0622d2](https://github.com/angular/webdriver-manager/commit/f0622d2e173b68e4afcd409f9c0356c8a1c2652a))
  feat(logs): add chrome logs command line option


  closes #11
- ([3b30312](https://github.com/angular/webdriver-manager/commit/3b303129040b17292028452f13c73d62736f1216))
  feat(logger): update logging methods (#5)
