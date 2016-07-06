SRC = index.js $(wildcard scripts/*.js) $(wildcard utils/*.js)

test: $(SRC)
	@node_modules/.bin/eslint $^

PHONY: test
