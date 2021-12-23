export default abstract class BasicElement {
  nameSpace = 'http://purl.org/dc/elements/1.1/'
  id?: string
  contentText?: string

  constructor(text?: string) {
    this.contentText = text
  }
}
