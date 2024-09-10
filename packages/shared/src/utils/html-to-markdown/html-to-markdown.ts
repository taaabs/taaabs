import type TurndownService from 'turndown'
import TurndownServiceJoplin from '@joplin/turndown'
import * as turndownPluginGfm from '@joplin/turndown-plugin-gfm'

const create_turndown_service = (): TurndownService => {
  const turndown_service: TurndownService = new TurndownServiceJoplin({
    codeBlockStyle: 'fenced',
  })
  turndown_service.use(turndownPluginGfm.gfm)
  // Convert code blocks to markdown
  turndown_service.addRule('fencedCodeBlock', {
    filter: (node: any, options: any) => {
      return (
        options.codeBlockStyle == 'fenced' &&
        node.nodeName == 'PRE' &&
        node.querySelector('code')
      )
    },
    replacement: (_: any, node: any, options: any) => {
      const language = (node
        .querySelector('code')
        .className.match(/language-(\S+)/) || [null, ''])[1]

      return (
        '\n\n' +
        options.fence +
        language +
        '\n' +
        node.textContent +
        '\n' +
        options.fence +
        '\n\n'
      )
    },
  })
  // Convert math blocks to markdown
  turndown_service.addRule('multiplemath', {
    filter(node) {
      return node.nodeName == 'SPAN' && node.classList.contains('katex-display') // Check if it's a display math block that centers equation
    },
    replacement(_, node) {
      // "<annotation>" element holds expression string, right for markdown
      const annotation = node.querySelector('annotation')?.textContent
      if (!annotation) return ''
      return `$$\n${annotation}\n$$`
    },
  })
  turndown_service.addRule('multiplemath', {
    filter(node) {
      return node.nodeName == 'SPAN' && node.classList.contains('katex')
    },
    replacement(_, node) {
      // Check if the node is the only child of its parent paragraph
      // Yes - block, no - inline
      const is_block =
        node.parentNode?.nodeName == 'P' &&
        node.parentNode.childNodes.length == 1
      // "<annotation>" element holds expression string, right for markdown
      const annotation = node.querySelector('annotation')?.textContent
      if (!annotation) return ''
      return is_block ? `$$ ${annotation} $$` : `$${annotation}$`
    },
  })
  turndown_service.addRule('stripImages', {
    filter: ['figure', 'picture', 'img'],
    replacement: () => '',
  })
  return turndown_service
}

export const html_to_markdown = (html: string): string => {
  const turndown_service = create_turndown_service()
  return turndown_service.turndown(html)
}
