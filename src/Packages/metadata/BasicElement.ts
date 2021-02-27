export default class BasicElement {
  name = ''
  nameSpace = 'http://purl.org/dc/elements/1.1/'
  id?: string
  content: string

  constructor(content: string) {
    this.content = content
  }
}
