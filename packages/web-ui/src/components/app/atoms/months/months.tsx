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
    is_fetching_data?: boolean
    is_range_selector_disabled?: boolean
  }
}

export const Months: React.FC<Months.Props> = memo(
  (props) => {
    const [months_to_render, set_months_to_render] = useState<Months | null>(
      null,
    )
    const [date, set_date] = useState<string | null>(null)
    const graph = useRef<HTMLDivElement>(null)
    const { swiping: is_swiping } = useSwipe(graph, {
      preventDefault: false,
      threshold: 0,
    })
    const [key, set_key] = useState('')
    const [start_index, set_start_index] = useState<number | null>(null)
    const [end_index, set_end_index] = useState<number | null>(null)
    const [previous_start_index, set_previous_start_index] = useState<
      number | null
    >(null)
    const [previous_end_index, set_previous_end_index] = useState<
      number | null
    >(null)
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
      if (props.is_range_selector_disabled) return

      if (
        !is_swiping &&
        months_to_render &&
        dragged_start_index != undefined &&
        dragged_end_index != undefined &&
        months_to_render[dragged_start_index] &&
        months_to_render[dragged_end_index]
      ) {
        props.on_yyyymm_change({
          gte: months_to_render[dragged_start_index].yyyymm,
          lte: months_to_render[dragged_end_index].yyyymm,
        })

        set_dragged_start_index(null)
        set_dragged_end_index(null)
      }
    }, [is_swiping])

    const calculate_counts = (params: {
      months: Months | null
      start_index?: number
      end_index?: number
    }) => {
      if (!params.months) return

      let months_sliced: Months = []
      if (start_index != undefined && end_index != undefined) {
        months_sliced = params.months.slice(start_index, end_index + 1)
      } else {
        months_sliced = params.months
      }

      let bookmark_count = 0
      let starred_count = 0
      let nsfw_count = 0

      months_sliced.forEach((month) => {
        bookmark_count += month.bookmark_count
        starred_count += month.starred_count
        nsfw_count += month.nsfw_count
      })

      set_bookmark_count(bookmark_count)
      set_starred_count(starred_count)
      set_nsfw_count(nsfw_count)

      set_months_to_render(props.months)

      set_date(
        params.months.length > 0
          ? start_index != undefined &&
            params.months[start_index] &&
            end_index != undefined &&
            params.months[end_index]
            ? yyyymm_to_display(params.months[start_index].yyyymm) +
              (end_index != start_index
                ? ` - ${yyyymm_to_display(params.months[end_index].yyyymm)}`
                : '')
            : yyyymm_to_display(params.months[0].yyyymm) +
              (params.months.length > 1
                ? ` - ${yyyymm_to_display(
                    params.months[params.months.length - 1].yyyymm,
                  )}`
                : '')
          : '',
      )
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

    const possible_end_index = ({
      months,
      current_lte,
    }: {
      months: Months
      current_lte: number
    }): number | null => {
      const end_index =
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

      return end_index != -1 ? end_index : null
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
      set_end_index(possible_end_index({ months, current_lte }))
    }

    const set_start_and_end_index_throttled = useThrottledCallback(
      set_start_and_end_index,
      [set_start_index, set_end_index],
      50,
    )

    useUpdateEffect(() => {
      if (
        !props.months ||
        dragged_start_index == undefined ||
        dragged_end_index == undefined
      )
        return

      set_start_and_end_index_throttled({
        months: props.months,
        current_gte: props.months[dragged_start_index].yyyymm,
        current_lte: props.months[dragged_end_index].yyyymm,
      })
    }, [dragged_start_index, dragged_end_index])

    useEffect(() => {
      if (
        JSON.stringify(props.months) != JSON.stringify(months_to_render) ||
        start_index != previous_start_index ||
        end_index != previous_end_index
      ) {
        calculate_counts({
          months: props.months,
          start_index: start_index != null ? start_index : undefined,
          end_index: end_index != null ? end_index : undefined,
        })
      }

      set_previous_start_index(start_index)
      set_previous_end_index(end_index)
    }, [start_index, end_index, props.months])

    useEffect(() => {
      if (!props.months || !props.current_gte || !props.current_lte) {
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

    useEffect(() => {
      if (
        !props.months ||
        bookmark_count != null ||
        props.current_gte ||
        props.current_lte ||
        dragged_start_index != undefined ||
        dragged_end_index != undefined
      )
        return

      calculate_counts({
        months: props.months,
        start_index: 0,
        end_index: props.months.length - 1,
      })
    }, [props.months])

    return (
      <div className={styles.graph} ref={graph}>
        <div className={styles.graph__details}>
          <div className={styles.graph__details__title}>Date range</div>
          <div className={styles['graph__details__current-range']}>
            {!props.has_results && !props.is_fetching_data ? (
              props.current_gte && props.current_lte ? (
                yyyymm_to_display(props.current_gte) +
                (props.current_gte != props.current_lte
                  ? ` - ${yyyymm_to_display(props.current_lte)}`
                  : '')
              ) : (
                'All history'
              )
            ) : !props.is_range_selector_disabled ? (
              date ? (
                date
              ) : props.current_gte && props.current_lte ? (
                yyyymm_to_display(props.current_gte) +
                (props.current_gte != props.current_lte
                  ? ` - ${yyyymm_to_display(props.current_lte)}`
                  : '')
              ) : (
                <></>
              )
            ) : (
              'All history'
            )}
          </div>
          {(props.has_results || props.is_fetching_data) &&
          bookmark_count &&
          bookmark_count > 0 ? (
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

        {props.current_gte && props.current_lte && (
          <button
            className={styles.graph__clear}
            onClick={() => {
              props.clear_date_range()
              set_key(Math.random().toString())
            }}
          >
            <Icon variant="ADD" />
          </button>
        )}

        {!props.is_range_selector_disabled &&
          (props.has_results || props.is_fetching_data) &&
          months_to_render &&
          months_to_render.length >= 2 && (
            <div className={styles.graph__recharts}>
              <ResponsiveContainer width={'100%'} height={135} key={key}>
                <AreaChart margin={{ left: 0, top: 5 }} data={months_to_render}>
                  <defs>
                    <linearGradient
                      id="bookmark-count"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--Months-chart-fill)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--Months-chart-fill)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="basis"
                    dataKey="bookmark_count"
                    strokeWidth={0}
                    fill="url(#bookmark-count)"
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
                        !months_to_render
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

        {props.has_results &&
          months_to_render &&
          months_to_render.length < 2 &&
          !props.is_range_selector_disabled && (
            <div className={styles.graph__info}>
              All results fit in one month
            </div>
          )}

        {!props.is_range_selector_disabled &&
          !props.has_results &&
          !props.is_fetching_data && (
            <div className={styles.graph__info}>There is nothing to plot</div>
          )}

        {props.is_range_selector_disabled && (
          <div className={styles.graph__info}>
            Range selection is unavailable for current sort option
          </div>
        )}
      </div>
    )
  },
  (o, n) =>
    o.has_results == n.has_results &&
    o.clear_date_range == n.clear_date_range &&
    o.is_range_selector_disabled == n.is_range_selector_disabled &&
    JSON.stringify(o.months) == JSON.stringify(n.months),
)

function yyyymm_to_display(yyyymm: number) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
  ).format('MMM YYYY')
}
