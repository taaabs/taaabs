import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { CustomRange } from './custom-range'

export default {
  component: CustomRange,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <CustomRange
        counts_={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unread_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unread_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unread_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unread_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unread_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unread_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unread_count: 0,
          },
        ]}
        on_yyyymm_change_={() => {}}
        clear_date_range_={() => {}}
        has_results={true}
      />
      <StorybookSpacer />
      <CustomRange
        counts_={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unread_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unread_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unread_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unread_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unread_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unread_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unread_count: 0,
          },
        ]}
        on_yyyymm_change_={() => {}}
        clear_date_range_={() => {}}
        current_gte_={202303}
        current_lte_={202305}
        has_results={true}
      />
      <StorybookSpacer />
      <CustomRange
        counts_={[
          {
            yyyymm: 202302,
            bookmark_count: 30,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202303,
            bookmark_count: 5,
            starred_count: 0,
            unread_count: 0,
          },
          {
            yyyymm: 202304,
            bookmark_count: 20,
            starred_count: 5,
            unread_count: 10,
          },
          {
            yyyymm: 202305,
            bookmark_count: 50,
            starred_count: 9,
            unread_count: 10,
          },
          {
            yyyymm: 202306,
            bookmark_count: 10,
            starred_count: 10,
            unread_count: 1,
          },
          {
            yyyymm: 202307,
            bookmark_count: 80,
            starred_count: 40,
            unread_count: 0,
          },
          {
            yyyymm: 202308,
            bookmark_count: 50,
            starred_count: 10,
            unread_count: 12,
          },
          {
            yyyymm: 202309,
            bookmark_count: 10,
            starred_count: 0,
            unread_count: 4,
          },
          {
            yyyymm: 202310,
            bookmark_count: 80,
            starred_count: 12,
            unread_count: 0,
          },
        ]}
        on_yyyymm_change_={() => {}}
        clear_date_range_={() => {}}
        current_gte_={202303}
        current_lte_={202305}
        has_results={true}
      />
    </div>
  </StorybookMargin>
)
