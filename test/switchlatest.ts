import Observable from '../observable'
import switchLatest from '../switchlatest'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('switchLatest', () => {

  it('cancels any previous in-flight inner observables', done => {
    const numbers: number[] = []
    switchLatest(
      new Observable<number>(({next}) => {
        setTimeout(next, 100, 1)
        setTimeout(next, 200, 2)
      }),
      value => new Observable<number>(({next, complete}) => {
        setTimeout(next, 25, value * 1)
        setTimeout(next, 50, value * 2)
        setTimeout(next, 75, value * 3)
        setTimeout(next, 100, value * 4)
        setTimeout(next, 125, value * 5)
        setTimeout(next, 150, value * 6)
        setTimeout(next, 175, value * 7)
        setTimeout(complete, 200)
      })
    ).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1, 2, 3, 2, 4, 6, 8, 10, 12, 14], 'switchLatest did not work correctly')
        done()
      },
    })
  })

  it('can be used to sequence promises', done => {
    const numbers: number[] = []
    switchLatest(
      new Observable<number>(({next}) => {
        next(10)
        next(20)
      }),
      value => new Observable<number>(({next, complete}) => {
        Promise.resolve(value * 2).then(next).then(complete)
      })
    ).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([40], 'switchLatest did not work correctly')
        done()
      },
    })
  })

})

