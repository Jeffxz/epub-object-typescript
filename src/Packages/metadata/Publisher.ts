import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Publisher extends BasicElement {
  name = 'dc:publisher'

  dir?: DIR
  xmlLang?: string
}
