import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Meta extends BasicElement {
  name = 'meta'

  dir?: DIR
  property: string
  refines?: string
  scheme?: string
  xmlLang?: string

  constructor(property: string, content: string) {
    super(content)
    this.property = property
  }
}
