import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { search_actions } from '@repositories/stores/library/search/search.slice'
import {
  Orama,
  Results,
  TypedDocument,
  create,
  insertMultiple,
  search,
} from '@orama/orama'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

type Hint = {
  type: 'new' | 'recent'
  text: string
}

const schema = {
  title: 'string',
  sites: 'string',
  tags: 'string',
} as const

type Result = TypedDocument<Orama<typeof schema>>

export const use_search = () => {
  const dispatch = use_library_dispatch()
  const { is_fetching_searchable_bookmarks, searchable_bookmarks } =
    use_library_selector((state) => state.search)
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[]>([])

  const [db, set_db] = useState<Orama<typeof schema> | undefined>(undefined)
  const [orama_results, set_orama_results] = useState<Results<Result>>()

  useUpdateEffect(() => {
    if (
      !is_fetching_searchable_bookmarks &&
      searchable_bookmarks === undefined
    ) {
      dispatch(
        search_actions.initialize_search({
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    }
    if (search_string.length) {
      get_results(search_string)
    } else {
      set_hints([])
      set_orama_results(undefined)
    }
  }, [search_string])

  const init_db = async () => {
    if (searchable_bookmarks === undefined)
      throw new Error('[init_db] Bookmarks should be there.')

    const orama_db = await create({
      schema,
    })

    await insertMultiple(
      orama_db,
      searchable_bookmarks.map((bookmark) => ({
        id: bookmark.id.toString(),
        title: bookmark.title,
        sites: bookmark.sites,
        tags: bookmark.tags.join(' '),
      })),
    )

    set_db(orama_db)
  }

  useUpdateEffect(() => {
    if (searchable_bookmarks === undefined) return
    init_db()
  }, [searchable_bookmarks])

  useUpdateEffect(() => {
    get_results(search_string)
  }, [db])

  const get_results = async (search_string: string) => {
    if (!db) return

    const results: Results<Result> = await search(db, {
      term: search_string,
      limit: 500,
    })
    set_orama_results(results)
  }

  useUpdateEffect(() => {
    // set hints
    // set ids for bookmark fetching
    console.log(orama_results)
  }, [orama_results])

  return {
    is_fetching_searchable_bookmarks,
    search_string,
    set_search_string,
    hints,
  }
}
