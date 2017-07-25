/* @flow */
import fromEvent from '../src/fromevent'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('fromEvent', () => {

  it('attaches event listener', done => {
    const optionsStub = {}
    const fakeDomNode = {
      removeEventListener() { done(new Error('removeEventListener was called but shoult not have been')) },
      addEventListener(name, fn, options) {
        expect(name).to.equal('click', 'fromEvent addedEventListener with wrong name')
        expect(fn).to.be.a('function', 'fromEvent addedEventListener passed incorrect callback type')
        expect(options).to.equal(optionsStub, 'fromEvent addedEventListener with wrong options')
        done()
      }
    }
    fromEvent('click', fakeDomNode, optionsStub).subscribe({})
  })

  it('removes event listener on unsubscribe', done => {
    let nextFn = null
    const optionsStub = {}
    const fakeDomNode = {
      addEventListener(name, fn) {
        nextFn = fn
      },
      removeEventListener(name, fn, options) {
        expect(name).to.equal('click', 'fromEvent removedEventListener with wrong name')
        expect(fn).to.equal(nextFn, 'fromEvent removedEventListener passed wrong function')
        expect(options).to.equal(optionsStub, 'fromEvent removedEventListener with wrong options')
        done()
      }
    }
    const unsubscribe = fromEvent('click', fakeDomNode, optionsStub).subscribe({ error: done })
    unsubscribe()
  })

})
