/* @flow */
import Observable from '../src/observable.js'
import tc39Tests from 'es-observable-tests'
import {describe, it} from 'mocha'

describe('TC39 tests', () => {

  it('TC39 tests (not all will pass)', () =>
    tc39Tests.runTests(Observable).then(status => {
      if (status.logger.failed > status.logger.passed) {
        throw new Error(`too many tc39 tests failed! (${status.logger.failed})`)
      }
    })
  )

})
