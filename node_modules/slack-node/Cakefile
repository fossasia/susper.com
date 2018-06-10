# ** Cakefile Template ** is a Template for a common Cakefile that you may use in a coffeescript nodejs project.
# 
# It comes baked in with 5 tasks:
#
# * build - compiles your src directory to your lib directory
# * watch - watches any changes in your src directory and automatically compiles to the lib directory
# * test  - runs mocha test framework, you can edit this task to use your favorite test framework
# * docs  - generates annotated documentation using docco
# * clean - clean generated .js files
files = [
  'lib'
  'src'
]

fs = require 'fs'
{print} = require 'util'
{spawn, exec} = require 'child_process'

try
  which = require('which').sync
catch err
  if process.platform.match(/^win/)?
    console.log 'WARNING: the which module is required for windows\ntry: npm install which'
  which = null

# ANSI Terminal Colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
reset = '\x1b[0m'
red = '\x1b[0;31m'

# Cakefile Tasks
#
# ## *docs*
#
# Generate Annotated Documentation
#
# <small>Usage</small>
#
# ```
# cake docs
# ```
task 'docs', 'generate documentation', -> docco()

# ## *build*
#
# Builds Source
#
# <small>Usage</small>
#
# ```
# cake build
# ```
task 'build', 'compile source', -> build -> log ":)", green

# ## *watch*
#
# Builds your source whenever it changes
#
# <small>Usage</small>
#
# ```
# cake watch
# ```
task 'watch', 'compile and watch', -> build true, -> log ":-)", green

# ## *test*
#
# Runs your test suite.
#
# <small>Usage</small>
#
# ```
# cake test
# ```
task 'test', 'run tests', -> build -> mocha -> log ":)", green

# ## *clean*
#
# Cleans up generated js files
#
# <small>Usage</small>
#
# ```
# cake clean
# ```
task 'clean', 'clean generated files', -> clean -> log ";)", green


# Internal Functions
#
# ## *walk* 
#
# **given** string as dir which represents a directory in relation to local directory
# **and** callback as done in the form of (err, results)
# **then** recurse through directory returning an array of files
#
# Examples
#
# ``` coffeescript
# walk 'src', (err, results) -> console.log results
# ```
walk = (dir, done) ->
  results = []
  fs.readdir dir, (err, list) ->
    return done(err, []) if err
    pending = list.length
    return done(null, results) unless pending
    for name in list
      file = "#{dir}/#{name}"
      try
        stat = fs.statSync file
      catch err
        stat = null
      if stat?.isDirectory()
        walk file, (err, res) ->
          results.push name for name in res
          done(null, results) unless --pending
      else
        results.push file
        done(null, results) unless --pending

# ## *log* 
# 
# **given** string as a message
# **and** string as a color
# **and** optional string as an explanation
# **then** builds a statement and logs to console.
# 
log = (message, color, explanation) -> console.log color + message + reset + ' ' + (explanation or '')

# ## *launch*
#
# **given** string as a cmd
# **and** optional array and option flags
# **and** optional callback
# **then** spawn cmd with options
# **and** pipe to process stdout and stderr respectively
# **and** on child process exit emit callback if set and status is 0
launch = (cmd, options=[], callback) ->
  cmd = which(cmd) if which
  app = spawn cmd, options
  app.stdout.pipe(process.stdout)
  app.stderr.pipe(process.stderr)
  app.on 'exit', (status) ->
    if status is 0
      callback()
    else
      process.exit(status);

# ## *build*
#
# **given** optional boolean as watch
# **and** optional function as callback
# **then** invoke launch passing coffee command
# **and** defaulted options to compile src to lib
build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false

  options = ['-c', '-b', '-o' ]
  options = options.concat files
  options.unshift '-w' if watch
  launch 'coffee', options, callback

# ## *unlinkIfCoffeeFile*
#
# **given** string as file
# **and** file ends in '.coffee'
# **then** convert '.coffee' to '.js'
# **and** remove the result
unlinkIfCoffeeFile = (file) ->
  if file.match /\.coffee$/
    fs.unlink file.replace('src','lib').replace(/\.coffee$/, '.js'), ->
    true
  else false

# ## *clean*
#
# **given** optional function as callback
# **then** loop through files variable
# **and** call unlinkIfCoffeeFile on each
clean = (callback) ->
  try
    for file in files
      unless unlinkIfCoffeeFile file
        walk file, (err, results) ->
          for f in results
            unlinkIfCoffeeFile f

    callback?()
  catch err

# ## *moduleExists*
#
# **given** name for module
# **when** trying to require module
# **and** not found
# **then* print not found message with install helper in red
# **and* return false if not found
moduleExists = (name) ->
  try 
    require name 
  catch err 
    log "#{name} required: npm install #{name}", red
    false


# ## *mocha*
#
# **given** optional array of option flags
# **and** optional function as callback
# **then** invoke launch passing mocha command
mocha = (options, callback) ->
  #if moduleExists('mocha')
  if typeof options is 'function'
    callback = options
    options = []
  # add coffee directive
  options.push '--compilers'
  options.push 'coffee:coffee-script'
  
  launch 'mocha', options, callback

# ## *docco*
#
# **given** optional function as callback
# **then** invoke launch passing docco command
docco = (callback) ->
  #if moduleExists('docco')
  walk 'src', (err, files) -> launch 'docco', files, callback

