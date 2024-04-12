## Install dev server packages

    docker run --rm -w /app -v $PWD:/app -u $(id -u):$(id -u) node npm install

## Start the dev server

    docker run --rm --init -it -w /app -v $PWD:/app -p 8080:8080 node node dev-server.js

Visit `localhost:8080` to view.
