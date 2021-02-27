import Identifier from './Identifier'
import Title from './Title'
import Language from './Language'
import Meta from './Meta'
import Link from './Link'

export default class Metadata {
  name = 'metadata'
  identifiers: Identifier[] // 1 or more
  titles: Title[] // 1 or more
  languages: Language[] // 1 or more
  optional?: [] // 0 or more
  meta: Meta[] // 1 or more
  link?: Link[] // 0 or more

  constructor(
    identifiers: Identifier[],
    titles: Title[],
    languages: Language[],
    meta: Meta[]
  ) {
    this.identifiers = identifiers
    this.titles = titles
    this.languages = languages
    this.meta = meta
  }
}
