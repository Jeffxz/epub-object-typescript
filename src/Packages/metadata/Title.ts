import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Title extends BasicElement {
  name = 'dc:title'
  dir?: DIR
  xmlLang?: string
}
