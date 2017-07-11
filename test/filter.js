/* @flow */
import Observable from '../src/observable'
import filter from '../src/filter'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('filter', () => {

  it('only calls next() for every observable.next() that passes predicate', done => {
    const numbers = []
    filter(i => i % 10 === 0, Observable.of(5, 10, 15, 20, 25, 30)).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([10, 20, 30], 'filter did not work correctly')
        done()
      },
    })
  })

})

