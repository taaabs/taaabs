import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import { CustomRangeSkeleton as Ui_app_library_CustomRangeSkeleton } from '@web-ui/components/app/library/CustomRangeSkeleton'
import { LibraryAside as Ui_app_templates_LibraryAside } from '@web-ui/components/app/templates/LibraryAside'
import { SelectedTags as Ui_app_library_SelectedTags } from '@web-ui/components/app/library/SelectedTags'
import { Tags as Ui_app_library_Tags } from '@web-ui/components/app/library/Tags'
import { TagsSkeleton as Ui_app_library_TagsSkeleton } from '@web-ui/components/app/library/TagsSkeleton'
import { SegmentedButtonsSkeleton as Ui_app_library_SegmentedButtonsSkeleton } from '@web-ui/components/app/library/SegmentedButtonsSkeleton'
import { SegmentedButton as Ui_common_SegmentedButton } from '@web-ui/components/common/SegmentedButton'
import { use_is_hydrated } from '@shared/hooks'

import { LocalDb } from '@/providers/LocalDbProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { LibraryContext } from './Library'
import { PopstateCountContext } from '@/providers/PopstateCountProvider'

const CustomRange = dynamic(() => import('./_aside/dynamic-custom-range'), {
  ssr: false,
  loading: () => <Ui_app_library_CustomRangeSkeleton />,
})

namespace _Aside {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _Aside: React.FC<_Aside.Props> = (props) => {
  const {
    search_hook,
    tag_view_options_hook,
    date_view_options_hook,
    counts_hook,
    sort_by_view_options_hook,
    order_view_options_hook,

    username,
    is_fetching_first_bookmarks,
    library_updated_at_timestamp,
    is_not_interactive,
    on_tag_rename_click,
  } = useContext(LibraryContext)
  const is_hydrated = use_is_hydrated()
  const { popstate_count } = useContext(PopstateCountContext)

  return (
    <Ui_app_templates_LibraryAside
      support_label={props.dictionary.app.library.send_feedback}
      support_href="https://github.com/taaabs/taaabs/discussions"
      slot_segmented_buttons={
        is_hydrated ? (
          <>
            <Ui_common_SegmentedButton
              key={`1-${popstate_count}`}
              is_not_interactive={is_not_interactive}
              items={[
                {
                  label: props.dictionary.app.library.sort_by_options.date,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by !=
                    SortBy.POPULARITY,
                },
                {
                  label:
                    props.dictionary.app.library.sort_by_options.the_huggiest,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by ==
                    SortBy.POPULARITY,
                },
              ]}
              on_item_click={(option_idx) => {
                if (
                  option_idx == 0 &&
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                ) {
                  sort_by_view_options_hook.set_sort_by_query_param(
                    SortBy.CREATED_AT,
                  )
                } else if (option_idx == 1) {
                  sort_by_view_options_hook.set_sort_by_query_param(
                    SortBy.POPULARITY,
                  )
                }
              }}
            />
            {!username ? (
              <Ui_common_SegmentedButton
                key={`2-${popstate_count}`}
                is_not_interactive={is_not_interactive}
                is_disabled={
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                }
                items={[
                  {
                    label: props.dictionary.app.library.sort_by_options.added,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.updated,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.UPDATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.visited,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.VISITED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.UPDATED_AT,
                    )
                  } else if (option_idx == 2) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.VISITED_AT,
                    )
                  }
                }}
              />
            ) : (
              <Ui_common_SegmentedButton
                key={`2-${popstate_count}`}
                is_not_interactive={is_not_interactive}
                is_disabled={
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                }
                items={[
                  {
                    label: props.dictionary.app.library.sort_by_options.added,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.updated,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.UPDATED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.UPDATED_AT,
                    )
                  }
                }}
              />
            )}
            <Ui_common_SegmentedButton
              key={`3-${popstate_count}`}
              is_not_interactive={is_not_interactive}
              is_disabled={
                sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
              }
              items={[
                {
                  label: props.dictionary.app.library.order_options.newest,
                  is_selected:
                    order_view_options_hook.current_order == Order.DESC,
                },
                {
                  label: props.dictionary.app.library.order_options.oldest,
                  is_selected:
                    order_view_options_hook.current_order == Order.ASC,
                },
              ]}
              on_item_click={(option_idx) => {
                if (option_idx == 0) {
                  order_view_options_hook.set_order_query_param(Order.DESC)
                } else if (option_idx == 1) {
                  order_view_options_hook.set_order_query_param(Order.ASC)
                }
              }}
            />
          </>
        ) : (
          <Ui_app_library_SegmentedButtonsSkeleton />
        )
      }
      slot_custom_range={
        library_updated_at_timestamp ? (
          <div
            style={{
              pointerEvents: is_fetching_first_bookmarks ? 'none' : undefined,
            }}
          >
            <CustomRange
              locale={props.dictionary.locale}
              library_updated_at_timestamp={library_updated_at_timestamp}
              counts={counts_hook.months || undefined}
              on_yyyymm_change={
                date_view_options_hook.set_gte_lte_search_params
              }
              clear_date_range={
                date_view_options_hook.clear_gte_lte_search_params
              }
              current_gte={date_view_options_hook.current_gte}
              current_lte={date_view_options_hook.current_lte}
              selected_tags={tag_view_options_hook.selected_tags}
              is_range_selector_disabled={
                sort_by_view_options_hook.current_sort_by ==
                  SortBy.UPDATED_AT ||
                sort_by_view_options_hook.current_sort_by ==
                  SortBy.VISITED_AT ||
                sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
              }
              translations={{
                custom_range: props.dictionary.app.library.range_of_months,
                range_not_available:
                  props.dictionary.app.library.range_not_available,
                nothing_to_plot: props.dictionary.app.library.nothing_to_plot,
                results_fit_in_one_month:
                  props.dictionary.app.library.results_fit_in_one_month,
              }}
            />
          </div>
        ) : (
          <Ui_app_library_CustomRangeSkeleton />
        )
      }
      slot_tags={
        <div
          style={{
            opacity:
              library_updated_at_timestamp &&
              is_fetching_first_bookmarks &&
              !search_hook.search_string
                ? 'var(--dimmed-opacity)'
                : undefined,
            pointerEvents: is_not_interactive ? 'none' : undefined,
          }}
        >
          {library_updated_at_timestamp ? (
            <>
              <Ui_app_library_SelectedTags
                key={`selected-tags-${library_updated_at_timestamp}-${popstate_count}`}
                selected_tags={tag_view_options_hook.selected_tags
                  .filter((id) =>
                    !counts_hook.tags ? false : counts_hook.tags[id],
                  )
                  .map((id) => {
                    return {
                      id,
                      name: counts_hook.tags ? counts_hook.tags![id].name : '',
                    }
                  })}
                on_selected_tag_click={(tag_id) =>
                  tag_view_options_hook.remove_tags_from_search_params([tag_id])
                }
                on_tag_rename_click={(id: number) => {
                  const name = counts_hook.tags![id].name
                  on_tag_rename_click({ name, id })
                }}
                translations={{
                  rename: props.dictionary.app.library.rename,
                }}
              />
              <Ui_app_library_Tags
                key={`tags-${library_updated_at_timestamp}-${popstate_count}`}
                library_url={username ? `/${username}` : '/library'}
                tags={
                  counts_hook.tags
                    ? Object.entries(counts_hook.tags)
                        .filter(
                          (tag) =>
                            !tag_view_options_hook.selected_tags.includes(
                              parseInt(tag[0]),
                            ),
                        )
                        .map((tag) => ({
                          id: parseInt(tag[0]),
                          name: tag[1].name,
                          yields: tag[1].yields,
                        }))
                    : []
                }
                on_click={tag_view_options_hook.add_tag_to_search_params}
                on_tag_drag_start={
                  !username ? tag_view_options_hook.set_dragged_tag : undefined
                }
                on_tag_rename_click={(id: number) => {
                  const name = counts_hook.tags![id].name
                  on_tag_rename_click({ name, id })
                }}
                translations={{
                  rename: props.dictionary.app.library.rename,
                }}
              />
            </>
          ) : (
            <Ui_app_library_TagsSkeleton />
          )}
        </div>
      }
    />
  )
}
