import { useRouter } from 'next/router'
import { Ui } from '@taaabs/web-ui-kit'

type LayoutRootProps = {
  children: React.ReactNode
}

const LayoutRoot: React.FC<LayoutRootProps> = (props) => {
  const router = useRouter()

  return (
    <Ui.Layouts.LayoutRoot
      slotHeaderDesktop={<>header desktop</>}
      slotFooterDesktop={<>footer desktop</>}
      slotBottomNavigationBar={<>bottom navigation bar</>}
      slotHeaderMobile={<>header mobile</>}
    >
      {props.children}
    </Ui.Layouts.LayoutRoot>
  )
}

type GetLayoutParams = {
  page: React.ReactNode
}

export const getLayout = (params: GetLayoutParams) => (
  <LayoutRoot>{params.page}</LayoutRoot>
)
