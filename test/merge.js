/* @flow */
import Observable from '../src/observable'
import merge from '../src/merge'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('merge', () => {

  it('merges multiple observables', done => {
    const numbers = []
    merge(Observable.of(1, 2, 3), Observable.of(4, 5, 6), Observable.of(7, 8, 9)).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9], 'merge did not work correctly')
        done()
      },
    })
  })

})

