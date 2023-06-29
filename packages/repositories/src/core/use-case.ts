export abstract class UseCase<T, P> {
  public abstract invoke(params: P): T
}

export type NoParams = Record<string, never>
