import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Rights extends BasicElement {
  name = 'dc:rights'

  dir?: DIR
  xmlLang?: string
}
