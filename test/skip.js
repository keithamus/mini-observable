/* @flow */
import Observable from '../src/observable'
import skip from '../src/skip'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('skip', () => {

  it('skips the first N events', done => {
    const numbers = []
    skip(3, Observable.of(1, 2, 3, 4, 5, 6, 7)).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([4, 5, 6, 7], 'skip did not work correctly')
        done()
      },
    })
  })

})

