import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SimpleSelectDropdown } from './index'

export default {
  component: SimpleSelectDropdown,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: 300 }}>
        <SimpleSelectDropdown
          items={[
            { label: 'Lorem', onClick: () => {} },
            { label: 'Lorem', onClick: () => {} },
            { label: 'Lorem', onClick: () => {} },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}
