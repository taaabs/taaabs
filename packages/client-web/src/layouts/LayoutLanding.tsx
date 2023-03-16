import { UiAtoButton } from '@/ui-kit/atoms/UiAtoButton'

type Props = {
  children: React.ReactNode
}

const AboutLayout: React.FC<Props> = (props) => {
  return (
    <div>
      <UiAtoButton href="">dfdf</UiAtoButton>
      <div>header</div>
      <div>page contents</div>
    </div>
  )
}

export const layoutLanding = (props: Props) => (
  <AboutLayout {...props}>{props.children}</AboutLayout>
)
