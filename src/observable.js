/* @flow */
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
// const unsubscribe = mouseClicks.subscribe(({ preventDefault }) => preventDefault())

type subscription<T> = {|
  unsubscribe(): void,
  error(errorValue: Error): void,
  complete(): void,
  next(value: T): void
|}

type sloppySubscription<T> = {|
  error?: (errorValue: Error) => any,
  complete?: () => any,
  next?: (value: T) => any
|}

type subscriberCallback<T> = (subscription: subscription<T>) => (() => void) | void
type normalizedSubscriberCallback<T> = (subscription: sloppySubscription<T>) => () => void

export default class Observable<T> {
  subscribe: normalizedSubscriberCallback<T>

  static of(...items: Array<T>): Observable<T> {
    return new Observable(({next, complete}) => {
      for (const item of items) next(item)
      complete()
    })
  }

  constructor(subscribe: subscriberCallback<T>) {
    // subscribe wraps the <subscriberCallback> which only accepts proper
    // <subscription> objects, and instead provides a subscribe function which
    // accepts <sloppySubscription>, allowing for omitting properties in a
    // subscriber object, without causing failures in the subscriberCallback
    this.subscribe = ({next, error, complete} = {}) => {
      let unsubscribe = null
      let subscribed = true
      const subscription: subscription = {
        unsubscribe() {
          if (!subscribed) return
          subscribed = false
          unsubscribe && unsubscribe()
        },
        error(errorValue) {
          if (!subscribed) return
          subscription.unsubscribe()
          error && error(errorValue)
        },
        complete() {
          if (!subscribed) return
          subscription.unsubscribe()
          try {
            complete && complete()
          } catch (errorValue) {
            error && error(errorValue)
          }
        },
        next(value) {
          if (!subscribed) return
          try {
            next && next(value)
          } catch (error) {
            subscription.error(error)
          }
        },
      }
      try {
        unsubscribe = subscribe(subscription)
      } catch (error) {
        subscription.error(error)
      }
      return subscription.unsubscribe
    }
  }

}
