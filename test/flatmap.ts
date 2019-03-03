import Observable from '../observable'
import flatMap from '../flatmap'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('flatMap', () => {

  it('merges observables coming from transform function', done => {
    const numbers = []
    flatMap(new Observable(({next, complete}) => {
      next(10)
      next(20)
      complete()
    }), value => new Observable(({ next, complete }) => {
      Promise.resolve(value * 2).then(next).then(complete)
    })).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([20, 40], 'flatMap did not work correctly')
        done()
      },
    })
  })

})

