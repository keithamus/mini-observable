import {readdirSync, readFileSync} from 'fs'
import {resolve} from 'path'
import {expect} from 'chai'
import {describe, it} from 'mocha'

describe('README', () => {

  it('contains headings for each util function', () => {
    const utils = readdirSync(resolve(__dirname, '..'))
      .filter(file => file !== 'all.ts' && file !== 'index.d.ts' && file.endsWith('.ts'))
      .map(file => file.substr(0, file.length - 3))
      .filter(file => file !== 'observable')
    const readme = readFileSync(resolve(__dirname, '../readme.md'), 'utf8')
    for (const util of utils) {
      expect(readme).to.match(new RegExp(`^### ${util} \\[Ⓢ\\]\\(\\./${util}\\.ts\\)$`, 'mi'),
        `readme has no section for ${util}`)
    }
  })

})

