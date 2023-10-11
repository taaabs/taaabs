import { Month_Entity } from '@repositories/modules/months/domain/entities/month.entity'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, months_actions } from '../months.slice'

export const process_tags = () => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const { months_data, yyyymm_gte, yyyymm_lte } = getState().months
    if (!months_data || !months_data.months) {
      dispatch(months_actions.set_tags({}))
      return
    }

    const calculate_tags = (months: Record<string, Month_Entity>) => {
      const monthsFiltered: typeof months_data.months = Object.keys(
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

    const tags = calculate_tags(months_data.months)

    dispatch(months_actions.set_tags(tags))
  }
}
