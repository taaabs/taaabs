import { get_site_variants_for_search } from './get-site-variants-for-search'

describe('[get_site_variants_for_search]', () => {
  it('yields expected output', () => {
    const input = 'example.com'
    const expected_output = ['examplecom', 'example']
    expect(get_site_variants_for_search(input).sort()).toEqual(
      expected_output.sort(),
    )
  })

  it('yields expected output', () => {
    const input = 'example.com/lorem'
    const expected_output = [
      'examplecomlorem',
      'examplecom',
      'example',
      'examplelorem',
      'lorem',
    ]
    expect(get_site_variants_for_search(input).sort()).toEqual(
      expected_output.sort(),
    )
  })

  it('yields expected output', () => {
    const input = 'ipsum.emit.example.com/lorem'
    const expected_output = [
      'ipsum',
      'ipsumemit',
      'ipsumemitexample',
      'ipsumemitexamplecom',
      'ipsumlorem',
      'ipsumemitlorem',
      'ipsumemitexamplelorem',
      'ipsumemitexamplecomlorem',
      'emit',
      'emitexample',
      'emitexamplecom',
      'emitlorem',
      'emitexamplelorem',
      'emitexamplecomlorem',
      'example',
      'examplecom',
      'examplelorem',
      'examplecomlorem',
      'lorem',
    ]
    expect(get_site_variants_for_search(input).sort()).toEqual(
      expected_output.sort(),
    )
  })

  it('yields expected output', () => {
    const input = 'www.example.com/lorem'
    const expected_output = [
      'www',
      'wwwlorem',
      'lorem',
      'wwwexamplecomlorem',
      'examplecomlorem',
      'wwwexamplecom',
      'wwwexample',
      'wwwexamplelorem',
      'examplecom',
      'example',
      'examplelorem',
    ]
    expect(get_site_variants_for_search(input).sort()).toEqual(
      expected_output.sort(),
    )
  })
})
