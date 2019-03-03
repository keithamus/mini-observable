export interface Subscription {
  closed: boolean;
  unsubscribe:() => void
}

export type ObserverStart = (subscription: Subscription) => void
export type ObserverNext<T> = (() => void) | ((value: T) => void)
export type ObserverError = (error: Error) => void
export type ObserverComplete = (value?) => void;

export interface SubscriptionObserver<T> {
  closed: boolean;
  error: ObserverError;
  complete: ObserverComplete;
  next: ObserverNext<T>;
}

interface OptionalObserver<T> {
  start?: ObserverStart;
  error?: ObserverError;
  complete?: ObserverComplete;
  next?: ObserverNext<T>;
}

export type SloppyObserver<T> = OptionalObserver<T> | ObserverNext<T>

export type SubscriberFunction<T> = (observer: SubscriptionObserver<T>) => Subscription | { unsubscribe: () => void } | (() => void) | void;

export class Observable<T> {
  public constructor(callback: SubscriberFunction<T>);
  public subscribe(observer: SloppyObserver<T>);
}
