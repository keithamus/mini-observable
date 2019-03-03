import of from '../of'
import skip from '../skip'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('skip', () => {

  it('skips the first N events', done => {
    const numbers = []
    skip(of(1, 2, 3, 4, 5, 6, 7), 3).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([4, 5, 6, 7], 'skip did not work correctly')
        done()
      },
    })
  })

})

