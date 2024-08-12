import { GetSaves_Params } from '../types/get_saves.params'
import { GetSaves_Ro } from '../types/get_saves.ro'

export type Saves_Repository = {
  get_saves(params: GetSaves_Params): Promise<GetSaves_Ro>
}