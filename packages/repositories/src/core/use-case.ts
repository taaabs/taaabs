export abstract class UseCase<T, P> {
  abstract invoke(params: P): T
}

export type NoParams = {}
export type NoPlaceholders = {}
