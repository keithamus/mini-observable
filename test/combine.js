/* @flow */
import Observable from '../src/observable'
import combine from '../src/combine'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('combine', () => {

  it('calls transform() on the results of each latest next()', done => {
    const combinations = []
    const observableA = new Observable(({next, complete}) => {
      Promise.resolve()
        .then(() => next('a'))
        .then(() => next('b'))
        .then(() => next('c'))
        .then(() => complete())
    })
    const observableB = new Observable(({next, complete}) => {
      Promise.resolve()
        .then(() => next(1))
        .then(() => next(2))
        .then(() => next(3))
        .then(() => complete())
    })
    combine((x, y) => x + y, observableA, observableB).subscribe({
      error: done,
      next(combination) { combinations.push(combination) },
      complete() {
        expect(combinations).to.deep.equal(['a1', 'b1', 'b2', 'c2', 'c3'], 'combine did not work correctly')
        done()
      },
    })
  })

})
