import { RenameTag_Params } from './rename-tag.params'

export type Tags_Repository = {
  rename(params: RenameTag_Params): Promise<void>
}
