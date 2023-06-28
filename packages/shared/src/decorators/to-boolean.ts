import { Transform } from 'class-transformer'

/**
 * @see {@link https://stackoverflow.com/a/72527802}
 */
export function ToBoolean(): (target: any, key: string) => void {
  return Transform(({ obj, key }) => obj[key] == 'true' || obj[key] == '1')
}
