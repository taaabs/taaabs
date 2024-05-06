import { Button } from '@web-ui/components/common/particles/button'

export namespace DesktopUserForHeader {
  export type Props = {
    button_label: string
    button_href: string
  }
}

export const DesktopUserForHeader: React.FC<DesktopUserForHeader.Props> = (
  props,
) => {
  return (
    <Button size="large" href={props.button_href}>
      {props.button_label}
    </Button>
  )
}
