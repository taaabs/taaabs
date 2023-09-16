import { Area, AreaChart, Brush, ResponsiveContainer, YAxis } from 'recharts'
import styles from './months.module.scss'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import { memo, useEffect, useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import dayjs from 'dayjs'
import { Icon } from '@web-ui/components/common/particles/icon'

type Months = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  nsfw_count: number
}[]

export namespace Months {
  export type Props = {
    months: Months | null
    current_gte?: number
    current_lte?: number
    on_yyyymm_change: ({ gte, lte }: { gte: number; lte: number }) => void
    clear_date_range: () => void
    selected_tags?: string
    has_results?: boolean
    is_getting_data: boolean
  }
}

export const Months: React.FC<Months.Props> = memo(
  (props) => {
    const graph = useRef<HTMLDivElement>(null)
    const { swiping: is_swiping } = useSwipe(undefined, {
      preventDefault: false,
      passive: false,
      threshold: 0,
    })
    const [key, set_key] = useState('')
    const [start_index, set_start_index] = useState<number | null>(null)
    const [end_index, set_end_index] = useState<number | null>(null)
    const [dragged_start_index, set_dragged_start_index] = useState<
      number | null
    >(null)
    const [dragged_end_index, set_dragged_end_index] = useState<number | null>(
      null,
    )
    const [bookmark_count, set_bookmark_count] = useState<number | null>(null)
    const [starred_count, set_starred_count] = useState<number | null>(null)
    const [nsfw_count, set_nsfw_count] = useState<number | null>(null)

    useUpdateEffect(() => {
      if (
        !is_swiping &&
        props.months &&
        dragged_start_index != undefined &&
        dragged_end_index != undefined &&
        props.months[dragged_start_index] &&
        props.months[dragged_end_index]
      ) {
        props.on_yyyymm_change({
          gte: props.months[dragged_start_index].yyyymm,
          lte: props.months[dragged_end_index].yyyymm,
        })

        set_dragged_start_index(null)
        set_dragged_end_index(null)
      }
    }, [is_swiping])

    const calculate_counts = ({
      months,
      startIndex,
      endIndex,
    }: {
      months: Months | null
      startIndex?: number
      endIndex?: number
    }) => {
      if (!months) return
      let monthsSliced: Months = []
      if (startIndex != undefined && endIndex != undefined) {
        monthsSliced = months.slice(startIndex, endIndex + 1)
      } else {
        monthsSliced = months
      }
      let bookmarkCount = 0
      let starredCount = 0
      let nsfwCount = 0
      monthsSliced.forEach((month) => {
        bookmarkCount += month.bookmark_count
        starredCount += month.starred_count
        nsfwCount += month.nsfw_count
      })
      set_bookmark_count(bookmarkCount)
      set_starred_count(starredCount)
      set_nsfw_count(nsfwCount)
    }

    const possible_start_index = ({
      months,
      current_gte,
    }: {
      months: Months
      current_gte: number
    }): number | null => {
      const start_index =
        months && current_gte
          ? months.find((month) => month.yyyymm == current_gte)
            ? months.findIndex((month) => month.yyyymm == current_gte)
            : months.findIndex((month) => {
                const monthsFiltered = months!.filter(
                  (m) => m.yyyymm > current_gte!,
                )
                return monthsFiltered.length
                  ? month.yyyymm ==
                      monthsFiltered
                        .map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_gte!) <
                          Math.abs(prev - current_gte!)
                            ? curr
                            : prev,
                        )
                  : month.yyyymm ==
                      props
                        .months!.map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_gte!) <
                          Math.abs(prev - current_gte!)
                            ? curr
                            : prev,
                        )
              })
          : null

      return start_index != -1 ? start_index : null
    }

    const possibleEndIndex = ({
      months,
      current_lte,
    }: {
      months: Months
      current_lte: number
    }): number | null => {
      const endIndex =
        months && current_lte
          ? months.find((month) => month.yyyymm == current_lte)
            ? months.findIndex((month) => month.yyyymm == current_lte)
            : months.findIndex((month) => {
                const monthsFiltered = months!.filter(
                  (m) => m.yyyymm < current_lte!,
                )
                return monthsFiltered.length
                  ? month.yyyymm ==
                      monthsFiltered
                        .map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_lte!) <
                          Math.abs(prev - current_lte!)
                            ? curr
                            : prev,
                        )
                  : month.yyyymm ==
                      props
                        .months!.map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_lte!) <
                          Math.abs(prev - current_lte!)
                            ? curr
                            : prev,
                        )
              })
          : null

      return endIndex != -1 ? endIndex : null
    }

    const set_start_and_end_index = ({
      months,
      current_gte,
      current_lte,
    }: {
      months: Months
      current_gte: number
      current_lte: number
    }) => {
      set_start_index(possible_start_index({ months, current_gte }))
      set_end_index(possibleEndIndex({ months, current_lte }))
    }

    const setStartAndEndIndexThrottled = useThrottledCallback(
      set_start_and_end_index,
      [set_start_index, set_end_index],
      50,
    )

    const calculateCountsThrottled = useThrottledCallback(
      calculate_counts,
      [],
      50,
    )

    useUpdateEffect(() => {
      if (
        !props.months ||
        dragged_start_index == undefined ||
        dragged_end_index == undefined
      )
        return

      setStartAndEndIndexThrottled({
        months: props.months,
        current_gte: props.months[dragged_start_index].yyyymm,
        current_lte: props.months[dragged_end_index].yyyymm,
      })

      calculateCountsThrottled({
        months: props.months,
        startIndex: dragged_start_index,
        endIndex: dragged_end_index,
      })
    }, [dragged_start_index, dragged_end_index])

    useUpdateEffect(() => {
      calculate_counts({
        months: props.months,
        startIndex: start_index != null ? start_index : undefined,
        endIndex: end_index != null ? end_index : undefined,
      })

      if (!is_swiping) {
        set_key(`${start_index}${end_index}${props.selected_tags}`)
      }
    }, [start_index, end_index, props.months])

    useEffect(() => {
      if (!props.months || !props.current_gte || !props.current_lte) {
        set_key(`${start_index}${end_index}${props.selected_tags}`)
        set_start_index(null)
        set_end_index(null)

        return
      }

      set_start_and_end_index({
        months: props.months,
        current_gte: props.current_gte,
        current_lte: props.current_lte,
      })
    }, [
      props.current_gte,
      props.current_lte,
      props.months,
      props.selected_tags,
    ])

    useUpdateEffect(() => {
      if (props.has_results == undefined) {
        set_bookmark_count(null)
      }
    }, [props.has_results])

    useEffect(() => {
      if (
        !props.months ||
        props.current_gte ||
        props.current_lte ||
        dragged_start_index != undefined ||
        dragged_end_index != undefined
      )
        return

      calculate_counts({
        months: props.months,
        startIndex: 0,
        endIndex: props.months.length - 1,
      })
    }, [props.months])

    return (
      <div className={styles.graph} ref={graph}>
        {props.months && (
          <div className={styles.graph__details}>
            <div className={styles.graph__details__title}>Date range</div>
            <div className={styles['graph__details__current-range']}>
              {props.months.length > 0
                ? start_index != undefined &&
                  props.months[start_index] &&
                  end_index != undefined &&
                  props.months[end_index]
                  ? _yyyymmToDisplay(props.months[start_index].yyyymm) +
                    (end_index != start_index
                      ? ` - ${_yyyymmToDisplay(props.months[end_index].yyyymm)}`
                      : '')
                  : 'All history'
                : props.current_gte && props.current_lte
                ? `${_yyyymmToDisplay(props.current_gte)} - ${_yyyymmToDisplay(
                    props.current_lte,
                  )}`
                : 'All history'}
            </div>
            {props.has_results && bookmark_count && bookmark_count > 0 ? (
              <div className={styles.graph__details__counts}>
                <div className={styles.graph__details__counts__total}>
                  {bookmark_count}
                </div>
                {starred_count != undefined && starred_count > 0 && (
                  <div className={styles.graph__details__counts__starred}>
                    {starred_count}
                  </div>
                )}
                {nsfw_count != undefined && nsfw_count > 0 && (
                  <div className={styles.graph__details__counts__nsfw}>
                    {nsfw_count}
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        )}

        {props.current_gte && props.current_lte && (
          <button
            className={styles.graph__clear}
            onClick={props.clear_date_range}
          >
            <Icon variant="ADD" />
          </button>
        )}

        {!props.is_getting_data && props.months && props.months.length >= 2 && (
          <div className={styles.graph__recharts}>
            <ResponsiveContainer width={'100%'} height={135} key={key}>
              <AreaChart margin={{ left: 0, top: 5 }} data={props.months}>
                <defs>
                  <linearGradient
                    id="bookmarkCount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--Months-chart-fill)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--Months-chart-fill)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="basis"
                  dataKey="bookmark_count"
                  strokeWidth={0}
                  fill="url(#bookmarkCount)"
                  isAnimationActive={false}
                />
                <Area
                  type="basis"
                  dataKey="starred_count"
                  strokeWidth={0}
                  fill="var(--Months-chart-starred-fill)"
                  fillOpacity={starred_count == 0 ? 0 : 1}
                  isAnimationActive={false}
                />
                <Area
                  type="basis"
                  dataKey="bookmark_count"
                  strokeWidth={2}
                  stroke="var(--Months-chart-stroke)"
                  isAnimationActive={false}
                  fill="transparent"
                  strokeOpacity={bookmark_count == 0 ? 0 : 1}
                />
                <Area
                  type="basis"
                  dataKey="nsfw_count"
                  strokeWidth={2}
                  stroke="var(--Months-chart-nsfw-stroke)"
                  fill="transparent"
                  isAnimationActive={false}
                  strokeOpacity={nsfw_count == 0 ? 0 : 1}
                />
                <YAxis tickCount={1} width={0} />
                <Brush
                  startIndex={start_index != null ? start_index : undefined}
                  endIndex={end_index != null ? end_index : undefined}
                  height={40}
                  travellerWidth={24}
                  fill="transparent"
                  onChange={({ startIndex, endIndex }) => {
                    if (
                      startIndex == undefined ||
                      endIndex == undefined ||
                      !props.months
                    )
                      return

                    set_dragged_start_index(startIndex)
                    set_dragged_end_index(endIndex)
                  }}
                  className={styles.graph__recharts__brush}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {props.has_results && props.months && props.months.length <= 1 && (
          <div className={styles.graph__info}>All results fit in one month</div>
        )}

        {props.has_results == false && (
          <div className={styles.graph__info}>There is nothing to plot</div>
        )}
      </div>
    )
  },
  (o, n) =>
    o.clear_date_range == n.clear_date_range &&
    JSON.stringify(o.months) == JSON.stringify(n.months),
)

function _yyyymmToDisplay(yyyymm: number) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
  ).format('MMM YYYY')
}
