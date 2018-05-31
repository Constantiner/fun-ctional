# fun-ctional<!-- omit in toc -->
A set of functional utilities (both synchronous and asynchronous) for JavaScript.

We have plans to add some new functional utilities from time to time.

- [Installation](#installation)
- [Documentation](#documentation)
	- [acompose](#acompose)
	- [apipe](#apipe)

## Installation
Install it with NPM:

`npm install @constantiner/fun-ctional`

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

You can run `apipe` with Promise instance (for true asynchronous execution) or with any other object to use as in usual functional composition. It produces a Promise and can be used in async/await context:

```JavaScript
const message = await apipe(normalize, upperCase, insertGreetings)(somePromise);
```

It also allows to handle errors like for traditional Promise but only in the tail position of the chain:

```JavaScript
apipe(normalize, upperCase, insertGreetings)(somePromise).catch(e => console.error(e));
```

