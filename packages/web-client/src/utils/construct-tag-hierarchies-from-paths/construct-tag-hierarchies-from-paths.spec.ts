import { construct_tag_hierarchies_from_paths } from './construct-tag-hierarchies-from-paths'

describe('[construct_tag_hierarchies_from_paths', () => {
  it('yields correct tree', () => {
    const paths = ['/a/b', '/b', '/a/b/c', '/a', '/a/c', '/a', '/a/c', '/b/a']
    const expected_result = [
      {
        name: 'a',
        children: [
          {
            name: 'b',
            children: [
              {
                name: 'c',
                children: [],
              },
            ],
          },
          {
            name: 'c',
            children: [],
          },
        ],
      },
      {
        name: 'b',
        children: [
          {
            name: 'a',
            children: [],
          },
        ],
      },
    ]

    expect(construct_tag_hierarchies_from_paths(paths)).toStrictEqual(
      expected_result,
    )
  })
})
