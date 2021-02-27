import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Creator extends BasicElement {
  name = 'dc:creator'

  dir?: DIR
  xmlLang?: string
}
