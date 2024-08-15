import { PageHero } from './PageHero'

export default {
  component: PageHero,
}

export const Primary = () => (
  <PageHero text="Lorem ipsum" subtext={<p>Lorem ipsum</p>} />
)
