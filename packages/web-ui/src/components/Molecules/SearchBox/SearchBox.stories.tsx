import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { SearchBox } from './SearchBox'

export default {
  component: SearchBox,
}

export const Primary = () => (
  <StorybookMargin>
    <SearchBox onClick={() => {}} placeholder="Search anything..." />
  </StorybookMargin>
)
