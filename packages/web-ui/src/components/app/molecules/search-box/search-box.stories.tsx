import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SearchBox } from './search-box'

export default {
  component: SearchBox,
}

export const Primary = () => (
  <StorybookMargin>
    <SearchBox onClick={() => {}} placeholder="Search anything..." />
  </StorybookMargin>
)