SHELL := /bin/bash
PATH  := $(shell npm bin):$(PATH)
TRACEUR_OPTS = --experimental --modules commonjs
TEST_SRC = $(wildcard test-src/*)
TEST_FILES := $(patsubst test-src/%,test-lib/%,$(TEST_SRC))


lib/%.js: src/%.js
	traceur $(TRACEUR_OPTS) --out $@ $<
	echo 'require("traceur/bin/traceur-runtime");' | cat - $@ > /tmp/out && mv /tmp/out $@

test-lib/%.js: test-src/%.js
	traceur $(TRACEUR_OPTS) --out $@ $<
	echo 'require("traceur/bin/traceur-runtime");' | cat - $@ > /tmp/out && mv /tmp/out $@

all: lib/index.js

test: all $(TEST_FILES)
	mocha -u exports $(TEST_FILES)

readme.md: src/index.js
	sug convert $<
	mv index.md readme.md

.PHONY: test
