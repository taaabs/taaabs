/**
 * Based on https://github.com/ts95/lang-detector/blob/master/index.js
 */

const languages: Record<
  string,
  { pattern: RegExp; points: number; near_top?: boolean }[]
> = {
  typescript: [
    {
      pattern: /import( )+.*( )+from( )+('|").*('|");/,
      points: 5,
      near_top: true,
    },
    {
      pattern:
        /export( )+(default( )+)?(const|let|var|class|interface|function|enum)/,
      points: 5,
      near_top: true,
    },
    { pattern: /(const|let|var)( )+\w+:( )*\w+/, points: 3 },
    { pattern: /function( )+\w+\(.*\):( )*\w+/, points: 3 },
    { pattern: /interface( )+\w+/, points: 5 },
    { pattern: /type( )+\w+( )*=( )*{/, points: 5 },
    { pattern: /enum( )+\w+/, points: 5 },
    { pattern: /implements( )+\w+/, points: 3 },
    { pattern: /namespace( )+\w+/, points: 2 },
    { pattern: /abstract( )+class( )+\w+/, points: 2 },
    { pattern: /private( )+\w+:/, points: 2 },
    { pattern: /protected( )+\w+:/, points: 2 },
    { pattern: /public( )+\w+:/, points: 2 },
    { pattern: /readonly( )+\w+:/, points: 2 },
    { pattern: /@Injectable\(\)/, points: 3 },
    { pattern: /@Component\(\{/, points: 3 },
  ],
  javascript: [
    { pattern: /undefined/g, points: 2 },
    { pattern: /console\.log( )*\(/, points: 2 },
    { pattern: /(var|const|let)( )+\w+( )*=?/, points: 2 },
    { pattern: /(('|").+('|")( )*|\w+):( )*[{\[]/, points: 2 },
    { pattern: /===/g, points: 1 },
    { pattern: /!==/g, points: 1 },
    { pattern: /function\*?(( )+[\$\w]+( )*\(.*\)|( )*\(.*\))/g, points: 1 },
    { pattern: /null/g, points: 1 },
    { pattern: /\(.*\)( )*=>( )*.+/, points: 1 },
    { pattern: /(else )?if( )+\(.+\)/, points: 1 },
    { pattern: /while( )+\(.+\)/, points: 1 },
    { pattern: /(^|\s)(char|long|int|float|double)( )+\w+( )*=?/, points: -1 },
    { pattern: /(\w+)( )*\*( )*\w+/, points: -1 },
    {
      pattern: /<(\/)?script( type=('|")text\/javascript('|"))?>/,
      points: -50,
    },
  ],
  c: [
    { pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2 },
    { pattern: /malloc\(.+\)/, points: 2 },
    { pattern: /#include (<|")\w+\.h(>|")/, points: 2, near_top: true },
    { pattern: /(\w+)( )*\*( )*\w+/, points: 2 },
    { pattern: /(\w+)( )+\w+(;|( )*=)/, points: 1 },
    { pattern: /(\w+)( )+\w+\[.+\]/, points: 1 },
    { pattern: /#define( )+.+/, points: 1 },
    { pattern: /NULL/, points: 1 },
    { pattern: /void/g, points: 1 },
    { pattern: /(else )?if( )*\(.+\)/, points: 1 },
    { pattern: /while( )+\(.+\)/, points: 1 },
    { pattern: /(printf|puts)( )*\(.+\)/, points: 1 },
    { pattern: /new \w+/, points: -1 },
    { pattern: /new [A-Z]\w*( )*\(.+\)/, points: 2 },
    { pattern: /'.{2,}'/, points: -1 },
    { pattern: /var( )+\w+( )*=?/, points: -1 },
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
    {
      pattern: /^\s*package\s+[a-zA-Z_][\w.]*\s*;/,
      points: 10,
      near_top: true,
    }, // Package declaration
    { pattern: /^\s*import\s+[a-zA-Z_][\w.*]*\s*;/, points: 8, near_top: true }, // Import statement
    { pattern: /^\s*public\s+class\s+[A-Z][a-zA-Z0-9_]*\s*{/, points: 10 }, // Public class declaration
    { pattern: /^\s*class\s+[A-Z][a-zA-Z0-9_]*\s*{/, points: 8 }, // Class declaration
    {
      pattern:
        /^\s*public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*[a-zA-Z_][\w]*\s*\)\s*{/,
      points: 10,
    }, // Main method signature
    {
      pattern: /^\s*public\s+[\w<>\[\]]+\s+[a-zA-Z_][\w]*\s*\(.*\)\s*{/,
      points: 6,
    }, // Public method signature
    {
      pattern: /^\s*private\s+[\w<>\[\]]+\s+[a-zA-Z_][\w]*\s*\(.*\)\s*{/,
      points: 6,
    }, // Private method signature
    {
      pattern: /^\s*protected\s+[\w<>\[\]]+\s+[a-zA-Z_][\w]*\s*\(.*\)\s*{/,
      points: 6,
    }, // Protected method signature
    { pattern: /^\s*@[a-zA-Z_][\w]*\s*$/, points: 4 }, // Annotations
    { pattern: /\bpublic\b|\bprivate\b|\bprotected\b/, points: 2 }, // Access modifiers
    { pattern: /\bclass\b/, points: 2 }, // class keyword
    { pattern: /\binterface\b/, points: 2 }, // interface keyword
    { pattern: /\bextends\b|\bimplements\b/, points: 2 }, // extends and implements keywords
    { pattern: /\bnew\s+[A-Z][a-zA-Z0-9_]*\s*\(/, points: 2 }, // Object instantiation
    { pattern: /\bthrow\s+new\s+[A-Z][a-zA-Z0-9_]*\s*\(/, points: 2 }, // Exception throwing
  ],
  html: [
    { pattern: /^\s*<!DOCTYPE html>/i, points: 10, near_top: true }, // Doctype declaration
    { pattern: /^\s*<html/i, points: 8, near_top: true }, // <html> tag
    { pattern: /^\s*<\/html>/i, points: 8 }, // </html> tag
    { pattern: /^\s*<head>/i, points: 6 }, // <head> tag
    { pattern: /^\s*<\/head>/i, points: 6 }, // </head> tag
    { pattern: /^\s*<body>/i, points: 6 }, // <body> tag
    { pattern: /^\s*<\/body>/i, points: 6 }, // </body> tag
    { pattern: /^\s*<div/i, points: 4 }, // <div> tag
    { pattern: /^\s*<\/div>/i, points: 4 }, // </div> tag
    { pattern: /^\s*<!--/, points: 2 }, // HTML comments
    { pattern: /^\s*<[a-zA-Z][^>]*>/, points: 2 }, // Generic opening tag
    { pattern: /^\s*<\/[a-zA-Z][^>]*>/, points: 2 }, // Generic closing tag
    { pattern: /.*&[a-zA-Z]+;/, points: 1 }, // HTML entities
    { pattern: /^\s*<meta/i, points: 3 }, // <meta> tag
    { pattern: /^\s*<link/i, points: 3 }, // <link> tag
    { pattern: /^\s*<script/i, points: 3 }, // <script> tag
    { pattern: /^\s*<style/i, points: 3 }, // <style> tag
  ],
  css: [
    { pattern: /^\s*[a-zA-Z0-9\-\_\.\#\:\[\]=]+\s*\{/, points: 10 }, // Selectors with curly braces
    { pattern: /^\s*@[a-z\-]+\s*[^\{]+\{/, points: 8 }, // @-rules (media queries, keyframes, etc.)
    { pattern: /^\s*[a-z\-]+\s*:\s*[a-zA-Z0-9\-\_\.\(\)\%\#]+;$/, points: 6 }, // Property-value pairs
    { pattern: /\s*\}\s*$/, points: 4 }, // Closing curly braces
    { pattern: /^\s*\/\*/, points: 2 }, // Comments
    { pattern: /.*\{\s*\}/, points: 1 }, // Empty CSS rules
    { pattern: /.*!important\s*;/, points: 2 }, // Important declarations
    {
      pattern: /^\s*--[a-zA-Z0-9\-]+\s*:\s*[a-zA-Z0-9\-\_\.\(\)\%\#]+;$/,
      points: 5,
    }, // CSS custom properties (variables)
  ],
  ruby: [
    { pattern: /module( )+\w+/, points: 5, near_top: true },
    { pattern: /class( )+\w+/, points: 5, near_top: true },
    { pattern: /def( )+\w+/, points: 2 },
    { pattern: /attr_accessor( )+:/, points: 2 },
    { pattern: /attr_reader( )+:/, points: 2 },
    { pattern: /attr_writer( )+:/, points: 2 },
    { pattern: /include( )+\w+/, points: 2 },
    { pattern: /extend( )+\w+/, points: 2 },
    { pattern: /require( )+['"](.*?)['"]/, points: 2 },
    { pattern: /require_relative( )+['"](.*?)['"]/, points: 2 },
  ],
  php: [
    { pattern: /<\?php/, points: 10, near_top: true },
    { pattern: /\?>/, points: 5 },
    { pattern: /\$\w+/, points: 2 },
    { pattern: /echo( )+("|').+("|');/, points: 2 },
    { pattern: /array\(.+\)/, points: 2 },
    { pattern: /->\w+/, points: 2 },
    { pattern: /::\w+/, points: 2 },
    { pattern: /public( )+function( )+\w+\(.*\)/, points: 2 },
    { pattern: /private( )+function( )+\w+\(.*\)/, points: 2 },
    { pattern: /protected( )+function( )+\w+\(.*\)/, points: 2 },
    { pattern: /function( )+\w+\(.*\)/, points: 1 },
    { pattern: /namespace( )+.+;/, points: 1 },
    { pattern: /use( )+.+;/, points: 1 },
    { pattern: /include( )+\(.+\);/, points: 1 },
    { pattern: /require( )+\(.+\);/, points: 1 },
    { pattern: /const( )+\w+( )*=( )*.+;/, points: 1 },
    { pattern: /class( )+\w+/, points: 1 },
  ],
  go: [
    { pattern: /package( )+main;/, points: 5, near_top: true },
    { pattern: /import( )+[""](.*?)[""]/, points: 5, near_top: true },
    { pattern: /type( )+\w+/, points: 5 },
    { pattern: /struct( )+\w+/, points: 5 },
    { pattern: /func( )+\w+\(.*\)/, points: 3 },
    { pattern: /var( )+\w+/, points: 2 },
    { pattern: /const( )+\w+/, points: 2 },
  ],
  swift: [
    { pattern: /import( )+UIKit;/, points: 5, near_top: true },
    { pattern: /class( )+\w+:/, points: 5 },
    { pattern: /struct( )+\w+:/, points: 5 },
    { pattern: /enum( )+\w+:/, points: 5 },
    { pattern: /func( )+\w+\(.*\)/, points: 3 },
    { pattern: /let( )+\w+:/, points: 2 },
    { pattern: /var( )+\w+:/, points: 2 },
  ],
  csharp: [
    { pattern: /using( )+System\.(.*);/, points: 5, near_top: true },
    { pattern: /public( )+class( )+\w+/, points: 5, near_top: true },
    { pattern: /private( )+\w+;/, points: 2 },
    { pattern: /protected( )+\w+;/, points: 2 },
    { pattern: /public( )+\w+;/, points: 2 },
    { pattern: /static( )+\w+;/, points: 2 },
    { pattern: /abstract( )+class( )+\w+/, points: 2 },
    { pattern: /interface( )+\w+/, points: 5 },
    { pattern: /enum( )+\w+/, points: 5 },
  ],
  zig: [
    { pattern: /const( )+\w+:/, points: 5, near_top: true },
    { pattern: /pub( )+fn( )+\w+/, points: 5, near_top: true },
    { pattern: /var( )+\w+:/, points: 2 },
    { pattern: /fn( )+\w+/, points: 2 },
    { pattern: /pub( )+var( )+\w+:/, points: 2 },
    { pattern: /comptime( )+\w+:/, points: 2 },
    { pattern: /extern( )+"c"(.*)/, points: 2 },
    { pattern: /struct( )+\w+/, points: 5 },
    { pattern: /union( )+\w+/, points: 5 },
    { pattern: /enum( )+\w+/, points: 5 },
  ],
  rust: [
    { pattern: /use( )+crate::\*/, points: 5, near_top: true },
    { pattern: /use( )+std::\*/, points: 5, near_top: true },
    { pattern: /fn( )+main( )*\(/, points: 5 },
    { pattern: /struct( )+\w+/, points: 5 },
    { pattern: /enum( )+\w+/, points: 5 },
    { pattern: /impl( )+Trait/, points: 5 },
    { pattern: /let( )+mut( )+\w+/, points: 3 },
    { pattern: /let( )+\w+/, points: 3 },
    { pattern: /match( )+.*/, points: 3 },
    { pattern: /if( )+let/, points: 2 },
    { pattern: /while( )+let/, points: 2 },
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
