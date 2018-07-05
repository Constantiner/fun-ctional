# fun-ctional<!-- omit in toc -->

With `fun-ctional` library you can use most of the familiar functional techniques (like functional composition) in asynchronous world with shining Promises.

It allows to mix synchronous and asynchronous functions to produce reusable composable functions and compatible with all good old utilities from functional libraries like [Lodash](https://lodash.com/). The only difference they always return a promise.

- [Installation](#installation)
- [Documentation](#documentation)
	- [acompose](#acompose)
	- [apipe](#apipe)
	- [amap](#amap)
	- [allFromList](#allfromlist)
	- [allTheSame](#allthesame)

## Installation
Install it with NPM:

`npm install @constantiner/fun-ctional`

**Note**. The UMD version of package is ES5 compatible but you may need to use [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) with it.

**Note**. Build includes sourcemaps and minified versions of UMD files as well. You can find them in your `node_modules` folder.

## Documentation
At this moment the following utilities are available:

### acompose
Asynchronous compose function (`acompose` stays for async-compose).

The main purpose is to replace a Promise handling code like this:
```JavaScript
somePromise.then(normalize).then(upperCase).then(insertGreetings);
```

with point-free style of functional compose syntax like the following:
```JavaScript
acompose(insertGreetings, upperCase, normalize)(somePromise);
```
It is lazy and allows of reusing of promise handling chains.

First you need to import it:

```JavaScript
import { acompose } from "@constantiner/fun-ctional";
```
Or:
```JavaScript
const { acompose } = require("@constantiner/fun-ctional");
```

Or you can import it separately without the whole bundle:

```JavaScript
import acompose from "@constantiner/fun-ctional/acompose";
```
Or:
```JavaScript
const acompose = require("@constantiner/fun-ctional/acompose");
```



You can run `acompose` with Promise instance (for true asynchronous execution) or with any other object to use as usual functional composition. It produces a Promise and can be used in async/await context:

```JavaScript
const message = await acompose(insertGreetings, upperCase, normalize)(somePromise);
```

It also allows to handle errors like for traditional Promise but only in the tail position of the chain:

```JavaScript
acompose(insertGreetings, upperCase, normalize)(somePromise).catch(e => console.error(e));
```

### apipe
Asynchronous pipe function (`apipe` stays for async-pipe).

The main purpose is to replace a Promise handling code like this:
```JavaScript
somePromise.then(normalize).then(upperCase).then(insertGreetings);
```

with point-free style of functional pipe syntax like the following:
```JavaScript
apipe(normalize, upperCase, insertGreetings)(somePromise);
```
It is lazy and allows of reusing of promise handling chains.

First you need to import it:

```JavaScript
import { apipe } from "@constantiner/fun-ctional";
```
Or:
```JavaScript
const { apipe } = require("@constantiner/fun-ctional");
```
Or you can import it separately without the whole bundle:

```JavaScript
import apipe from "@constantiner/fun-ctional/apipe";
```
Or:
```JavaScript
const apipe = require("@constantiner/fun-ctional/apipe");
```


You can run `apipe` with Promise instance (for true asynchronous execution) or with any other object to use as in usual functional composition. It produces a Promise and can be used in async/await context:

```JavaScript
const message = await apipe(normalize, upperCase, insertGreetings)(somePromise);
```

It also allows to handle errors like for traditional Promise but only in the tail position of the chain:

```JavaScript
apipe(normalize, upperCase, insertGreetings)(somePromise).catch(e => console.error(e));
```

### amap

An asynchronous version of map over an iterable (amap stays for async-map).

It gets an iterable of values (or promises) as input (or a promise to resolve to iterable), resolves them, maps over map function and returns a promise which resolves to an array of values.

It allows asynchronous mapping point-free way and can be used with asynchronous compose functions.

It uses Promise.all() under the hood.

```JavaScript
const [ first, second, third ] = await amap(getDataFromServer)([somePromise1, someValue2, somePromise3]);
```

Or even more traditional way:

```JavaScript
amap(getDataFromServer)([somePromise1, someValue2, somePromise3])
	.then(values => console.log(values));
```
It first resolves a promises passed and then pass resolutions value to the mapping function.

Input iterable's values are not restricted to promises but can be any value to pass as input to functions.

It also allows to handle errors like for traditional Promise:

```JavaScript
amap(getDataFromServer)([somePromise1, someValue2, somePromise3]).catch(e => console.error(e));
```
Or you can use `try/catch` in `async/await` constructions.

Нou can use it with [`acompose`](#acompose) or [`apipe`](#apipe):

```JavaScript
const usersHtml = await acompose(getHtmlRepresentation, getUserNames, amap(getUser), getUserIds)(somePromise);
```

You can import it the following way:

```JavaScript
import { amap } from "@constantiner/fun-ctional";
```
Or:
```JavaScript
const { amap } = require("@constantiner/fun-ctional");
```

Or you can import it separately without the whole bundle:

```JavaScript
import amap from "@constantiner/fun-ctional/amap";
```
Or:
```JavaScript
const amap = require("@constantiner/fun-ctional/amap");
```

### allFromList

Composable version of Promise.all() or asynchronous map over iterable.

It is just an alias of [`amap`](#amap) function.

It gets an iterable of values (or promises) as input (or a promise to resolve to iterable), resolves them, maps over map function and returns a promise which resolves to an array of values.

It allows asynchronous mapping point-free way and can be used with asynchronous compose functions.

It uses Promise.all() under the hood.

```JavaScript
const [ first, second, third ] = await allFromList(getDataFromServer)([somePromise1, someValue2, somePromise3]);
```

Or even more traditional way:

```JavaScript
allFromList(getDataFromServer)([somePromise1, someValue2, somePromise3])
	.then(values => console.log(values));
```
It first resolves a promises passed and then pass resolutions value to the mapping function.

Input iterable's values are not restricted to promises but can be any value to pass as input to functions.

It also allows to handle errors like for traditional Promise:

```JavaScript
allFromList(getDataFromServer)([somePromise1, someValue2, somePromise3]).catch(e => console.error(e));
```
Or you can use `try/catch` in `async/await` constructions.

Нou can use it with [`acompose`](#acompose) or [`apipe`](#apipe):

```JavaScript
const usersHtml = await acompose(getHtmlRepresentation, getUserNames, allFromList(getUser), getUserIds)(somePromise);
```

You can import it the following way:

```JavaScript
import { allFromList } from "@constantiner/fun-ctional";
```
Or:
```JavaScript
const { allFromList } = require("@constantiner/fun-ctional");
```

Or you can import it separately without the whole bundle:

```JavaScript
import allFromList from "@constantiner/fun-ctional/allFromList";
```
Or:
```JavaScript
const allFromList = require("@constantiner/fun-ctional/allFromList");
```


### allTheSame

Composable version of Promise.all().

It gets some value or promise as input, pass it to the functions list It gets some value or promise as input, pass it to the functions list.

It allows to use Promise.all() point-free way:

```JavaScript
const [ first, second ] = await allTheSame(squareRoot, getDataFromServer)(somePromise);
```

Or:

```JavaScript
const [ first, second ] = await allTheSame(squareRoot, getDataFromServer)(25);
```

Or some more traditional way:

```JavaScript
allTheSame(squareRoot, getDataFromServer)(somePromise)
	.then(([ first, second ]) => [ second, first ]);
```

It first resolves a promise passed and then pass resolution value to all the functions.

Input value is not restricted to promise but can be any value to pass as input to functions.

It also allows to handle errors like for traditional Promise:

```JavaScript
allTheSame(squareRoot, getDataFromServer)(somePromise).catch(e => console.error(e));
```

or the same with async/await.

Нou can use it with [`acompose`](#acompose) or [`apipe`](#apipe):

```JavaScript
const usersHtml = await acompose(getHtmlRepresentation, getUserNames, allTheSame(logIds, getUserList), getUserIds)(somePromise);
```

You can import it the following way:

```JavaScript
import { allTheSame } from "@constantiner/fun-ctional";
```
Or:
```JavaScript
const { allTheSame } = require("@constantiner/fun-ctional");
```

Or you can import it separately without the whole bundle:

```JavaScript
import allTheSame from "@constantiner/fun-ctional/allTheSame";
```
Or:
```JavaScript
const allTheSame = require("@constantiner/fun-ctional/allTheSame");
```
