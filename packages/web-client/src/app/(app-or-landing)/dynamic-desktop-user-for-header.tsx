import { Dictionary } from '@/dictionaries/dictionary'
import { DesktopUserForHeader as UiLandingMolecule_DesktopUserForHeader } from '@web-ui/components/landing/molecules/desktop-user-for-header'

export const DynamicDesktopUserForHeader: React.FC<{
  is_authorized: boolean
  dictionary: Dictionary
}> = (props) => {
  return props.is_authorized ? (
    <UiLandingMolecule_DesktopUserForHeader
      button_label={props.dictionary.landing.open_app}
      button_href={'/'}
    />
  ) : (
    <UiLandingMolecule_DesktopUserForHeader
      button_label={props.dictionary.landing.log_in}
      button_href={'/login'}
    />
  )
}
