# Pan-Zoom

Pan/zoom library for web browsers. Hold and drag an element to pan. Use the mouse wheel to zoom. See `src/app.js` for a usage example.

## To view the demo using Docker

1. Install the development server packages.

       docker run --rm -w /app -v $PWD:/app -u $(id -u):$(id -u) node npm install

2. Start the server.

       docker run --rm --init -it -w /app -v $PWD:/app -p 8080:8080 node node dev-server.js

3. Visit `localhost:8080` to view.
