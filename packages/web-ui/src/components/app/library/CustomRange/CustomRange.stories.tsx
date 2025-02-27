import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { CustomRange } from './CustomRange'

export default {
  component: CustomRange,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <CustomRange
        counts={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unsorted_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unsorted_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unsorted_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unsorted_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unsorted_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unsorted_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unsorted_count: 0,
          },
        ]}
        on_yyyymm_change={() => {}}
        clear_custom_range={() => {}}
        locale="en"
        translations={{
          custom_range: 'Custom range',
          nothing_to_plot: 'Nothing to plot',
          range_not_available: 'Range not available',
          results_fit_in_one_month: 'Results fit in one month',
        }}
      />
      <StorybookSpacer />
      <CustomRange
        counts={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unsorted_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unsorted_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unsorted_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unsorted_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unsorted_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unsorted_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unsorted_count: 0,
          },
        ]}
        on_yyyymm_change={() => {}}
        clear_custom_range={() => {}}
        current_gte={202303}
        current_lte={202305}
        locale="en"
        translations={{
          custom_range: 'Custom range',
          nothing_to_plot: 'Nothing to plot',
          range_not_available: 'Range not available',
          results_fit_in_one_month: 'Results fit in one month',
        }}
      />
      <StorybookSpacer />
      <CustomRange
        counts={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unsorted_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unsorted_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unsorted_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unsorted_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unsorted_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unsorted_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unsorted_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unsorted_count: 0,
          },
        ]}
        on_yyyymm_change={() => {}}
        clear_custom_range={() => {}}
        current_gte={202303}
        current_lte={202305}
        locale="en"
        translations={{
          custom_range: 'Custom range',
          nothing_to_plot: 'Nothing to plot',
          range_not_available: 'Range not available',
          results_fit_in_one_month: 'Results fit in one month',
        }}
      />
    </div>
  </StorybookMargin>
)
