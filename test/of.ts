import of from '../of'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('of', () => {

  it('creates observable of args', done => {
    const letters = []
    of('a', 'b', 'c').subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'b', 'c'], 'of() did not work correctly')
        done()
      },
    })
  })

})

