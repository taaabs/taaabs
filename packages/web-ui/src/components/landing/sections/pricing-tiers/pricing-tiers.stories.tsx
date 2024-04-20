import { StorybookMargin } from '@web-ui/helpers/storybook'
import { PricingTiers } from './pricing-tiers'

export default {
  component: PricingTiers,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <PricingTiers
        billing_cycle={{
          labels: {
            monthly: 'Monthly',
            yearly: 'Yearly',
          },
          is_monthly_selected: false,
          on_click: () => {},
          yearly_savings: 'Up to -25%',
        }}
        pricing_tiers={[
          {
            name: 'Lorem',
            description: 'Lorem ipsum',
            price: '$0',
            price_info: { first_line: 'Lorem', second_line: 'Ipsum' },
            slot_button: <>button</>,
            bullets_heading: 'Lorem ipsum',
            bullets: [
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
            ],
          },
          {
            name: 'Lorem',
            description: 'Lorem ipsum',
            price: '$0',
            price_info: { first_line: 'Lorem', second_line: 'Ipsum' },
            slot_button: <>button</>,
            bullets_heading: 'Lorem ipsum',
            bullets: [
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
            ],
          },
          {
            name: 'Lorem',
            description: 'Lorem ipsum',
            price: '$0',
            price_info: { first_line: 'Lorem', second_line: 'Ipsum' },
            slot_button: <>button</>,
            bullets_heading: 'Lorem ipsum',
            bullets: [
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
              'Lorem ipsum',
            ],
            has_best_value: true,
          },
        ]}
      />
    </StorybookMargin>
  )
}
