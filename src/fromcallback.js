/* @flow */
import Observable from './observable'

export default function fromCallback(func: Function): (...args: *[]) => Observable<*> {
  return (...args) => new Observable(({next}) => func(...args.concat(next)))
}
