UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = "/*! jshashes - New BSD License - https://github.com/h2non/jshashes */"

build:
	$(UGLIFYJS) hashes.js --mangle --preamble $(BANNER) > hashes.min.js

loc:
	wc -l hashes.js

publish: test build
	git push --tags origin HEAD:master
	npm publish
