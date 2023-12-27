import { Ui } from '@web-ui'

export namespace DesktopUserForHeader {
  export type Props = {
    button_label: string
    button_on_click: () => void
  }
}

export const DesktopUserForHeader: React.FC<DesktopUserForHeader.Props> = (
  props,
) => {
  return (
    <Ui.Common.Particles.Button size="large" on_click={props.button_on_click}>
      {props.button_label}
    </Ui.Common.Particles.Button>
  )
}
