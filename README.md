# fun-ctional<!-- omit in toc -->

With `fun-ctional` library you can use most of the familiar functional techniques (like functional composition) in asynchronous world with shining Promises.

It allows to mix synchronous and asynchronous functions to produce reusable composable functions and compatible with all good old utilities from functional libraries like [Lodash](https://lodash.com/). The only difference they always return a promise.

- [Installation](#installation)
- [Documentation](#documentation)
	- [acompose](#acompose)
	- [apipe](#apipe)
	- [amap](#amap)
	- [areduce](#areduce)
	- [areduceRight](#areduceright)
	- [applyFns](#applyfns)
	- [acatch](#acatch)
	- [applySafe](#applysafe)

## Installation
Install it with NPM:

`npm install @constantiner/fun-ctional`

**Note**. The UMD version of package is ES5 compatible but you may need to use [`@babel/polyfill`](https://babeljs.io/docs/en/babel-polyfill/) or even [`@babel/runtime`](https://babeljs.io/docs/en/babel-runtime) with it.

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
const { acompose } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import acompose from "@constantiner/fun-ctional/acompose";
```

Or:

```JavaScript
const acompose = require("@constantiner/fun-ctional/acompose-umd");
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
const { apipe } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import apipe from "@constantiner/fun-ctional/apipe";
```

Or:

```JavaScript
const apipe = require("@constantiner/fun-ctional/apipe-umd");
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

It uses `Promise.all()` under the hood. So if mapping function is asynchronous (returns a promise) all promises are being generated at once and then resolved with `Promise.all()`. So if any of promises will produce error (promise rejection) all the other promises will be invoked. The advantage of this method of invoking promises it will finish earlier than sequential map (because of `Promise.all()`) but it may perform some fetches or even state modifications even in case of fail on some previous mapping steps.

See [`amapSeq`](#amapseq) for sequential implementation.

```JavaScript
const [ first, second, third ] = await amap(getDataFromServer)([somePromise1, someValue2, somePromise3]);
```

Or even more traditional way:

```JavaScript
amap(getDataFromServer)([somePromise1, someValue2, somePromise3])
	.then(values => console.log(values));
```

It first resolves a promises passed and then pass resolutions value to the mapping function.

Mapping function is called with three parameters: `currentValue`, `currentIndex`, `array` which are plain resolved values (not promises).

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
const { amap } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import amap from "@constantiner/fun-ctional/amap";
```

Or:

```JavaScript
const amap = require("@constantiner/fun-ctional/amap-umd");
```

### amapSeq

An asynchronous version of map over an iterable (amapSeq stays for async-map).

It gets an iterable of values (or promises) as input (or a promise to resolve to iterable), resolves them, maps over map function and returns a promise which resolves to an array of values.

It allows asynchronous mapping point-free way and can be used with asynchronous compose functions.

The difference from regular [`amap`](#amap) is if map function is asynchronous (returns a promise) every new invocation of map function performs sequentially after resolving previous promise. So if any of promises produces error (promise rejection) `amapSeq` will not produce new promises and they won't be invoked.

See [`amap`](#amap) for parallel implementation.

```JavaScript
const [ first, second, third ] = await amapSeq(getDataFromServer)([somePromise1, someValue2, somePromise3]);
```

Or even more traditional way:

```JavaScript
amapSeq(getDataFromServer)([somePromise1, someValue2, somePromise3])
	.then(values => console.log(values));
```

It first resolves a promises passed and then pass resolutions value to the mapping function.

Mapping function is called with three parameters: `currentValue`, `currentIndex`, `array` which are plain resolved values (not promises).

Input iterable's values are not restricted to promises but can be any value to pass as input to functions.

It also allows to handle errors like for traditional Promise:

```JavaScript
amapSeq(getDataFromServer)([somePromise1, someValue2, somePromise3]).catch(e => console.error(e));
```

Or you can use `try/catch` in `async/await` constructions.

Нou can use it with [`acompose`](#acompose) or [`apipe`](#apipe):

```JavaScript
const usersHtml = await acompose(getHtmlRepresentation, getUserNames, amapSeq(getUser), getUserIds)(somePromise);
```

You can import it the following way:

```JavaScript
import { amapSeq } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { amapSeq } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import amapSeq from "@constantiner/fun-ctional/amapSeq";
```

Or:

```JavaScript
const amapSeq = require("@constantiner/fun-ctional/amapSeq-umd");
```

### areduce

Asynchronous composable version of `reduce` method for iterables ("a" stays for "asynchronous").

It gets a list of values (or list of promises, or promise to resolve to list) and performs standard `reduce` on them.

Reduce function may be asynchronous to return a promise (to fetch some data etc). Initial value of reducer also could be a promise.

A sample usage is:

```JavaScript
const sum = async (currentSum, invoiceId) => {
	const { total:invoiceTotal } = await fetchInvoiceById(invoiceId);
	return currentSum + invoiceTotal;
};

const paymentTotal = await areduce(sum, 0)(fetchInvoiceIds(userId));
```

Or the same with [`acompose`](#acompose):

```JavaScript
const paymentTotal = await acompose(areduce(sum, 0), fetchInvoiceIds)(userId);
```

It takes a standard callback Function to execute on each element in the array, taking four standard arguments (`accumulator`, `currentValue`, `currentIndex`, `array`) and returns a function to accept input value (so it is composable).

You can import it the following way:

```JavaScript
import { areduce } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { areduce } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import areduce from "@constantiner/fun-ctional/areduce";
```

Or:

```JavaScript
const areduce = require("@constantiner/fun-ctional/areduce-umd");
```

### areduceRight

Asynchronous composable version of `reduce` method for iterables ("a" stays for "asynchronous").

It gets a list of values (or list of promises, or promise to resolve to list) and performs standard `reduce` on them.

Reduce function may be asynchronous to return a promise (to fetch some data etc). Initial value of reducer also could be a promise.

A sample usage is:

```JavaScript
const sum = async (currentSum, invoiceId) => {
	const { total:invoiceTotal } = await fetchInvoiceById(invoiceId);
	return currentSum + invoiceTotal;
};

const paymentTotal = await areduceRight(sum, 0)(fetchInvoiceIds(userId));
```

Or the same with [`acompose`](#acompose):

```JavaScript
const paymentTotal = await acompose(areduceRight(sum, 0), fetchInvoiceIds)(userId);
```

It takes a standard callback Function to execute on each element in the array, taking four standard arguments (`accumulator`, `currentValue`, `currentIndex`, `array`) and returns a function to accept input value (so it is composable).

You can import it the following way:

```JavaScript
import { areduceRight } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { areduceRight } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import areduceRight from "@constantiner/fun-ctional/areduceRight";
```

Or:

```JavaScript
const areduceRight = require("@constantiner/fun-ctional/areduceRight-umd");
```

### applyFns

A kind of composable version of Promise.all().

It gets some value or promise as input, pass it to the functions list and produces the array of results after resolving all the functions which can return promises as well.

It allows to use Promise.all() point-free way:

```JavaScript
const [ first, second ] = await applyFns(squareRoot, getDataFromServer)(somePromise);
```

Or:

```JavaScript
const [ first, second ] = await applyFns(squareRoot, getDataFromServer)(25);
```

Or some more traditional way:

```JavaScript
applyFns(squareRoot, getDataFromServer)(somePromise)
	.then(([ first, second ]) => [ second, first ]);
```

It first resolves a promise passed and then pass resolution value to all the functions.

Input value is not restricted to promise but can be any value to pass as input to functions.

It also allows to handle errors like for traditional Promise:

```JavaScript
applyFns(squareRoot, getDataFromServer)(somePromise).catch(e => console.error(e));
```

or the same with async/await.

You can use it with [`acompose`](#acompose) or [`apipe`](#apipe):

```JavaScript
const userHtml = await acompose(getHtmlRepresentation, getFullName, applyFns(getFirstNameById, getLastNameById), getUserId)(somePromise);
```

You can import it the following way:

```JavaScript
import { applyFns } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { applyFns } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import applyFns from "@constantiner/fun-ctional/applyFns";
```

Or:

```JavaScript
const applyFns = require("@constantiner/fun-ctional/applyFns-umd");
```

### acatch

Composable version of `catch` method for promises.

It gets a value (a promise or not), resolves it and if resulting promise was rejected, calls catch function passed.

It allows to handle errors within [`acompose`](#acompose) or [`apipe`](#apipe) asynchronous composition chains to restore broken state etc.

A sample with [`acompose`](#acompose):

```JavaScript
const resultOrFallback = await acompose(acatch(handleAndRecoverFn), canFailFn)(someInput);
```

Standalone usage:

```JavaScript
const resultOrFallback = await acatch(handleAndRecoverFn)(requestDataAndReturnPromise());
```

It is the same as the following:

```JavaScript
requestDataAndReturnPromise().catch(handleAndRecoverFn).then(resultOrFallback => console.log(resultOrFallback));
```

You can import it the following way:

```JavaScript
import { acatch } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { acatch } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import acatch from "@constantiner/fun-ctional/acatch";
```

Or:

```JavaScript
const acatch = require("@constantiner/fun-ctional/acatch-umd");
```

### applySafe

Composable version of `promise.then(mapFn).catch(catchFn)`.

It gets a value (a promise or not), resolves it and handles as `promise.then(mapFn).catch(catchFn)` returning resulting promise.

It allows to handle errors within [`acompose`](#acompose) or [`apipe`](#apipe) asynchronous composition chains to restore broken state etc.

A sample with [`acompose`](#acompose):

```JavaScript
const resultOrFallback = await acompose(applySafe(canFailFn, handleAndRecoverFn), canFailTooFn)(someInput);
```

Standalone usage:

```JavaScript
const resultOrFallback = await applySafe(canFailFn, handleAndRecoverFn)(requestDataAndReturnPromise());
```

Here `canFailFn` is replacement for standard Promise's `then` method (which can reject) and `handleAndRecoverFn` for Promise's `catch`.

It is the same as the following:

```JavaScript
requestDataAndReturnPromise().then(canFailFn).catch(handleAndRecoverFn).then(resultOrFallback => console.log(resultOrFallback));
```

Or even more complex example:

```JavaScript
const resultOrFallback = await applySafe(acompose(handlerFn2, handlerFn1), handleAndRecoverFn)(requestDataAndReturnPromise());
```

You can import it the following way:

```JavaScript
import { applySafe } from "@constantiner/fun-ctional";
```

Or:

```JavaScript
const { applySafe } = require("@constantiner/fun-ctional-umd");
```

Or you can import it separately without the whole bundle:

```JavaScript
import applySafe from "@constantiner/fun-ctional/applySafe";
```

Or:

```JavaScript
const applySafe = require("@constantiner/fun-ctional/applySafe-umd");
```