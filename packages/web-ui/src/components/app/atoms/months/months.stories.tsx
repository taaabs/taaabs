import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Months } from './months'

export default {
  component: Months,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Months
        initYymmStart={2303}
        initYymmEnd={2309}
        months={[
          { yymm: 2302, bookmarkCount: 30, starredCount: 0, nsfwCount: 0 },
          { yymm: 2303, bookmarkCount: 5, starredCount: 0, nsfwCount: 0 },
          { yymm: 2304, bookmarkCount: 20, starredCount: 5, nsfwCount: 10 },
          { yymm: 2305, bookmarkCount: 50, starredCount: 9, nsfwCount: 10 },
          { yymm: 2306, bookmarkCount: 10, starredCount: 10, nsfwCount: 1 },
          { yymm: 2307, bookmarkCount: 80, starredCount: 40, nsfwCount: 0 },
          { yymm: 2308, bookmarkCount: 50, starredCount: 10, nsfwCount: 12 },
          { yymm: 2309, bookmarkCount: 10, starredCount: 0, nsfwCount: 4 },
          { yymm: 2310, bookmarkCount: 80, starredCount: 12, nsfwCount: 0 },
        ]}
        onYymmChange={() => {}}
      />
    </div>
  </StorybookMargin>
)
