import { Area, AreaChart, Brush, ResponsiveContainer, YAxis } from 'recharts'
import styles from './custom-range.module.scss'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import { memo, useEffect, useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import dayjs from 'dayjs'
import { Icon } from '@web-ui/components/common/particles/icon'

type Counts = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  unread_count: number
}[]

export namespace CustomRange {
  export type Props = {
    counts: Counts | null
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

export const CustomRange: React.FC<CustomRange.Props> = memo(
  function CustomRange(props) {
    const [counts_to_render, set_counts_to_render] = useState<Counts | null>(
      null,
    )
    const [date, set_date] = useState<string | null>(null)
    const custom_range = useRef<HTMLDivElement>(null)
    const { swiping: is_swiping } = useSwipe(custom_range, {
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
    const [unread_count, set_unread_count] = useState<number | null>(null)

    useUpdateEffect(() => {
      if (props.is_range_selector_disabled) return

      if (
        !is_swiping &&
        counts_to_render &&
        dragged_start_index != undefined &&
        dragged_end_index != undefined &&
        counts_to_render[dragged_start_index] &&
        counts_to_render[dragged_end_index]
      ) {
        props.on_yyyymm_change({
          gte: counts_to_render[dragged_start_index].yyyymm,
          lte: counts_to_render[dragged_end_index].yyyymm,
        })

        set_dragged_start_index(null)
        set_dragged_end_index(null)
      }
    }, [is_swiping])

    const calculate_counts = (params: {
      counts: Counts | null
      start_index?: number
      end_index?: number
    }) => {
      if (!params.counts) return

      let counts_sliced: Counts = []
      if (start_index != undefined && end_index != undefined) {
        counts_sliced = params.counts.slice(start_index, end_index + 1)
      } else {
        counts_sliced = params.counts
      }

      let bookmark_count = 0
      let starred_count = 0
      let unread_count = 0

      counts_sliced.forEach((el) => {
        bookmark_count += el.bookmark_count
        starred_count += el.starred_count
        unread_count += el.unread_count
      })

      set_bookmark_count(bookmark_count)
      set_starred_count(starred_count)
      set_unread_count(unread_count)

      set_counts_to_render(props.counts)

      set_date(
        params.counts.length > 0
          ? start_index != undefined &&
            params.counts[start_index] &&
            end_index != undefined &&
            params.counts[end_index]
            ? yyyymm_to_display(params.counts[start_index].yyyymm) +
              (end_index != start_index
                ? ` - ${yyyymm_to_display(params.counts[end_index].yyyymm)}`
                : '')
            : yyyymm_to_display(params.counts[0].yyyymm) +
              (params.counts.length > 1
                ? ` - ${yyyymm_to_display(
                    params.counts[params.counts.length - 1].yyyymm,
                  )}`
                : '')
          : '',
      )
    }

    const possible_start_index = ({
      counts,
      current_gte,
    }: {
      counts: Counts
      current_gte: number
    }): number | null => {
      const start_index =
        counts && current_gte
          ? counts.find((el) => el.yyyymm == current_gte)
            ? counts.findIndex((el) => el.yyyymm == current_gte)
            : counts.findIndex((el) => {
                const counts_filtered = counts!.filter(
                  (m) => m.yyyymm > current_gte!,
                )
                return counts_filtered.length
                  ? el.yyyymm ==
                      counts_filtered
                        .map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_gte!) <
                          Math.abs(prev - current_gte!)
                            ? curr
                            : prev,
                        )
                  : el.yyyymm ==
                      props
                        .counts!.map((m) => m.yyyymm)
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
      counts,
      current_lte,
    }: {
      counts: Counts
      current_lte: number
    }): number | null => {
      const end_index =
        counts && current_lte
          ? counts.find((el) => el.yyyymm == current_lte)
            ? counts.findIndex((el) => el.yyyymm == current_lte)
            : counts.findIndex((el) => {
                const counts_filtered = counts!.filter(
                  (m) => m.yyyymm < current_lte!,
                )
                return counts_filtered.length
                  ? el.yyyymm ==
                      counts_filtered
                        .map((m) => m.yyyymm)
                        .reduce((prev, curr) =>
                          Math.abs(curr - current_lte!) <
                          Math.abs(prev - current_lte!)
                            ? curr
                            : prev,
                        )
                  : el.yyyymm ==
                      props
                        .counts!.map((m) => m.yyyymm)
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
      counts,
      current_gte,
      current_lte,
    }: {
      counts: Counts
      current_gte: number
      current_lte: number
    }) => {
      set_start_index(possible_start_index({ counts, current_gte }))
      set_end_index(possible_end_index({ counts, current_lte }))
    }

    const set_start_and_end_index_throttled = useThrottledCallback(
      set_start_and_end_index,
      [set_start_index, set_end_index],
      60,
    )

    useUpdateEffect(() => {
      if (
        !props.counts ||
        dragged_start_index == undefined ||
        dragged_end_index == undefined
      )
        return

      set_start_and_end_index_throttled({
        counts: props.counts,
        current_gte: props.counts[dragged_start_index].yyyymm,
        current_lte: props.counts[dragged_end_index].yyyymm,
      })
    }, [dragged_start_index, dragged_end_index])

    useEffect(() => {
      if (
        JSON.stringify(props.counts) != JSON.stringify(counts_to_render) ||
        start_index != previous_start_index ||
        end_index != previous_end_index
      ) {
        calculate_counts({
          counts: props.counts,
          start_index: start_index != null ? start_index : undefined,
          end_index: end_index != null ? end_index : undefined,
        })
      }

      set_previous_start_index(start_index)
      set_previous_end_index(end_index)
    }, [start_index, end_index, props.counts])

    useEffect(() => {
      if (!props.counts || !props.current_gte || !props.current_lte) {
        set_start_index(null)
        set_end_index(null)

        return
      }

      set_start_and_end_index({
        counts: props.counts,
        current_gte: props.current_gte,
        current_lte: props.current_lte,
      })
    }, [
      props.current_gte,
      props.current_lte,
      props.counts,
      props.selected_tags,
    ])

    useEffect(() => {
      if (
        !props.counts ||
        bookmark_count != null ||
        props.current_gte ||
        props.current_lte ||
        dragged_start_index != undefined ||
        dragged_end_index != undefined
      )
        return

      calculate_counts({
        counts: props.counts,
        start_index: 0,
        end_index: props.counts.length - 1,
      })
    }, [props.counts])

    return (
      <div className={styles['custom-range']} ref={custom_range}>
        <div className={styles['custom-range__details']}>
          <div className={styles['custom-range__details__title']}>
            Custom range
          </div>
          <div className={styles['custom-range__details__current-range']}>
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
            <div className={styles['custom-range__details__counts']}>
              <div className={styles['custom-range__details__counts__total']}>
                {bookmark_count}
              </div>
              {starred_count != undefined && starred_count > 0 && (
                <div
                  className={styles['custom-range__details__counts__starred']}
                >
                  {starred_count}
                </div>
              )}
              {unread_count != undefined && unread_count > 0 && (
                <div
                  className={styles['custom-range__details__counts__unread']}
                >
                  {unread_count}
                </div>
              )}
            </div>
          ) : (
            ''
          )}
        </div>

        {props.current_gte && props.current_lte && (
          <button
            className={styles['custom-range__clear']}
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
          counts_to_render &&
          counts_to_render.length >= 2 && (
            <div className={styles['custom-range__recharts']}>
              <ResponsiveContainer width={'100%'} height={135} key={key}>
                <AreaChart margin={{ left: 0, top: 5 }} data={counts_to_render}>
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
                    fill="var(--yellow)"
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
                    dataKey="unread_count"
                    strokeWidth={2}
                    stroke="var(--red)"
                    fill="transparent"
                    isAnimationActive={false}
                    strokeOpacity={unread_count == 0 ? 0 : 1}
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
                        !counts_to_render
                      )
                        return

                      set_dragged_start_index(startIndex)
                      set_dragged_end_index(endIndex)
                    }}
                    className={styles['custom-range__recharts__brush']}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

        {props.has_results &&
          counts_to_render &&
          counts_to_render.length < 2 &&
          !props.is_range_selector_disabled && (
            <div className={styles['custom-range__info']}>
              All results fit in one month
            </div>
          )}

        {!props.is_range_selector_disabled &&
          !props.has_results &&
          !props.is_fetching_data && (
            <div className={styles['custom-range__info']}>
              There is nothing to plot
            </div>
          )}

        {props.is_range_selector_disabled && (
          <div className={styles['custom-range__info']}>
            Range selection is unavailable for current sort option
          </div>
        )}
      </div>
    )
  },
  (o, n) =>
    o.has_results == n.has_results &&
    o.clear_date_range == n.clear_date_range &&
    o.is_range_selector_disabled == n.is_range_selector_disabled,
)

function yyyymm_to_display(yyyymm: number) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
  ).format('MMM YYYY')
}