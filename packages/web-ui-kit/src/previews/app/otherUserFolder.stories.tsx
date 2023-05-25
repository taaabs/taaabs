import { Bookmark } from '@/components/Molecules'
import { Ui } from '@/index'
import { LayoutLibrary, LayoutRoot } from '@/layouts'

export default {
  title: 'previews/app/other user catalog',
}

export const Primary = () => (
  <LayoutRoot
    slotHeaderDesktop={
      <Ui.Molecues.HeaderDesktop
        currentTheme="LIGHT"
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        onClickSignIn={() => {}}
        onClickAdd={() => {}}
        navigation={[
          { label: 'Explore', href: '/', isActive: true },
          { label: 'About', href: '/about', isActive: false },
          { label: 'Pricing', href: '/pricing', isActive: false },
        ]}
        viewedUser={{ username: 'lorem_ipsum', backHref: '/' }}
      />
    }
    slotHeaderMobile={
      <Ui.Molecues.HeaderMobile
        currentTheme="LIGHT"
        hamburgerIsToggled={false}
        onClickHamburger={() => {}}
        onClickTheme={() => {}}
        viewedUser={{ username: 'lorem_ipsum', backHref: '/' }}
      />
    }
    slotFooterDesktop={<div style={{ height: 1000 }}>footer</div>}
    slotBottomNavigationBar={
      <Ui.Molecues.BottomNavigationBar
        onClickAdd={() => {}}
        onClickMyLibrary={() => {}}
        onClickNotifications={() => {}}
        onClickSearch={() => {}}
        onClickUser={() => {}}
      />
    }
  >
    <LayoutLibrary
      slotMain={
        <>
          <br />
          {bookmark}
          <br />
          {bookmark}
          <br />
          {bookmark}
          <br />
          {bookmark}
          <br />
          {bookmark}
        </>
      }
      slotAside={<>aside</>}
      slotSidebar={<>sidebar</>}
      slotAppBar={<>appbar</>}
    />
  </LayoutRoot>
)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor.`

const bookmark = (
  <Bookmark
    isStarred={false}
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
    url="https://example.com/test/lorem_ipsum"
    sitePath="test"
    createdAt={new Date('2023-02-20')}
    isNSFW={true}
    isArchived={true}
    tags={['lorem', 'ipsum']}
  />
)
