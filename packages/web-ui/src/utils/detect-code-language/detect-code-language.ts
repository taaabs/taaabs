/**
 * Based on https://github.com/ts95/lang-detector/blob/master/index.js
 */

const languages: Record<
  string,
  { pattern: RegExp; points: number; near_top?: boolean }[]
> = {
  typescript: [
    { pattern: /interface( )+\w+( )*\{/, points: 2 },
    { pattern: /type( )+\w+( )*=/, points: 2 },
    { pattern: /<\w+>/, points: 1 },
    { pattern: /:\s*(string|number|boolean|any|void|never)/, points: 1 },
    { pattern: /export (interface|type|class|function)/, points: 1 },
  ],
  javascript: [
    { pattern: /const|let|var( )+\w+( )*=/, points: 2 },
    { pattern: /function( )*\w+\s*\(.*\)( )*\{/, points: 2 },
    { pattern: /=>/, points: 1 },
    { pattern: /document\./, points: 1 },
    { pattern: /console\.log\(/, points: 1 },
  ],
  c: [
    { pattern: /#include( )*<[^>]+>/, points: 2, near_top: true },
    { pattern: /scanf\(|printf\(/, points: 2 },
    { pattern: /int main\(.*\)/, points: 2 },
    { pattern: /malloc\(|free\(/, points: 2 },
    { pattern: /struct( )+\w+( )*\{/, points: 1 },
  ],
  cpp: [
    { pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2 },
    { pattern: /#include( )*(<|")\w+(\.h)?(>|")/, points: 2, near_top: true },
    { pattern: /using( )+namespace( )+.+( )*;/, points: 2 },
    { pattern: /template( )*<.*>/, points: 2 },
    { pattern: /std::\w+/g, points: 2 },
    { pattern: /(cout|cin|endl)/g, points: 2 },
    { pattern: /(public|protected|private):/, points: 2 },
    { pattern: /nullptr/, points: 2 },
    { pattern: /new \w+(\(.*\))?/, points: 1 },
    { pattern: /#define( )+.+/, points: 1 },
    { pattern: /\w+<\w+>/, points: 1 },
    { pattern: /class( )+\w+/, points: 1 },
    { pattern: /void/g, points: 1 },
    { pattern: /(else )?if( )*\(.+\)/, points: 1 },
    { pattern: /while( )+\(.+\)/, points: 1 },
    { pattern: /\w*::\w+/, points: 1 },
    { pattern: /'.{2,}'/, points: -1 },
    {
      pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+[\w]+|;)/,
      points: -1,
    },
  ],
  python: [
    { pattern: /def( )+\w+\(.*\)( )*:/, points: 2 },
    { pattern: /while (.+):/, points: 2 },
    { pattern: /from [\w\.]+ import (\w+|\*)/, points: 2 },
    { pattern: /class( )*\w+(\(( )*\w+( )*\))?( )*:/, points: 2 },
    { pattern: /if( )+(.+)( )*:/, points: 2 },
    { pattern: /elif( )+(.+)( )*:/, points: 2 },
    { pattern: /else:/, points: 2 },
    { pattern: /for (\w+|\(?\w+,( )*\w+\)?) in (.+):/, points: 2 },
    { pattern: /\w+( )*=( )*\w+(?!;)(\n|$)/, points: 1 },
    { pattern: /import ([[^\.]\w])+/, points: 1, near_top: true },
    { pattern: /print((( )*\(.+\))|( )+.+)/, points: 1 },
    { pattern: /(&{2}|\|{2})/, points: -1 },
  ],
  java: [
    { pattern: /public( )+(class|interface)( )+\w+/, points: 2 },
    { pattern: /private|protected|public/, points: 1 },
    { pattern: /import( )+\w+(\.\w+)+( )*;/, points: 1, near_top: true },
    { pattern: /\w+( )+\w+( )*=( )*new( )+\w+\(/, points: 1 },
    { pattern: /@Override/, points: 1 },
  ],
  html: [
    { pattern: /<!DOCTYPE( )+html>/, points: 2, near_top: true },
    { pattern: /<html>|<\/html>/, points: 2 },
    { pattern: /<(head|body)>|<\/(head|body)>/, points: 1 },
    { pattern: /<\w+>.*<\/\w+>/, points: 1 },
    { pattern: /<\w+(\s+\w+=(["']).*?\2)*\s*\/?>/g, points: 1 },
  ],
  css: [
    { pattern: /(\w+|[.#]\w+)\s*\{[^}]*\}/g, points: 2 },
    { pattern: /(@media|@keyframes)/, points: 2 },
    { pattern: /\w+:\s*[^;]+;/, points: 1 },
    { pattern: /:\s*(hover|active|focus|nth-child)/, points: 1 },
  ],
  ruby: [
    { pattern: /def( )+\w+( )*(\(.+\))?$/, points: 2 },
    { pattern: /\w+\.each( )+do( )*\|.*\|/, points: 2 },
    { pattern: /attr_(reader|writer|accessor)/, points: 2 },
    { pattern: /require( )+['"].*['"]/, points: 1, near_top: true },
    { pattern: /\w+( )*=( )*%w\(.*\)/, points: 1 },
  ],
  php: [
    { pattern: /<\?php/, points: 2, near_top: true },
    { pattern: /\$\w+( )*=/, points: 2 },
    { pattern: /function( )+\w+\s*\(.*\)/, points: 2 },
    { pattern: /echo( )+(['"]).*\1/, points: 1 },
    { pattern: /^\s*use\s+[\w\\]+(\s+as\s+\w+)?;/m, points: 1 },
  ],
  go: [
    { pattern: /func( )+\w+\(.*\)( )*(\(.*\))?( )*\{/, points: 2 },
    { pattern: /import( )*\(/, points: 2, near_top: true },
    { pattern: /package( )+\w+/, points: 2, near_top: true },
    { pattern: /\w+( )*:=/, points: 1 },
    { pattern: /fmt\.(Print|Scan)/, points: 1 },
  ],
  swift: [
    {
      pattern: /func( )+\w+\s*\(((\w+\s*:\s*\w+,?\s*)*)\)\s*(->\s*\w+\s*)?\{/,
      points: 2,
    },
    { pattern: /class( )+\w+( )*:( )*\w+/, points: 2 },
    { pattern: /import( )+\w+/, points: 1, near_top: true },
    { pattern: /var|let( )+\w+( )*:( )*\w+/, points: 1 },
    { pattern: /override( )+func/, points: 1 },
  ],
  csharp: [
    { pattern: /using( )+\w+(\.\w+)*( )*;/, points: 1, near_top: true },
    { pattern: /namespace( )+\w+(\.\w+)*/, points: 2 },
    { pattern: /public( )+(class|interface|struct)( )+\w+/, points: 2 },
    {
      pattern: /(private|protected|internal|public)( )+(static( )+)?\w+( )+\w+/,
      points: 1,
    },
    { pattern: /Console\.(Write|Read)Line/, points: 1 },
  ],
  zig: [
    { pattern: /const( )+\w+( )*=/, points: 2 },
    { pattern: /fn( )+\w+\(.*\)( )*(\w+|\{)/, points: 2 },
    { pattern: /std\.\w+/, points: 1 },
    { pattern: /comptime/, points: 2 },
    { pattern: /\|\|( )*\w+:( )*\w+/, points: 1 },
  ],
  rust: [
    {
      pattern: /fn( )+\w+\s*(<[^>]+>)?\s*\(.*\)(\s*->\s*\w+)?\s*\{/,
      points: 2,
    },
    { pattern: /let( )+mut( )+\w+/, points: 2 },
    { pattern: /use( )+\w+::\{.*\};/, points: 1, near_top: true },
    { pattern: /impl( )+\w+( )+for( )+\w+/, points: 2 },
    { pattern: /#\[derive\(.*\)\]/, points: 1 },
  ],
  sql: [
    { pattern: /SELECT .+ FROM .+/, points: 2 },
    { pattern: /INSERT INTO .+ VALUES/, points: 2 },
    { pattern: /UPDATE .+ SET .+ WHERE/, points: 2 },
    { pattern: /CREATE TABLE \w+/, points: 2 },
    { pattern: /ALTER TABLE \w+/, points: 1 },
  ],
}

export const detect_code_language = (code: string): string | undefined => {
  const lines = code.split('\n')
  const scores = new Map<string, number>()

  const evaluate_pattern = (
    language: string,
    pattern_data: { pattern: RegExp; points: number; near_top?: boolean },
    line: string,
    index: number,
  ): void => {
    if (pattern_data.near_top && index > 10) return
    const matches = line.match(pattern_data.pattern)
    if (matches) {
      const current_score = scores.get(language) || 0
      scores.set(language, current_score + pattern_data.points * matches.length)
    }
  }

  for (const [language, patterns] of Object.entries(languages)) {
    patterns.forEach((patternData) => {
      lines.forEach((line, index) =>
        evaluate_pattern(language, patternData, line, index),
      )
    })
  }

  const sorted_scores = Array.from(scores.entries()).sort((a, b) => b[1] - a[1])
  return sorted_scores.length > 0 && sorted_scores[0][1] > 0
    ? sorted_scores[0][0]
    : undefined
}
