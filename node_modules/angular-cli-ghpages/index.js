var path = require('path'),
  fs = require('fs'),
  fse = require('fs-extra'),
  ghpages = require('gh-pages'),
  denodeify = require('denodeify');

exports.run = function (options) {

  options = options || {};

  if (options.dryRun) {
    console.log('*** Dry-run: No changes are applied at all. ***')
  }

  if (options.name && options.email) {
    options.user = {
      name: options.name,
      email: options.email
    }
  };

  // gh-pages: forwards messages to console
  options.logger = function (message) { console.log(message + "\n"); }

  var dir = path.join(process.cwd(), options.dir);

  if (process.env.TRAVIS) {
    options.message += ' -- ' + process.env.TRAVIS_COMMIT_MESSAGE + ' \n\n' +
      'Triggered by commit: https://github.com/' + process.env.TRAVIS_REPO_SLUG + '/commit/' + process.env.TRAVIS_COMMIT + '\n' +
      'Travis build: https://travis-ci.org/' + process.env.TRAVIS_REPO_SLUG + '/builds/' + process.env.TRAVIS_BUILD_ID;
  }

  // for your convenience - here you can hack credentials into the repository URL
  if (process.env.GH_TOKEN && options.repo) {
    options.repo = options.repo.replace('GH_TOKEN', process.env.GH_TOKEN);
  }

  // always clean the cache directory.
  // avoids "Error: Remote url mismatch."
  if (options.dryRun) {
    console.info('Dry-run / SKIPPED: cleaning of the cache directory');
  } else {
    ghpages.clean();
  }

  var access = publish = denodeify(fs.access);
  var publish = denodeify(ghpages.publish);

  function go() {
    return Promise.resolve();
  }

  return go()
    .then(function checkIfDistFolderExists() {
      return access(dir, fs.F_OK)
    })
    .catch(function handleMissingDistFolder(error) {
      console.error('Dist folder does not exist. Check the dir --dir parameter or build the project first!\n');
      return Promise.reject(error);
    })
    .then(function createNotFoundPage() {

      if (options.dryRun) {
        console.info('Dry-run / SKIPPED: copying of index.html to 404.html');
        return;
      }

      // Note:
      // There is no guarantee that there will be an index.html file,
      // as the developer may specify a custom index file.
      const indexHtml = path.join(dir, 'index.html');
      const notFoundPage = path.join(dir, '404.html');

      return fse.copy(indexHtml, notFoundPage).
        catch(function () {
          console.info('index.html could not be copied to 404.html. Continuing without an error.');
          return;
        })
    })
    .then(function publishViaGhPages() {
      if (options.dryRun) {
        console.info('Dry-run / SKIPPED: publishing to "' + dir + '" with the following options:', {
          dir: dir,
          repo: options.repo || 'undefined: current working directory (which must be a git repo in this case) will be used to commit & push',
          message: options.message,
          branch: options.branch,
          user: options.user || 'undefined: local or gloabl git username & email properties will be taken',
          noSilent: options.noSilent || 'undefined: logging is in silent mode by default',
          noDotfiles: options.noDotfiles || 'undefined: dotfiles are included by default',
          dryRun: options.dryRun
        });
        return;
      }

      return publish(dir, options)
    })
    .then(function showSuccess() {
      console.log('Successfully published!\n');
    })
    .catch(function showError(error) {
      console.error('An error occurred!\n', error);
      return Promise.reject(error);
    });
};
