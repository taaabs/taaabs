import { SwipableColumns } from './swipable-columns'

export default {
  component: SwipableColumns,
}

export const Primary = () => (
  <SwipableColumns
    slot_tag_hierarchies_={<>[TAG HIERARCHIES]</>}
    translations_={{
      collapse_alt_: '',
      follow_: '',
      unfollow_: '',
      folders_: 'Folders',
      pinned_: 'Pinned',
    }}
    slot_aside_={<>[ASIDE]</>}
    slot_toolbar_={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached_={() => {}}
    are_bookmarks_dimmed_={false}
    slot_bookmarks_={<>[BOOKMARKS]</>}
    slot_search_={<>[SEARCH]</>}
    show_skeletons_={false}
    slot_pinned_={<>pinned</>}
    info_text_={''}
  />
)

export const Scrolling = () => (
  <SwipableColumns
    slot_tag_hierarchies_={<>[TAG HIERARCHIES]</>}
    translations_={{
      collapse_alt_: '',
      follow_: '',
      unfollow_: '',
      folders_: 'Folders',
      pinned_: 'Pinned',
    }}
    slot_aside_={<div>{lorem}</div>}
    slot_toolbar_={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached_={() => {}}
    are_bookmarks_dimmed_={false}
    slot_bookmarks_={
      <>
        {lorem} {lorem} {lorem} {lorem}
      </>
    }
    slot_search_={<>[SEARCH]</>}
    show_skeletons_={false}
    slot_pinned_={<>pinned</>}
    info_text_={''}
  />
)

export const Loading = () => (
  <SwipableColumns
    slot_tag_hierarchies_={<>[TAG HIERARCHIES]</>}
    translations_={{
      collapse_alt_: '',
      follow_: '',
      unfollow_: '',
      folders_: 'Folders',
      pinned_: 'Pinned',
    }}
    slot_aside_={<>slot aside</>}
    slot_toolbar_={<>[TOOLBAR]</>}
    mobile_title_bar={'Lorem ipsum'}
    on_page_bottom_reached_={() => {}}
    are_bookmarks_dimmed_={false}
    slot_bookmarks_={<>slot bookmarks</>}
    slot_search_={<>[SEARCH]</>}
    show_skeletons_={true}
    slot_pinned_={<>pinned</>}
    info_text_={''}
  />
)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor.`
