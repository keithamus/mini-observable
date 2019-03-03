# mini-observable
> A (somewhat) compatible implementation of Observable in <300bytes, plus some utility functions

### Usage

```js
import {Observable, fromEvent, map, toggle, merge} from 'mini-observable'

mouseUps = fromEvent(document, 'mouseup')
mouseDowns = fromEvent(document, 'mousedown')
mouseMoves = fromEvent(document, 'mousemove')
isMousingDown = merge(mouseDown, map(() => true), map(mouseUp, () => false))
const unsubscribe = mouseClicks.subscribe(({ preventDefault }) => preventDefault())
```

### What Is Observable

`Observable` is a type - similar to, say, `Promise` - that allows us to emit pieces of data to parts of the code that wish to recieve them.

Conceptually, Observable has some very key features which give it a great deal of power, and are difficult to replicate without the Observable type. Chiefly:

 - Observable itself not async, but can be easily used in an async way
 - Observable puts composability above all else
 - Observable is not evaluated until someone subscribes
 - Observable is no longer evaluated after someone unsubscribes

To create an Observable, one passes a subscribe callback. The subscribe callback is called whenever some code subscribes to the Observable, the subscribe callback gets `next`, `error` and `complete` functions which can tell subscribers what is happening with the stream. `error` and `complete` will only fire at-most-once, but `next` can be fired many times (or none!). The subscriber callback can also manage what happens when some code _unsubscribes_ from a subscription - so it can clean up event listeners or null out references etc.

### Why not just use the TC39 Observable or most/rxjs/bacon/<insert here>?

Well, the intent here is to keep the Observable _minimally maximal_. The TC39 Observable polyfill is not an ideal _minimally maximal_ implementation because it tries to stick hard to the spec and as such has a lot of code around error and argument checking - which we can forgo by keeping ourselves disciplined. most.js/RxJS/bacon/etc have an intersection of features and compabilities which we might not make use of or are missing features that we need (in the cas eof xstream which misses utils like debounce), in addition, many of these are much larger - a full most.js import is 10kb, RxJS is 30kb. By keeping our Observable instance very small (just subscribe and of methods) and utils to just what we need, we can keep a very lightweight implementation.

One of the reasons all of utils are in individual files - rather than on the Observable prototype - is to ensure that you can more easily drop `observable.js` for a compatible (hopefully one day native) implementation, and keep using the operator helpers from this repo.

## Operators

This library comes with a set of operators that operate over one or more Observables and always return one Observable. Here are some brief descriptions for each of these:

### of [Ⓢ](./of.js)

```
of([1,2,3]): |-1-2-3-|
```
```js
of(items: Array<T>) => Observable<T>
```

`of` creates an Observable (`Observable<T>`) from a list of items in an Array or Array Like (`Array<T>`).

### combine [Ⓢ](./combine.js)

```
transform t: (a, b) => a + b
source a:          |--1--2--1--2--|
source b:          |--1--1--2--2--|
combine(t, a, b):  |--2--3--3--4--|

transform t: (a, b) => a + b
source a:          |--1-----2-----3--|
source b:          |--1--2--3--4--5--|
combine(t, a, b):  |--2--3--5--6--8--|
```
```js
combine<T,U,V>(sourceA: Observable<T>, sourceB: Observable<U>, transform: (T, U) => V): Observable<V>
```

combine takes two Observables (`Observable<T>` and `Observable<U>`) and when it has received values from both Observables will call `transform(T, U)`. `combine` itself returns an Observable (`Observable<V>`) which emits `next(V)` for every return value of the called `transform(T, U)`. `transform` can be called with stale values, if - for example - sourceB emits after sourceA completes, then `transform` will be called with the last value from `sourceA`. The output `Observable<V>` will only `complete()` when both sources `complete()`. Unsubscribing from `Observable<V>` will unsubscribe from all sources.

### combineObject [Ⓢ](./combineobject.js)

```
sources o.a:      |------1----------2----------1----------2------|
sources o.b:      |------1----------1----------2----------2------|
combineObject(o): |--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--|
```
```js
combineObject(sources: {[name: string]: Observable<*>}): Observable<{[name: string]: *}>
```

combineObject takes an Object of Observables and returns an Observable of objects; the keys of which match the key of the sources object, and the values match the values emitted by the Observable values in the sources object. The returned Observable may emit stale values, if - for example - one of the sources completes, then subsequent objects will include the last value of that Observable. The output `Observable` will only `complete()` when all sources `complete()`. Unsubscribing from the output `Observable` will unsubscribe from all sources.

### debounce [Ⓢ](./debounce.js)

```
source:        |--1-2-3-----4-5------6-------7----|
debounce(200): |---------3-------5-----6-------7--|
```
```js
debounce<T>(source: Observable<T>, duration: number): Observable<T>
```

debounce takes a duration of milliseconds, and an `Observable<T>`. Any values the source `Observable<T>` emits will not be emitted on the output `Observable<T>` until the duration has passed. If the source `Observable<T>` emits multiple values during one duration, then older values are discarded - in other words the output `Observable<T>` will only emit at-most-once per duration, with the latest value from the source `Observable<T>`.


### filter [Ⓢ](./filter.js)

```
predicate p: x => x % 2 == 0
source s:     |--1--2--3--4--5--6--|
filter(p, s): |-----2-----4-----6--|
```
```js
filter<T>(source: Observable<T>, predicate: (T) => boolean): Observable<T>
```

filter will execute `predicate<T>` for every value emitted from `Observable<T>`. If `predicate<T>` returns `false`, then the output `Observable<T>` _will not_ emit that `T`. If `predicate<T>` returns `true` then the ouput `Observable<T>` _will_ emit that `T`.

### flatMap [Ⓢ](./flatmap.js)

```
transform t: x => Observable.of(x+1, x+2))
source s:      |-1-------2-------3-------7-----|
source t(1):   |-2--3--|
source t(2):           |-3--4--|
source t(3):                   |-4--5--|
source t(7):                           |-8--9--|
flatMap(t, s): |-2--3----3--4----4--5----8--9--|
```
```js
flatMap<T, U>(source: Observable<T>, transform: (T) => Observable<U>): Observable<U>
```

flatMap takes a source `Observable<T>` and passes each value emitted to `transform(T)`. The output `Observable<U>` of `transform(T)` is then immediately subscribed to and any values are emitted on the output `Observable<U>`. sources from `transform(T)` may overlap. The output `Observable<U>` will only `complete()` when all sources from `transform(T)` also `complete()`. Unsubscribing from the output `Observable` will unsubscribe from all sources, including `Observable<T>` - and `transform(T)` will no longer be called.

### fromCallback [Ⓢ](./fromcallback.js)

```js
fromCallback<T>(func: Function): (...args: *[]) => Observable<T>
```

fromCallback translates a callback taking function, and returns a function which no longer takes that callback - instead returning an Observable that, when subscribed to, will call the original function with the given arguments and emit `next` events any time the callback is called. In other words if you have a function like `readFile(name: string, callback: (contents: Buffer) => void)` then you can call `fromCallback(readFile)` to get a function of `readFile(name: string) => Observable<Buffer>`.

### fromEvent [Ⓢ](./fromevent.js)

```js
fromEvent(element: HTMLElementLike, name: string, options?: EventListenerOptionsOrUseCapture): Observable<Event|CustomEvent>
```

fromEvent takes a `name`, `element` and optional `options` object. The output `Observable<Event|CustomEvent>` will call `element.addEventListener(name, next, options)` - thereby emitting any events from the listener, to the Observable. When unsubscribed, `Observable<Event|CustomEvent>` will cleanup the event listener.

### fromPromise [Ⓢ](./frompromise.js)

```js
fromPromise<T>(promise: Promise<T>): Observable<T>
```

fromPromise takes a `Promise<T>` and will emit `T` when `Promise<T>` resolves. If `Promise<T>` rejects, then `Observable<T>` will `error()`. `complete()` is called after `Promise<T>` resolves and `Observable<T>` emits - as such `Observable<T>` will only ever emit one value.

### map [Ⓢ](./map.js)

```
transform t: x => x * 2
source s:  |--1--2--3--4--|
map(s, t): |--2--4--6--8--|
```
```js
map<T, U>(source: Observable<T>, transform: U|(T) => U): Observable<U>
```

map takes a source `Observable<T>` and calls `transform(T)` for every emitted value. The returned `Observable<U>` will emit the returned values from `transform<T>`. If `transform` is not callable, and is instead `U` - then the raw value is simply used instead.

### merge [Ⓢ](./merge.js)

```
source a:    |--1-----2-----3-----4-----|
source b:    |--9-----8--------7-----6--|
merge(a, b): |--1-9---2-8---3--7--4--6--|
```
```js
merge(...sources: Array<Observable<*>>): Observable<*>
```

merge takes an arbitrary amount of source `Observable<*>`s and emits any value from any of those sources in the returned `Observable<*>`. The output `Observable<*>` will only `complete()` when all sources `complete()`. Calling `unsubscribe()` on the output `Observable<*>` will call `unsubscribe()` on all source `Observable<*>`s.

### skip [Ⓢ](./skip.js)

```
source s:   |--1--2--3--4--5--6--7--|
skip(3, s): |-----------4--5--6--7--|
```
```js
skip<T>(source: Observable<T>, count: number): Observable<T>
```

skip takes a count, and a source `Observable<T>`. The returned `Observable<T>` will only emit `T`s after the source `Observable<T>` has emitted `count` times. Any values the source `Observable<T>` emits before `count` is reached will be discarded.

### skipRepeats [Ⓢ](./skiprepeats.js)

```
source s:       |--1--1--2--3--4--4--4--4--5-|
skipRepeats(s): |--1-----2--3--4-----------5-|
```
```js
skipRepeats<T>(source: Observable<T>): Observable<T>
```

skipRepeats takes source `Observable<T>` and returns an output `Observable<T>` which will ignore repeat emissions from the source. Any values emitted multiple times from the source `Observable<T>` will be discarded after the first emission. In some libraries this is called `distinctUntilChanged`.

### startWith [Ⓢ](./startwith.js)

```
source:       |-----1--2--3--4--5--6--|
startWith(1): |--1--1--2--3--4--5--6--|
```
```js
startWith<T,U>(source: Observable<U>, start: T): Observable<T|U>
```

startWith takes an initial value `T` and a source `Observable<U>` and returns an ouput `Observable<T|U>`, which immediately emits `T`, subsequently emitting any `U`s coming from `Observable<U>`.

### switchLatest [Ⓢ](./switchlatest.js)

```
transform t: x => Observable.of(x+1, x+1, x+1))
source:       |--1-----2--3--4--------|
source t(1):  |--2--2--2--------------|
source t(2):  |--------3--3--3--------|
source t(3):  |-----------4--4--4-----|
source t(4):  |--------------5--5--5--|
switchLatest: |--2--2--3--4--5--5--5--|
```
```js
switchLatest<T, U>(source: Observable<T>, transform: (T) => Observable<U>): Observable<U>
```

switchLatest takes a source `Observable<T>` and calls `transform(T)` for each emitted value. Like [`flatMap`](#flatMap), switchLatest will immediately subscribe to any `Observable<U>` coming from `transform(T)`, but _in addition_ to this, will `unsubscribe()` from any prior `Observable<U>`s - so that there is only ever one `Observable<U>` subscribed at any one time. In some libraries this is called `switchMap`.

### toggle [Ⓢ](./toggle.js)

```
source s:     |--1--2--3--4--5--6--7--8--|
source t:     |-----T-----F-----T--F-----|
toggle(s, t): |-----2--3--4-----6--7-----|
```
```js
toggle<T>(source: Observable<T>, toggler: Observable<boolean>): Observable<T>
```

toggle takes a source `Observable<T>` and a toggler `Observable<boolean>`. The output `Observable<T>` will only ever emit `T`s while `Observable<boolean>`'s last emitted value was `true`. If `Observable<boolean>` last emitted `false` then any `T`s up until the next (`Observable<T>`) `true` will be discarded. In other words, toggler `Observable<boolean>` controls whether or not output `Observable<T>` emits values or not. If source `Observable<T>` `complete()`s then toggler `Observable<boolean>` will be `unsubscribe()`d, however `complete()` from toggler `Observable<boolean>` is ignored. Calling `unsubscribe()` on output `Observable<T>` will call `unsubscribe()` on both source and toggler.


