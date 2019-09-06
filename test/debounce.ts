import Observable from '../observable'
import debounce from '../debounce'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('debounce', () => {

  it('ignores events between every <duration>', done => {
    const numbers: number[] = []
    debounce(new Observable<number>(({next, complete}) => {
      next(1)
      setTimeout(() => {
        next(2)
        next(3)
        next(4)
        setTimeout(() => {
          next(5)
          next(6)
          next(7)
          complete()
        }, 50)
      }, 50)
    }), 50).subscribe({
      error: done,
      next(number) { numbers.push(number) },
      complete() {
        expect(numbers).to.deep.equal([1, 4, 7], 'debounce did not work correctly')
        done()
      },
    })
  })

  it('always sends back last event if no more come in during <duration>', done => {
    debounce(new Observable<number>(({next}) => {
      next(1)
      next(2)
      next(3)
      next(4)
      next(5)
    }), 1).subscribe({
      error: done,
      next(value) {
        expect(value).to.equal(5, 'debounce did not work correctly')
        done()
      }
    })
  })

})
