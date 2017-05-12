var path = require('path'),
  fs = require('fs'),
  ghpages = require('gh-pages'),
  denodeify = require('denodeify');

exports.run = function (options) {

  options = options || {};

  //console.log('SILENT:', options.silent);
  //console.log('DOTFILES:', options.dotfiles);

  if (options['name'] && options['email']) {
    options.user = {
      name: options['name'],
      email: options['email']
    }
  };

  // gh-pages: forwards messages to console
  options.logger = function (message) { console.log(message + "\n"); }

  var dir = path.join(process.cwd(), options.dir);

  if (process.env.TRAVIS) {
    options.message += '\n\n' +
      'Triggered by commit: https://github.com/' + process.env.TRAVIS_REPO_SLUG + '/commit/' + process.env.TRAVIS_COMMIT + '\n' +
      'Travis build: https://travis-ci.org/' + process.env.TRAVIS_REPO_SLUG + '/builds/' + process.env.TRAVIS_BUILD_ID;
  }

  // for your convenience - here you can hack credentials into the repository URL
  if (process.env.GH_TOKEN && options.repo) {
    options.repo = options.repo.replace('GH_TOKEN', process.env.GH_TOKEN);
  }

  // always clean the cache directory.
  // avoids "Error: Remote url mismatch."
  ghpages.clean();

  var access = publish = denodeify(fs.access);
  var publish = denodeify(ghpages.publish);

  function go() {
    return Promise.resolve();
  }

  return go()
    .then(function () {
      return access(dir, fs.F_OK)
    })
    .catch(function (error) {
      console.error('Dist folder does not exist. Check the dir --dir parameter or build the project first!\n');
      return Promise.reject(error);
    })
    .then(function () {
      return publish(dir, options)
    })
    .then(function () {
      console.log('Successfully published!\n');
    })
    .catch(function (error) {
      console.error('An error occurred!\n');
      return Promise.reject(error);
    });
};
