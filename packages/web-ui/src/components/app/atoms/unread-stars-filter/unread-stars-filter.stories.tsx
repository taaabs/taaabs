import { UnreadStarsFilter } from './unread-stars-filter'

export default {
  component: UnreadStarsFilter,
}

export const Primary = () => (
  <UnreadStarsFilter
    is_unread_selected={false}
    unread_click_handler={() => {}}
    stars_click_handler={() => {}}
    selected_stars={1}
  />
)
