import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'

export namespace Months {
  export type Props = {
    months: {
      yymm: number
      bookmarkCount: number
      starredCount: number
      nsfwCount: number
    }[]
    initYymmStart?: number
    initYymmEnd?: number
    onYymmChange: ({
      yymmStart,
      yymmEnd,
    }: {
      yymmStart: number
      yymmEnd: number
    }) => void
  }
}

export const Months: React.FC<Months.Props> = (props) => {
  const onBrushDrag = useDebouncedCallback(
    ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
      props.onYymmChange({
        yymmStart: props.months[startIndex].yymm,
        yymmEnd: props.months[endIndex].yymm,
      })
    },
    [props.onYymmChange],
    300,
  )

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width={'100%'} height={160}>
        <AreaChart margin={{ left: 0, top: 16 }} data={props.months}>
          <Area
            type="basis"
            dataKey="bookmarkCount"
            strokeWidth={0}
            fill="var(--Months-chart-fill)"
            fillOpacity={1}
            animationDuration={0}
          />
          <Area
            type="basis"
            dataKey="starredCount"
            strokeWidth={0}
            fill="var(--Months-chart-starred-fill)"
            fillOpacity={1}
            animationDuration={0}
          />
          <Area
            type="basis"
            dataKey="bookmarkCount"
            strokeWidth={2}
            stroke="var(--Months-chart-stroke)"
            fill="transparent"
            animationDuration={0}
          />
          <Area
            type="basis"
            dataKey="nsfwCount"
            strokeWidth={1}
            stroke="var(--Months-chart-nsfw-stroke)"
            fill="transparent"
            animationDuration={0}
          />
          <Brush
            startIndex={
              props.initYymmStart
                ? props.months.findIndex(
                    (month) => month.yymm == props.initYymmStart,
                  )
                : undefined
            }
            endIndex={
              props.initYymmEnd
                ? props.months.findIndex(
                    (month) => month.yymm == props.initYymmEnd,
                  )
                : undefined
            }
            height={24}
            travellerWidth={20}
            fill="transparent"
            onChange={({ startIndex, endIndex }) => {
              if (startIndex == undefined || endIndex == undefined) return
              onBrushDrag({ startIndex, endIndex })
            }}
            className={styles.graph__brush}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
