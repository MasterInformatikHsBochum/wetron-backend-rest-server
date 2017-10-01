NAME = $(shell basename `pwd` | tr '[:upper:]' '[:lower:]')
VERSION = $(shell git rev-parse --abbrev-ref HEAD | rev | cut -d'/' -f 1 | rev)

default: build

build:
	docker build -t $(NAME):$(VERSION) .

run:
	@docker run --rm -it -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock $(NAME):$(VERSION)

daemon:
	@docker run -d --restart always -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock --name $(NAME) $(NAME):$(VERSION)
