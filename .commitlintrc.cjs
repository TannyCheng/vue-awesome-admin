const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

const scope = fs
  .readdirSync(path.resolve(__dirname, 'src'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name.replace(/s$/, ''))

// precomputed scope
const scopeComplete = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')
  .find((r) => ~r.indexOf('M src'))
  ?.replace(/(\/)/g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1]
  ?.replace(/s$/, '')

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'type-empty': [2, 'never'],
    'type-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
  alias: {
    ur: 'docs: update README',
  },
  prompt: {
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    scopes: [...scope, 'mock'],
    defaultScope: scopeComplete,
    allowEmptyIssuePrefix: false,
    allowCustomIssuePrefix: false,
    useEmoji: true,
    emojiAlign: 'center',
    typesAppend: [
      { value: 'wip', name: 'wip: work in progress', emoji: ':laptop:' },
      { value: 'workflow', name: 'workflow: workflow improvements', emoji: ':scroll:' },
      { value: 'types', name: 'types: type definition file changes', emoji: ':blue_book:' },
    ],
  },
}
