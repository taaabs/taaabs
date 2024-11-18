import { Area, AreaChart, Brush, ResponsiveContainer, YAxis } from 'recharts'
import styles from './CustomRange.module.scss'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import { memo, useEffect, useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { Icon as UiIcon } from '@web-ui/components/Icon'

type Counts = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  unsorted_count: number
}[]

// Don't suffix properties at it won't work with dynamically loaded component
export namespace CustomRange {
  export type Props = {
    counts?: Counts
    current_gte?: number
    current_lte?: number
    on_yyyymm_change: ({ gte, lte }: { gte: number; lte: number }) => void
    clear_custom_range: () => void
    selected_tags: number[]
    current_filter?: any
    current_sort_by?: any
    is_range_selector_disabled?: boolean
    locale: 'en' | 'pl'
    translations: {
      custom_range: string
      range_not_available: string
      nothing_to_plot: string
      results_fit_in_one_month: string
    }
  }
}

export const CustomRange: React.FC<CustomRange.Props> = memo(
  function CustomRange(props) {
    const [counts_to_render, set_counts_to_render] = useState<Counts>()
    const [date, set_date] = useState<string>()
    const custom_range = useRef<HTMLDivElement>(null)
    const { swiping: is_swiping } = useSwipe(custom_range, {
      preventDefault: false,
      threshold: 0,
    })
    const [random_number, set_random_number] = useState(0)
    const [start_index, set_start_index] = useState<number>()
    const [end_index, set_end_index] = useState<number>()
    const [dragged_start_index, set_dragged_start_index] = useState<number>()
    const [dragged_end_index, set_dragged_end_index] = useState<number>()
    const [bookmark_count, set_bookmark_count] = useState<number>()
    const [starred_count, set_starred_count] = useState<number>()
    const [unsorted_count, set_unsorted_count] = useState<number>()
    const calculated_counts_cache = useRef<{
      [start_end_index: string]: {
        bookmark_count: number
        starred_count: number
        unsorted_count: number
      }
    }>({})

    useUpdateEffect(() => {
      if (props.is_range_selector_disabled) return

      if (
        !is_swiping &&
        counts_to_render &&
        dragged_start_index !== undefined &&
        dragged_end_index !== undefined &&
        counts_to_render[dragged_start_index] &&
        counts_to_render[dragged_end_index]
      ) {
        props.on_yyyymm_change({
          gte: counts_to_render[dragged_start_index].yyyymm,
          lte: counts_to_render[dragged_end_index].yyyymm,
        })

        set_dragged_start_index(undefined)
        set_dragged_end_index(undefined)
      }
    }, [is_swiping])

    const calculate_counts = (params: {
      counts?: Counts
      start_index?: number
      end_index?: number
    }) => {
      if (!params.counts) {
        set_bookmark_count(undefined)
        return
      }

      if (
        calculated_counts_cache.current[
          `${params.start_index}-${params.end_index}`
        ]
      ) {
        set_bookmark_count(
          calculated_counts_cache.current[
            `${params.start_index}-${params.end_index}`
          ].bookmark_count,
        )
        set_starred_count(
          calculated_counts_cache.current[
            `${params.start_index}-${params.end_index}`
          ].starred_count,
        )
        set_unsorted_count(
          calculated_counts_cache.current[
            `${params.start_index}-${params.end_index}`
          ].unsorted_count,
        )
      } else {
        let counts_sliced: Counts = []
        if (start_index !== undefined && end_index !== undefined) {
          counts_sliced = params.counts.slice(start_index, end_index + 1)
        } else {
          counts_sliced = params.counts
        }

        let bookmark_count = 0
        let starred_count = 0
        let unsorted_count = 0

        counts_sliced.forEach((el) => {
          bookmark_count += el.bookmark_count
          starred_count += el.starred_count
          unsorted_count += el.unsorted_count
        })

        calculated_counts_cache.current[
          `${params.start_index}-${params.end_index}`
        ] = {
          bookmark_count,
          starred_count,
          unsorted_count,
        }

        set_bookmark_count(bookmark_count)
        set_starred_count(starred_count)
        set_unsorted_count(unsorted_count)
      }

      set_date(
        params.counts.length > 0
          ? start_index !== undefined &&
            params.counts[start_index] &&
            end_index !== undefined &&
            params.counts[end_index]
            ? yyyymm_to_display(
                params.counts[start_index].yyyymm,
                props.locale,
              ) +
              (end_index != start_index
                ? ` - ${yyyymm_to_display(
                    params.counts[end_index].yyyymm,
                    props.locale,
                  )}`
                : '')
            : yyyymm_to_display(params.counts[0].yyyymm, props.locale) +
              (params.counts.length > 1
                ? ` - ${yyyymm_to_display(
                    params.counts[params.counts.length - 1].yyyymm,
                    props.locale,
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
    }): number | undefined => {
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
          : undefined

      return start_index != -1 ? start_index : undefined
    }

    const possible_end_index = ({
      counts,
      current_lte,
    }: {
      counts: Counts
      current_lte: number
    }): number | undefined => {
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
          : undefined

      return end_index != -1 ? end_index : undefined
    }

    const set_start_and_end_index = (params: {
      counts: Counts
      current_gte: number
      current_lte: number
    }) => {
      set_start_index(
        possible_start_index({
          counts: params.counts,
          current_gte: params.current_gte,
        }),
      )
      set_end_index(
        possible_end_index({
          counts: params.counts,
          current_lte: params.current_lte,
        }),
      )
      set_random_number(Math.random())
    }

    const set_start_and_end_index_throttled = useThrottledCallback(
      set_start_and_end_index,
      [set_start_index, set_end_index, set_random_number],
      50,
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
      calculate_counts({
        counts: props.counts,
        start_index: start_index != null ? start_index : undefined,
        end_index: end_index != null ? end_index : undefined,
      })
    }, [random_number])

    useEffect(() => {
      if (!props.counts || !props.current_gte || !props.current_lte) {
        set_start_index(undefined)
        set_end_index(undefined)
        set_random_number(Math.random())

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
        dragged_start_index !== undefined ||
        dragged_end_index !== undefined
      )
        return

      calculate_counts({
        counts: props.counts,
        start_index: 0,
        end_index: props.counts.length - 1,
      })
    }, [props.counts])

    useEffect(() => {
      calculated_counts_cache.current = {}
      set_counts_to_render(props.counts)
    }, [props.counts])

    return (
      <div className={styles['custom-range']} ref={custom_range}>
        <div className={styles['custom-range__details']}>
          <div className={styles['custom-range__details__title']}>
            {props.translations.custom_range}
          </div>
          <div className={styles['custom-range__details__current-range']}>
            {!bookmark_count ? (
              props.current_gte && props.current_lte ? (
                yyyymm_to_display(props.current_gte, props.locale) +
                (props.current_gte != props.current_lte
                  ? ` - ${yyyymm_to_display(props.current_lte, props.locale)}`
                  : '')
              ) : (
                ''
              )
            ) : !props.is_range_selector_disabled ? (
              date ? (
                date
              ) : props.current_gte && props.current_lte ? (
                yyyymm_to_display(props.current_gte, props.locale) +
                (props.current_gte != props.current_lte
                  ? ` - ${yyyymm_to_display(props.current_lte, props.locale)}`
                  : '')
              ) : (
                <></>
              )
            ) : (
              'All history'
            )}
          </div>
          {bookmark_count && bookmark_count > 0 ? (
            bookmark_count != unsorted_count &&
            bookmark_count != starred_count ? (
              <div className={styles['custom-range__details__counts']}>
                <div className={styles['custom-range__details__counts__total']}>
                  <span>{bookmark_count}</span>
                </div>
                {unsorted_count !== undefined &&
                  unsorted_count > 0 &&
                  starred_count !== undefined &&
                  starred_count < unsorted_count && (
                    <div
                      className={
                        styles['custom-range__details__counts__unsorted']
                      }
                    >
                      <span>{unsorted_count}</span>
                    </div>
                  )}
                {unsorted_count !== undefined &&
                  unsorted_count > 0 &&
                  starred_count !== undefined &&
                  starred_count == unsorted_count && (
                    <div
                      className={
                        styles['custom-range__details__counts__unsorted']
                      }
                    />
                  )}
                {starred_count !== undefined && starred_count > 0 && (
                  <div
                    className={styles['custom-range__details__counts__starred']}
                  >
                    <span>{starred_count}</span>
                  </div>
                )}
                {unsorted_count !== undefined &&
                  unsorted_count > 0 &&
                  starred_count !== undefined &&
                  starred_count > unsorted_count && (
                    <div
                      className={
                        styles['custom-range__details__counts__unsorted']
                      }
                    >
                      <span>{unsorted_count}</span>
                    </div>
                  )}
              </div>
            ) : bookmark_count == unsorted_count &&
              bookmark_count != starred_count ? (
              <div className={styles['custom-range__details__counts']}>
                <div
                  className={styles['custom-range__details__counts__total']}
                />
                {starred_count !== undefined &&
                  starred_count > unsorted_count &&
                  starred_count > 0 && (
                    <div
                      className={
                        styles['custom-range__details__counts__starred']
                      }
                    >
                      <span>{starred_count}</span>
                    </div>
                  )}
                <div
                  className={styles['custom-range__details__counts__unsorted']}
                >
                  <span>{unsorted_count}</span>
                </div>
                {starred_count !== undefined &&
                  starred_count < unsorted_count &&
                  starred_count > 0 && (
                    <div
                      className={
                        styles['custom-range__details__counts__starred']
                      }
                    >
                      <span>{starred_count}</span>
                    </div>
                  )}
              </div>
            ) : bookmark_count == starred_count &&
              bookmark_count != unsorted_count ? (
              <div className={styles['custom-range__details__counts']}>
                <div
                  className={styles['custom-range__details__counts__total']}
                />
                <div
                  className={styles['custom-range__details__counts__starred']}
                >
                  <span>{starred_count}</span>
                </div>
                {unsorted_count !== undefined && unsorted_count > 0 && (
                  <div
                    className={
                      styles['custom-range__details__counts__unsorted']
                    }
                  >
                    <span>{unsorted_count}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles['custom-range__details__counts']}>
                <div
                  className={styles['custom-range__details__counts__total']}
                />
                <div
                  className={styles['custom-range__details__counts__starred']}
                />
                <div
                  className={styles['custom-range__details__counts__unsorted']}
                >
                  <span>{bookmark_count}</span>
                </div>
              </div>
            )
          ) : (
            ''
          )}
        </div>

        {start_index !== undefined && end_index !== undefined && (
          <button
            className={styles['custom-range__clear']}
            onClick={props.clear_custom_range}
          >
            <UiIcon variant="ADD" />
          </button>
        )}

        {!props.is_range_selector_disabled &&
          counts_to_render &&
          counts_to_render.length >= 2 &&
          bookmark_count &&
          bookmark_count > 0 && (
            <div className={styles['custom-range__recharts']}>
              <ResponsiveContainer
                width={'100%'}
                height={135}
                key={`${props.current_gte}${props.current_lte}`}
              >
                <AreaChart margin={{ left: 0, top: 5 }} data={counts_to_render}>
                  <defs>
                    <linearGradient
                      id="bookmark-count"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                      style={{ pointerEvents: 'none' }}
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--accent-color)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--accent-color)"
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
                    style={{ pointerEvents: 'none' }}
                  />
                  <Area
                    type="basis"
                    dataKey="starred_count"
                    strokeWidth={0}
                    fill="var(--yellow)"
                    fillOpacity={starred_count == 0 ? 0 : 1}
                    isAnimationActive={false}
                    style={{ pointerEvents: 'none' }}
                  />
                  <Area
                    type="basis"
                    dataKey="bookmark_count"
                    strokeWidth={2}
                    stroke="var(--accent-color)"
                    isAnimationActive={false}
                    fill="transparent"
                    strokeOpacity={bookmark_count == 0 ? 0 : 1}
                    style={{ pointerEvents: 'none' }}
                  />
                  <Area
                    type="basis"
                    dataKey="unsorted_count"
                    strokeWidth={2}
                    stroke="var(--red)"
                    fill="transparent"
                    isAnimationActive={false}
                    strokeOpacity={unsorted_count == 0 ? 0 : 1}
                    style={{ pointerEvents: 'none' }}
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

        {bookmark_count !== undefined &&
          bookmark_count > 0 &&
          counts_to_render &&
          counts_to_render.length <= 1 &&
          !props.is_range_selector_disabled && (
            <div className={styles['custom-range__info']}>
              {props.translations.results_fit_in_one_month}
            </div>
          )}

        {!props.is_range_selector_disabled && !bookmark_count && (
          <div className={styles['custom-range__info']}>
            {props.translations.nothing_to_plot}
          </div>
        )}

        {props.is_range_selector_disabled && (
          <div className={styles['custom-range__info']}>
            {props.translations.range_not_available}
          </div>
        )}
      </div>
    )
  },
  (o, n) =>
    o.selected_tags.length == n.selected_tags.length &&
    o.current_filter == n.current_filter &&
    o.current_sort_by == n.current_sort_by,
)

function yyyymm_to_display(yyyymm: number, locale: string) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
    { locale },
  ).format("MMMM 'YY")
}
