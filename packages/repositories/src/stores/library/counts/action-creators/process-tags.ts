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
      const monthsFiltered: typeof counts_data.months = Object.keys(
        months,
      ).reduce((acc, val) => {
        const yyyymm = parseInt(val)
        let shouldReturnVal = false

        if (yyyymm_gte && yyyymm_lte) {
          if (yyyymm >= yyyymm_gte && yyyymm <= yyyymm_lte) {
            shouldReturnVal = true
          }
        } else if (yyyymm_gte && yyyymm >= yyyymm_gte) {
          shouldReturnVal = true
        } else if (yyyymm_lte && yyyymm <= yyyymm_lte) {
          shouldReturnVal = true
        } else {
          shouldReturnVal = true
        }

        if (shouldReturnVal) {
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

      Object.values(monthsFiltered).forEach((month) => {
        Object.entries(month.tags).forEach(([name, { id, yields }]) => {
          if (tags[name]) {
            tags[name].yields += yields
          } else {
            tags[name] = { id, yields }
          }
        })
      })

      const sortedTags = Object.fromEntries(
        Object.keys(tags)
          .sort()
          .map((key) => [key, tags[key]]),
      )

      return sortedTags
    }

    const tags = calculate_tags(counts_data.months)

    dispatch(counts_actions.set_tags(tags))
  }
}
