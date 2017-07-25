/* @flow */
import Observable from '../src/observable'
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

  it('.of() creates observable of args', done => {
    const letters = []
    Observable.of('a', 'b', 'c').subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'b', 'c'], 'of() did not work correctly')
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
      next() { expect.throw('called next for some reason') },
      complete() { expect.throw('called complete for some reason') },
    })
  })

  it('errors stop subscription', done => {
    const errorValue = new Error('oops')
    new Observable(({error, next, complete}) => {
      error(errorValue)
      next()
      complete()
    }).subscribe({
      error(error) {
        expect(error).to.equal(errorValue, 'error did not come back correctly')
        done()
      },
      next() { expect.throw('called next for some reason') },
      complete() { expect.throw('called complete for some reason') },
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
    const unsubscribe = new Observable(({next}) => {
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

})
