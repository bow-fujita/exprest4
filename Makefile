#
# exprest4
# Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
# MIT License
#

SHELL := /bin/bash
.SUFFIXES:

.PHONY: all
all:
#	Do nothing


NODE_MODULES := node_modules

MOCHA := $(shell which mocha 2> /dev/null)
ifeq ($(MOCHA),)
MOCHA := $(NODE_MODULES)/mocha/bin/mocha
endif

ifeq ($(wildcard $(MOCHA)),)
$(error You must run `npm install`)
endif

ifneq ($(filter coverage coveralls,$(MAKECMDGOALS)),)
# Use _mocha instead of mocha for istanbul
# https://github.com/gotwarlost/istanbul/issues/44 
MOCHA := $(shell which _mocha 2> /dev/null)
ifeq ($(MOCHA),)
MOCHA := $(NODE_MODULES)/mocha/bin/_mocha
endif

ISTANBUL := $(shell which istanbul 2> /dev/null)
ifeq ($(ISTANBUL),)
ISTANBUL := $(NODE_MODULES)/istanbul/lib/cli.js
endif

ifeq ($(wildcard $(ISTANBUL)),)
$(error You must run `npm install`)
endif
endif # $(MAKECMDGOALS) == coverage|coveralls

ifneq ($(filter coveralls,$(MAKECMDGOALS)),)
COVERALLS := $(shell which coveralls 2> /dev/null)
ifeq ($(COVERALLS),)
COVERALLS := $(NODE_MODULES)/coveralls/bin/coveralls.js
endif

ifeq ($(wildcard $(COVERALLS)),)
$(error You must run `npm install`)
endif
endif # $(MAKECMDGOALS) == coveralls


TEST_DIR := test
COVERAGE_DIR := coverage
LCOV_INFO := $(COVERAGE_DIR)/lcov.info

MOCHA_OPTIONS := --opts $(TEST_DIR)/mocha.opts $(TEST_DIR)/suites

export NODE_ENV := test
export APP_ROOT := $(CURDIR)


.PHONY: check
check:
	$(MOCHA) $(MOCHA_OPTIONS)

.PHONY: coverage
coverage: clean
	$(ISTANBUL) cover $(MOCHA) -- $(MOCHA_OPTIONS)

.PHONY: coveralls
coveralls: clean $(LCOV_INFO)
	cat $(LCOV_INFO) | $(COVERALLS)

$(LCOV_INFO):
	$(ISTANBUL) cover $(MOCHA) --report lcovonly -- $(MOCHA_OPTIONS)

.PHONY: clean
clean:
	rm -rf $(COVERAGE_DIR)
