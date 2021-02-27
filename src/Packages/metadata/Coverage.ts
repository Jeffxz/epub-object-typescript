import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Coverage extends BasicElement {
  name = 'dc:coverage'

  dir?: DIR
  xmlLang?: string
}
