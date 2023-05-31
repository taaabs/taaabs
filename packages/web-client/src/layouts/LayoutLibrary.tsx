import { Ui } from '@taaabs/web-ui-kit'

type LayoutLibraryProps = {
  children: React.ReactNode
}

const LayoutLibrary: React.FC<LayoutLibraryProps> = (props) => {
  return (
    <Ui.Layouts.LayoutLibrary
      slotAside={<></>}
      slotMain={props.children}
      slotSidebar={<></>}
      titleBar={{
        primaryText: 'x',
        secondaryText: 'y',
      }}
    />
  )
}

type GetLayoutParams = {
  page: React.ReactNode
}

export const getLayout = (params: GetLayoutParams) => (
  <LayoutLibrary>{params.page}</LayoutLibrary>
)
