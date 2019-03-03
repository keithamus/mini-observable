import Observable from '../observable'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('Observable', () => {

  it('can create new observable', () => {
    const observable = new Observable(() => {})
    expect(observable).to.be.instanceOf(Observable)
  })

  it('can receive events from observable', done => {
    const letters = []
    new Observable(({next, complete}) => {
      next('a')
      next('b')
      next('c')
      complete()
    }).subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'b', 'c'], 'next() did not work correctly')
        done()
      },
    })
  })

  it('does not execute subscribe callback until subscribe call', done => {
    let shouldBeCalled = false
    const observable = new Observable(() => {
      expect(shouldBeCalled).to.equal(true, 'subscribe() got called too early')
      done()
    })
    setTimeout(() => {
      shouldBeCalled = true
      observable.subscribe({ next: done, error: done, complete: done })
    })
  })

  it('errors', done => {
    const errorValue = new Error('oops')
    new Observable(({error}) => {
      error(errorValue)
    }).subscribe({
      error(error) {
        expect(error).to.equal(errorValue, 'error did not come back correctly')
        done()
      },
      next() { throw new Error('called next for some reason') },
      complete() { throw new Error('called complete for some reason') },
    })
  })

  it('errors stop subscription', done => {
    const errorValue = new Error('oops')
    new Observable(({error, next, complete}) => {
      error(errorValue)
      next(1)
      complete()
    }).subscribe({
      error(error) {
        expect(error).to.equal(errorValue, 'error did not come back correctly')
        done()
      },
      next() { throw new Error('called next for some reason') },
      complete() { throw new Error('called complete for some reason') },
    })
  })

  it('nothing is fired after complete', done => {
    const numbers = []
    new Observable(({next, complete}) => {
      next(1)
      next(2)
      next(3)
      next(4)
      next(5)
      complete()
      next(6)
    }).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5], 'did not unsubscribe after complete successfully')
        done()
      },
    })
  })

  it('can unsubscribe to stop receiving events', done => {
    const numbers = []
    const {unsubscribe} = new Observable(({next}) => {
      setTimeout(() => {
        next(1)
        next(2)
        next(3)
        next(4)
        next(5)
        next(6)
        next(7)
        next(8)
        next(9)
      })
    }).subscribe({
      error: done,
      next(number) {
        numbers.push(number)
        if (number === 5) {
          unsubscribe()
          setTimeout(() => {
            expect(numbers).to.deep.equal([1, 2, 3, 4, 5], 'did not unsubscribe successfully')
            done()
          }, 1)
        }
      },
    })
  })

  it('can observe if the subscription is closed from the return constructor', done => {
    const numbers = []
    const subscription = new Observable(({next}) => {
      setTimeout(() => {
        next(1)
        next(2)
        next(3)
        next(4)
        next(5)
        next(6)
        next(7)
        next(8)
        next(9)
      })
    }).subscribe({
      error: done,
      next(number) {
        numbers.push(number)
        if (number === 5) {
          expect(subscription.closed).to.equal(false, 'subscription falsely marked as open')
          subscription.unsubscribe()
          expect(subscription.closed).to.equal(true, 'subscription not marked as closed')
          setTimeout(() => {
            expect(numbers).to.deep.equal([1, 2, 3, 4, 5], 'did not unsubscribe successfully')
            expect(subscription.closed).to.equal(true, 'subscription not marked as closed')
            done()
          }, 1)
        }
      },
    })
  })

  it('can observe the start of a subscription', done => {
    const startCalls = []
    const subscription = new Observable(({next}) => {
      setTimeout(() => {
        next(1)
      })
    }).subscribe({
      start(subscription) { startCalls.push(subscription) },
      error: done,
      next() {
        expect(startCalls.length).to.equal(1, 'start was called more than once')
        expect(startCalls[0]).to.equal(subscription, 'start was not given subscription')
        done()
      },
    })
  })

  it('can close the subscription from start', () => {
    const numbers = []
    const subscription = new Observable(({next}) => {
      next(1)
      next(2)
    }).subscribe({
      start(subscription) { subscription.unsubscribe() },
      next(number) {
        numbers.push(number)
      }
    })
    expect(numbers).to.deep.equal([], 'no next events should have been fired')
    expect(subscription.closed).to.equal(true, 'subscription is not marked as closed')
  })

})
