/* @flow */
import Observable from '../src/observable'
import combineObject from '../src/combineobject'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('combineObject', () => {

  it('calls transform() on the results of each latest next()', done => {
    const observables = {
      a: Observable.of(1),
      b: Observable.of(2),
      c: Observable.of(3),
      d: Observable.of(4),
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

