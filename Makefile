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

-include Makefile.local

NODE_MODULES := node_modules
REQUIRED_MODULES :=

ifeq ($(NO_COVERAGE),yes)

MOCHA := $(shell which mocha 2> /dev/null)
ifeq ($(MOCHA),)
MOCHA := $(NODE_MODULES)/mocha/bin/mocha
REQUIRED_MODULES += $(MOCHA)
endif

else # $(NO_COVERAGE) != yes

# Use _mocha instead of mocha for istanbul
# https://github.com/gotwarlost/istanbul/issues/44 
MOCHA := $(shell which _mocha 2> /dev/null)
ifeq ($(MOCHA),)
MOCHA := $(NODE_MODULES)/mocha/bin/_mocha
REQUIRED_MODULES += $(MOCHA)
endif

ISTANBUL := $(shell which istanbul 2> /dev/null)
ifeq ($(ISTANBUL),)
ISTANBUL := $(NODE_MODULES)/istanbul/lib/cli.js
REQUIRED_MODULES += $(ISTANBUL)
endif

endif # $(NO_COVERAGE) != yes

ifneq ($(filter coveralls,$(MAKECMDGOALS)),)
COVERALLS := $(shell which coveralls 2> /dev/null)
ifeq ($(COVERALLS),)
COVERALLS := $(NODE_MODULES)/coveralls/bin/coveralls.js
REQUIRED_MODULES += $(COVERALLS)
endif
endif # $(MAKECMDGOALS) == coveralls

$(REQUIRED_MODULES):
	npm install


TEST_DIR := test
COVERAGE_DIR := coverage
LCOV_INFO := $(COVERAGE_DIR)/lcov.info

MOCHA_OPTIONS := --opts $(TEST_DIR)/mocha.opts $(TEST_DIR)/suites

export NODE_ENV := test
export APP_ROOT := $(CURDIR)

.PHONY: showenv
showenv:
ifneq ($(NO_SHOWENV),yes)
	@echo '#'
	@echo '# Environment Variables'
	@echo '#'
	@env | sort
	@echo
endif

.PHONY: check
check: clean showenv | $(REQUIRED_MODULES)
ifeq ($(NO_COVERAGE),yes)
	$(MOCHA) $(MOCHA_OPTIONS)
else
	$(ISTANBUL) cover $(MOCHA) -- $(MOCHA_OPTIONS)
endif

.PHONY: coveralls
coveralls: showenv clean | $(REQUIRED_MODULES)
	$(ISTANBUL) cover $(MOCHA) --report lcovonly -- $(MOCHA_OPTIONS)
	cat $(LCOV_INFO) | $(COVERALLS)

.PHONY: clean
clean:
	rm -rf $(COVERAGE_DIR)

