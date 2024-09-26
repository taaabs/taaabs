import { use_library_dispatch } from '@/stores/library'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { TagHierarchies as Ui_app_library_TagHierarchies } from '@web-ui/components/app/library/TagHierarchies'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { Filter } from '@/types/library/filter'
import { UpdateTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/update-tag-hierarchies.params'
import { AuthContext } from '@/providers/AuthProvider'
import { LocalDb } from '@/providers/LocalDbProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { LibraryContext } from './Library'

namespace _TagHierarchies {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _TagHierarchies: React.FC<_TagHierarchies.Props> = (props) => {
  const auth_context = useContext(AuthContext)
  const {
    bookmarks_hook,
    search_hook,
    tag_view_options_hook,
    date_view_options_hook,
    filter_view_options_hook,
    tag_hierarchies_hook,

    username,
    library_updated_at_timestamp,
    is_not_interactive,
    on_tag_rename_click,
    set_is_tag_hierarchy_ready,
  } = useContext(LibraryContext)
  const dispatch = use_library_dispatch()

  return (
    <div style={{ pointerEvents: is_not_interactive ? 'none' : undefined }}>
      <Ui_app_library_TagHierarchies
        library_updated_at_timestamp={library_updated_at_timestamp}
        on_ready={() => {
          set_is_tag_hierarchy_ready(true)
        }}
        show_skeleton={!library_updated_at_timestamp}
        is_read_only={!!username}
        tree={tag_hierarchies_hook.tag_hierarchies}
        on_update={async (
          tag_hierarchies: Ui_app_library_TagHierarchies.Node[],
        ) => {
          const filter = filter_view_options_hook.current_filter

          const update_tag_hierarchies_params: UpdateTagHierarchies_Params = {
            tag_hierarchies,
            gte: date_view_options_hook.current_gte,
            lte: date_view_options_hook.current_lte,
            starred_only:
              filter == Filter.STARRED ||
              filter == Filter.STARRED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
            unsorted_only:
              filter == Filter.UNSORTED ||
              filter == Filter.STARRED_UNSORTED ||
              filter == Filter.ARCHIVED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
            is_archived:
              filter == Filter.ARCHIVED ||
              filter == Filter.ARCHIVED_STARRED ||
              filter == Filter.ARCHIVED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
          }

          await dispatch(
            tag_hierarchies_actions.update_tag_hierarchies({
              update_tag_hierarchies_params,
              ky: auth_context.ky_instance,
              encryption_key: auth_context.auth_data!.encryption_key,
            }),
          )
          toast.success(props.dictionary.app.library.tag_hierarchies_upated)
        }}
        selected_tag_ids={tag_view_options_hook.selected_tags}
        is_updating={tag_hierarchies_hook.is_updating}
        on_item_click={(tag_ids: number[]) => {
          tag_view_options_hook.set_many_tags_to_search_params({
            tag_ids,
          })
        }}
        library_url={username ? `/${username}` : '/library'}
        dragged_tag={tag_view_options_hook.dragged_tag}
        all_bookmarks_yields={tag_hierarchies_hook.total}
        is_all_bookmarks_selected={!tag_view_options_hook.selected_tags.length}
        on_click_all_bookmarks={() => {
          tag_view_options_hook.clear_selected_tags()
          if (bookmarks_hook.showing_bookmarks_fetched_by_ids) {
            search_hook.reset()
            if (filter_view_options_hook.current_filter == Filter.NONE) {
              bookmarks_hook.get_bookmarks({})
            }
          }
        }}
        on_tag_rename_click={({ id, name }) => {
          on_tag_rename_click({ id, name })
        }}
        translations={{
          all_bookmarks: props.dictionary.app.library.all_bookmarks,
          drag_here: props.dictionary.app.library.drag_tag_here,
          delete: props.dictionary.app.library.delete,
          rename: props.dictionary.app.library.rename,
        }}
      />
    </div>
  )
}
