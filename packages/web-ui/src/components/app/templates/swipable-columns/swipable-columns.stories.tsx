import { SwipableColumns } from './swipable-columns'

export default {
  component: SwipableColumns,
}

export const Primary = () => (
  <SwipableColumns
    slot_tag_hierarchies={<>[TAG HIERARCHIES]</>}
    translations={{
      collapse_alt: '',
      follow: '',
      unfollow: '',
      folders: 'Folders',
      pinned: 'Pinned',
    }}
    slot_aside={<>[ASIDE]</>}
    slot_toolbar={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached={() => {}}
    are_bookmarks_dimmed={false}
    slot_bookmarks={<>[BOOKMARKS]</>}
    slot_search={<>[SEARCH]</>}
    show_skeletons={false}
    slot_pinned={<>pinned</>}
    info_text={''}
  />
)

export const Scrolling = () => (
  <SwipableColumns
    slot_tag_hierarchies={<>[TAG HIERARCHIES]</>}
    translations={{
      collapse_alt: '',
      follow: '',
      unfollow: '',
      folders: 'Folders',
      pinned: 'Pinned',
    }}
    slot_aside={<div>{lorem}</div>}
    slot_toolbar={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached={() => {}}
    are_bookmarks_dimmed={false}
    slot_bookmarks={
      <>
        {lorem} {lorem} {lorem} {lorem}
      </>
    }
    slot_search={<>[SEARCH]</>}
    show_skeletons={false}
    slot_pinned={<>pinned</>}
    info_text={''}
  />
)

export const Loading = () => (
  <SwipableColumns
    slot_tag_hierarchies={<>[TAG HIERARCHIES]</>}
    translations={{
      collapse_alt: '',
      follow: '',
      unfollow: '',
      folders: 'Folders',
      pinned: 'Pinned',
    }}
    slot_aside={<>slot aside</>}
    slot_toolbar={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached={() => {}}
    are_bookmarks_dimmed={false}
    slot_bookmarks={<>slot bookmarks</>}
    slot_search={<>[SEARCH]</>}
    show_skeletons={true}
    slot_pinned={<>pinned</>}
    info_text={''}
  />
)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor.`