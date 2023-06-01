import { Ui } from '@web-ui'

const UiLayoutLibrary: React.FC<{ test: string }> = () => (
  <Ui.Layouts.LayoutLibrary
    slotAside={<>aside</>}
    slotMain={<>main</>}
    slotSidebar={<>sidebar</>}
    titleBar={{
      primaryText: 'x',
      secondaryText: 'y',
    }}
  />
)

export default UiLayoutLibrary
