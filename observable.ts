// Observable provides an interface for an event system which can emit multiple values,
// is lazily evaluated and can be unsubscribed from. The laws of observable
// are:
//
// - Observable is not async, but can be easily used in an async way
// - Observable puts composability above all else (see utils below)
// - Observable is not evaluated until someone subscribes
// - Observable is no longer evaluated after someone unsubscribes
//
//
// Examples:
//
// mouseClicks = new Observable(({next} => {
//   window.addEventListener('click', next)
//   return () => {
//     window.removeEventListener('click', next)
//   }
// )
// let unsubscribe = mouseClicks.subscribe(({ preventDefault }) => preventDefault())

import {SloppyObserver, SubscriptionObserver, Subscription, SubscriberFunction} from './index'

export default class Observable<T> {
  public subscribe: (observer: SloppyObserver<T>) => Subscription;

  public constructor(subscribe: SubscriberFunction<T>) {
    // subscribe wraps the <subscriberCallback> which only accepts proper
    // <subscription> objects, and instead provides a subscribe function which
    // accepts <sloppySubscription>, allowing for omitting properties in a
    // subscriber object, without causing failures in the subscriberCallback
    this.subscribe = (sloppyObserver, error?: (errorValue: Error) => void, complete?: (value) => void) => {
      let start, next
      if (typeof sloppyObserver === 'function') {
        next = sloppyObserver
      } else {
        start = sloppyObserver.start
        next = sloppyObserver.next
        error = sloppyObserver.error
        complete = sloppyObserver.complete
      }
      let cleanup
      let closed = false
      let wrapClosed = (fn): () => void => (v?) => closed || fn && fn(v)
      let unsubscribe = wrapClosed(() => {
        closed = true
        cleanup && cleanup()
      })
      let wrapUnsubscribe = (fn): () => void => (v?) => {
        unsubscribe()
        fn(v)
      }
      error = wrapClosed(wrapUnsubscribe(error))
      let wrapTry = (fn): () => void => (v?) => {
        try {
          fn(v)
        } catch (e) {
          error(e)
        }
      }
      complete = wrapClosed(wrapTry(wrapUnsubscribe(complete)))
      next = wrapClosed(wrapTry(next))

      let subscription: Subscription = { get closed() { return closed }, unsubscribe }
      start && start(subscription)
      if (closed) return subscription
      wrapTry(() => {
        let observer: SubscriptionObserver<T> = { closed, error, complete, next }
        cleanup = subscribe(observer)
        if (cleanup && typeof cleanup.unsubscribe === 'function') {
          cleanup = cleanup.unsubscribe
        }
      })()
      return subscription
    }
  }
}
