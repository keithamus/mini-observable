/* @flow */
import fromPromise from '../src/frompromise'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('fromPromise', () => {

  it('fromPromise success', done => {
    const numbers = []
    fromPromise(Promise.resolve(1)).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1], 'fromPromise did not work properly')
        done()
      },
    })
  })

  it('fromPromise failure', done => {
    const error = new Error('oops')
    fromPromise(Promise.reject(error)).subscribe({
      error(givenError) {
        expect(givenError).to.equal(error, 'error did not come back correctly')
        done()
      },
      next() { expect.throw('next got called for some reason') },
      complete() { expect.throw('complete got called for some reason') },
    })
  })

})
