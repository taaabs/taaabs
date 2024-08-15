import { Button } from '@web-ui/components/Button'

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
    <Button size="large" on_click={props.button_on_click}>
      {props.button_label}
    </Button>
  )
}
