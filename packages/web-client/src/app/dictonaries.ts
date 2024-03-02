import { Dictionary } from '@/dictionaries/dictionary'
import 'server-only'

const dictionaries: { [lang: string]: () => Promise<Dictionary> } = {
  en: () => import('../dictionaries/en').then((module) => module.default),
  pl: () => import('../dictionaries/pl').then((module) => module.default),
}

export const get_dictionary = async (locale: string) => dictionaries[locale]()
