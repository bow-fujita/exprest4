#
# exprest4
# Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
# MIT License
#

SHELL := /bin/bash
.SUFFIXES:

export NODE_ENV := test
export APP_ROOT := $(realpath ..)

NODE_MODULES := $(APP_ROOT)/node_modules
MOCHA := $(NODE_MODULES)/mocha/bin/mocha

ifeq ($(wildcard $(MOCHA)),)
$(error You must run `npm install` in $(APP_ROOT))
endif

.PHONY: all
all:
	$(MOCHA) --opts mocha.opts suites

