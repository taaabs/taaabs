import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Months } from './months'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: Months,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Months
        months={[
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
        on_yyyymm_change={() => {}}
        clear_date_range={() => {}}
        set_swipe_state_handler={() => {}}
        has_results={true}
      />
      <StorybookSpacer />
      <Months
        months={[
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
        on_yyyymm_change={() => {}}
        clear_date_range={() => {}}
        current_gte={202303}
        current_lte={202305}
        set_swipe_state_handler={() => {}}
        has_results={true}
      />
      <StorybookSpacer />
      <Months
        months={[
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
        on_yyyymm_change={() => {}}
        clear_date_range={() => {}}
        current_gte={202303}
        current_lte={202305}
        set_swipe_state_handler={() => {}}
        has_results={true}
      />
    </div>
  </StorybookMargin>
)
