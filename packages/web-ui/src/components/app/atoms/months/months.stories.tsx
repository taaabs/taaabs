import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Months } from './months'

export default {
  component: Months,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Months
        months={[
          { yyyymm: 202302, bookmarkCount: 30, starredCount: 0, nsfwCount: 0 },
          { yyyymm: 202303, bookmarkCount: 5, starredCount: 0, nsfwCount: 0 },
          { yyyymm: 202304, bookmarkCount: 20, starredCount: 5, nsfwCount: 10 },
          { yyyymm: 202305, bookmarkCount: 50, starredCount: 9, nsfwCount: 10 },
          { yyyymm: 202306, bookmarkCount: 10, starredCount: 10, nsfwCount: 1 },
          { yyyymm: 202307, bookmarkCount: 80, starredCount: 40, nsfwCount: 0 },
          {
            yyyymm: 202308,
            bookmarkCount: 50,
            starredCount: 10,
            nsfwCount: 12,
          },
          { yyyymm: 202309, bookmarkCount: 10, starredCount: 0, nsfwCount: 4 },
          { yyyymm: 202310, bookmarkCount: 80, starredCount: 12, nsfwCount: 0 },
        ]}
        onYyyymmChange={() => {}}
      />
    </div>
  </StorybookMargin>
)
