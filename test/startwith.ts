import of from '../of'
import startWith from '../startwith'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('startWith', () => {

  it('pushes value into start of stream', done => {
    const numbers = []
    startWith(of(2, 3, 4), 1)
      .subscribe({
        error: done,
        next(number) { numbers.push(number) },
        complete() {
          expect(numbers).to.deep.equal([1, 2, 3, 4], 'startWith did not work correctly')
          done()
        },
      })
  })

})

