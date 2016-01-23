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

TEST_DIR := test
COVERAGE_DIR := coverage
NODE_MODULES := node_modules
NODE_MODULES_BIN := $(NODE_MODULES)/.bin
REQUIRED_MODULES :=

MOCHA_OPTIONS := --opts $(TEST_DIR)/mocha.opts $(TEST_DIR)/suites

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
MOCHA := $(NODE_MODULES_BIN)/_mocha
REQUIRED_MODULES += $(MOCHA)
endif

ISTANBUL := $(shell which istanbul 2> /dev/null)
ifeq ($(ISTANBUL),)
ISTANBUL := $(NODE_MODULES_BIN)/istanbul
REQUIRED_MODULES += $(ISTANBUL)
endif

ifeq ($(TRAVIS),true)
COVERALLS := $(shell which coveralls 2> /dev/null)
ifeq ($(COVERALLS),)
COVERALLS := $(NODE_MODULES_BIN)/coveralls
REQUIRED_MODULES += $(COVERALLS)
endif

ISTANBUL_OPTIONS := --report lcovonly
LCOV_INFO := $(COVERAGE_DIR)/lcov.info
endif # $(TRAVIS) == true

endif # $(NO_COVERAGE) != yes

$(REQUIRED_MODULES):
	npm install


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
	$(ISTANBUL) cover $(MOCHA) $(ISTANBUL_OPTIONS) -- $(MOCHA_OPTIONS)
ifeq ($(TRAVIS),true)
	cat $(LCOV_INFO) | $(COVERALLS)
endif
endif # $(NO_COVERAGE) != yes

.PHONY: coveralls
coveralls: showenv clean | $(REQUIRED_MODULES)

.PHONY: clean
clean:
	@rm -rf $(COVERAGE_DIR)

