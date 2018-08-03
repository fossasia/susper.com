.PHONY: compile clean install

compile:
	./node_modules/.bin/coffee --bare --output lib --compile src

clean:
	rm -rf node_modules

install:
	npm install

test:
	./node_modules/.bin/mocha ./lib/test
