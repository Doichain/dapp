IMG=doichain/node-only:v0.0.9.55
DOICHAIN_VER=dc0.20.1.2

default: build

build:
	docker build --no-cache -t $(IMG) --build-arg DOICHAIN_VER=$(DOICHAIN_VER) .

build-no-clean:
	docker build -t $(IMG) --build-arg DOICHAIN_VER=$(DOICHAIN_VER) .