import BasicElement from './BasicElement'

export default class Identifier extends BasicElement {
  name = 'dc:identifier'

  constructor(content: string, id?: string) {
    super(content)
    this.id = id
  }
}
