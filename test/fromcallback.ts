import fromCallback from '../fromcallback'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('fromCallback', () => {

  it('returns a function', () => {
    expect(fromCallback(() => {})).to.be.a('function')
  })

  it('does not call callback unless subscribed to', () => {
    let called = 0
    fromCallback(() => { called += 1 })()
    fromCallback(() => { called += 1 })()
    expect(called).to.equal(0)
    fromCallback(() => { called += 1 })().subscribe({})
    expect(called).to.equal(1)
  })

  it('calls given callback with args, when subscribed', () => {
    let args = null
    let cbFn = null
    fromCallback((a, b, c, d: Function) => { args = [a, b, c]; cbFn = d })('a', 'b', 'c').subscribe({})
    expect(args).to.deep.equal(['a', 'b', 'c'])
    expect(cbFn).to.be.a('function').with.lengthOf(1)
  })

  it('calls next with value from callback', done => {
    const cbValue = {}
    fromCallback((a, b, cb: Function) => cb(cbValue))('a', 'b').subscribe({
      error: done,
      next(value) {
        expect(value).to.equal(cbValue, 'callback value and next value are different')
        done()
      }
    })
  })

})
