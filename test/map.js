/* @flow */
import Observable from '../src/observable'
import map from '../src/map'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('map', () => {

  it('transforms observable next\'s to new values', done => {
    const letters = []
    map(event => event.letter, Observable.of({ letter: 'a' }, { letter: 'b' }, { letter: 'c' })).subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'b', 'c'], 'map did not work correctly')
        done()
      },
    })
  })

  it('uses non-callable transform value as constant', done => {
    const letters = []
    map('a', Observable.of(1, 2, 3)).subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'a', 'a'], 'map did not work correctly')
        done()
      },
    })
  })

})

