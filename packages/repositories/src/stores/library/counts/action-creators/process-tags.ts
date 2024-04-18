import { Month_Entity } from '@repositories/modules/counts/domain/entities/month.entity'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, counts_actions } from '../counts.slice'

export const process_tags = () => {
  return (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const { counts_data, yyyymm_gte, yyyymm_lte } = get_state().counts
    if (!counts_data || !counts_data.months) {
      dispatch(counts_actions.set_tags({}))
      return
    }

    const calculate_tags = (months: Record<string, Month_Entity>) => {
      const months_filtered: typeof counts_data.months = Object.keys(
        months,
      ).reduce((acc, val) => {
        const yyyymm = parseInt(val)
        let should_return_val = false

        if (yyyymm_gte && yyyymm_lte) {
          if (yyyymm >= yyyymm_gte && yyyymm <= yyyymm_lte) {
            should_return_val = true
          }
        } else if (yyyymm_gte && yyyymm >= yyyymm_gte) {
          should_return_val = true
        } else if (yyyymm_lte && yyyymm <= yyyymm_lte) {
          should_return_val = true
        } else {
          should_return_val = true
        }

        if (should_return_val) {
          return {
            ...acc,
            [val]: months[val],
          }
        } else {
          return {
            ...acc,
          }
        }
      }, {})

      const tags: Tags = {}

      Object.values(months_filtered).forEach((month) => {
        Object.entries(month.tags).forEach(([id, { name, yields }]) => {
          if (tags[id]) {
            tags[id].yields += yields
          } else {
            tags[id] = { name, yields }
          }
        })
      })

      const sorted_tags = Object.fromEntries(
        Object.keys(tags)
          .sort()
          .map((key) => [key, tags[key]]),
      )

      return sorted_tags
    }

    const tags = calculate_tags(counts_data.months)

    dispatch(counts_actions.set_tags(tags))
  }
}
