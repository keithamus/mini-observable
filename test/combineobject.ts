import of from '../of'
import combineObject from '../combineobject'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('combineObject', () => {

  it('calls transform() on the results of each latest next()', done => {
    const observables = {
      a: of(1),
      b: of(2),
      c: of(3),
      d: of(4),
    }
    combineObject(observables).subscribe({
      error: done,
      complete: done,
      next(value) {
        expect(value).to.deep.equal({a: 1, b: 2, c: 3, d: 4}, 'combineObject did not work correctly')
      }
    })
  })

})

