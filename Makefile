install:
	npm install

lint:
	npx eslint .

start:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack

.PHONY: install lint start build