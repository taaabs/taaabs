import { Library } from './library'

export default {
  component: Library,
}

export const Primary = () => (
  <Library
    slot_sidebar={<>[SIDEBAR]</>}
    slot_aside={<>[ASIDE]</>}
    title_bar={'Lorem ipsum'}
    get_more_bookmarks={() => {}}
    has_more_bookmarks={false}
    is_getting_first_bookmarks={false}
    is_getting_more_bookmarks={false}
    slot_bookmarks={<>[BOOKMARKS]</>}
    no_results={false}
    show_bookmarks_skeleton={false}
  />
)

export const Scrolling = () => (
  <Library
    slot_sidebar={<div>{lorem}</div>}
    slot_aside={<div>{lorem}</div>}
    title_bar={'Lorem ipsum'}
    get_more_bookmarks={() => {}}
    has_more_bookmarks={false}
    is_getting_first_bookmarks={false}
    is_getting_more_bookmarks={false}
    slot_bookmarks={
      <>
        {lorem} {lorem} {lorem} {lorem}
      </>
    }
    no_results={false}
    show_bookmarks_skeleton={false}
  />
)

export const Loading = () => (
  <Library
    slot_sidebar={<>slot sidebar</>}
    slot_aside={<>slot aside</>}
    title_bar={'Lorem ipsum'}
    get_more_bookmarks={() => {}}
    has_more_bookmarks={false}
    is_getting_first_bookmarks={false}
    is_getting_more_bookmarks={false}
    slot_bookmarks={<>slot bookmarks</>}
    no_results={false}
    show_bookmarks_skeleton={true}
  />
)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor.`
