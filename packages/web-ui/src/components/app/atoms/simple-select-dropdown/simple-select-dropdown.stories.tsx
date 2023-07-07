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
            { label: 'Lorem', onClick: () => {}, isSelected: false },
            { label: 'Lorem', onClick: () => {}, isSelected: true },
            { label: 'Lorem', onClick: () => {}, isSelected: false },
          ]}
          checkboxes={[
            {
              label: 'Lorem',
              onClick: () => {},
              isSelected: true,
            },
            {
              label: 'Lorem',
              onClick: () => {},
              isSelected: false,
              isDisabled: true,
            },
          ]}
        />
      </div>
    </StorybookMargin>
  )
}
