# intro

After reading about [SAM](http://jdubray.github.io/sam/) I went to look for a good-enough abstraction for rendering
the DOM, found [this article](https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3)


## What are these other JS files?

The relevant code is in `PROGRAM.js`. In there I tried to adapt the [rocket launcher example](https://bitbucket.org/snippets/jdubray/9dgKp/sam-sample).

`snabbdom_single.js` was generated via [browserify](http://browserify.org/) to create a distributable [snabbdom](https://github.com/paldepind/snabbdom) file, exposing its
symbols h and patch to a `PROGRAM` function, defined elsewhere (in the `PROGRAM.js` file).

If by any chance you want to update the `snabbdom_single.js` file, do:

    npm install
    npm run generate
