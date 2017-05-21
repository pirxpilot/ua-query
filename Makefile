check: lint test

lint:
	./node_modules/.bin/jshint *.js lib test

# test separately for browser and node environment
test:
	./node_modules/.bin/mocha --recursive --require should test/ua-query.js
	./node_modules/.bin/mocha --recursive --require should test/ua-query-browser.js

.PHONY: check lint test
