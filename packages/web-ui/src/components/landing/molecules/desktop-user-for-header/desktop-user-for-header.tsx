import { Button } from '@web-ui/components/common/particles/button'

export namespace DesktopUserForHeader {
  export type Props = {
    buttonLabel: string
    buttonOnClick: () => void
  }
}

export const DesktopUserForHeader: React.FC<DesktopUserForHeader.Props> = (
  props,
) => {
  return (
    <Button size="large" onClick={props.buttonOnClick}>
      {props.buttonLabel}
    </Button>
  )
}
