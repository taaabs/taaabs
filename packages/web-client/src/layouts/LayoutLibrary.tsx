import dynamic from 'next/dynamic'

const UiLayoutLibrary = dynamic(
  () => import('./layout-library/UiLayoutLibrary'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
)

type LayoutLibraryProps = {
  children: React.ReactNode
}

const LayoutLibrary: React.FC<LayoutLibraryProps> = (props) => {
  return <UiLayoutLibrary test='x' />
}

type GetLayoutParams = {
  page: React.ReactNode
}

export const getLayout = (params: GetLayoutParams) => (
  <LayoutLibrary>{params.page}</LayoutLibrary>
)
