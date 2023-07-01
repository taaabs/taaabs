import { Library } from './library'

export default {
  component: Library,
}

export const Primary = () => (
  <Library
    slotSidebar={<>slot sidebar</>}
    slotAside={<>slot aside</>}
    titleBar={{ primaryText: 'Lorem ipsum', secondaryText: 'lorem' }}
    bottomOffset={0}
  >
    <>slot main</>
  </Library>
)

export const Scrolling = () => (
  <Library
    slotSidebar={<div>{lorem}</div>}
    slotAside={<div>{lorem}</div>}
    titleBar={{ primaryText: 'Lorem ipsum', secondaryText: 'lorem' }}
    bottomOffset={0}
  >
    {lorem} {lorem} {lorem} {lorem}
  </Library>
)

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodales, euismod odio ac, fermentum metus. Nunc sed tellus dui. Nam sed lacinia nibh. Etiam ut auctor elit. Nunc placerat auctor tristique. Nullam sem mauris, commodo et blandit at, efficitur at sapien. Phasellus pretium ut dolor dapibus bibendum. In enim est, suscipit quis arcu vitae, lobortis imperdiet erat. Mauris lobortis cursus tempor. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis justo lorem, elementum non bibendum sit amet, sollicitudin vitae diam. Morbi ultricies malesuada orci, in ultricies sem imperdiet eget. Fusce eleifend quam tellus, in consectetur ligula hendrerit et. Vivamus eget feugiat nibh. In accumsan, velit id molestie scelerisque, augue mi rhoncus massa, non scelerisque ex tortor at tortor.`
