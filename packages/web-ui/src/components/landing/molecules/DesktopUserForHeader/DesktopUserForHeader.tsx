import { Button } from '@web-ui/components/common/atoms/Button'

export namespace DesktopUserForHeaderTypes {
  export type Props = {
    buttonLabel: string
    buttonOnClick: () => void
  }
}

export const DesktopUserForHeader: React.FC<DesktopUserForHeaderTypes.Props> = (
  props,
) => {
  return (
    <Button size="large" onClick={props.buttonOnClick}>
      {props.buttonLabel}
    </Button>
  )
}
