import { GetSaves_Dto } from '@shared/types/modules/saves/get_saves.dto'
import { GetSaves_Params } from '../../domain/types/get_saves.params'

export type Saves_DataSource = {
  get_saves(params: GetSaves_Params): Promise<GetSaves_Dto.Response>
}