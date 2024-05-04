export abstract class UseCase<T, P> {
  public abstract invoke(params: P, encryption_key?: Uint8Array): T
}

export type NoParams = Record<string, never>
