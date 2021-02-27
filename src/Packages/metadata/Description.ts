import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Description extends BasicElement {
  name = 'dc:description'

  dir?: DIR
  xmlLang?: string
}
