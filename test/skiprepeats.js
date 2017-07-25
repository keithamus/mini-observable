/* @flow */
import Observable from '../src/observable'
import skipRepeats from '../src/skiprepeats'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('skipRepeats', () => {

  it('only sends through non-repeating events', done => {
    const numbers = []
    skipRepeats(Observable.of(1, 1, 2, 2, 3, 3, 1, 1)).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1, 2, 3, 1], 'skipRepeats did not work correctly')
        done()
      },
    })
  })

})

