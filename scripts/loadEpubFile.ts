import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as JSZip from "jszip"
import { Container, Epub, Ocf, Package } from '../index';

const program = new Command()
program
  .option('-f, --file <epub>', 'convert a single epub file')

program.parse(process.argv)

const options = program.opts()
if (options.file) {
  let epub: Epub | null
  let ocf: Ocf | null
  let epubPackage: Package | null
  const fileName = options.file
  console.log(`loading file ${fileName}`)
  try {
    fs.readFile(fileName, (error, data) => {
      JSZip.loadAsync(data).then((zip) => {
        zip.files[Ocf.containerPath].async('string').then((xmlString) => {
          const container = Container.loadFromXML(xmlString)
          if (container) {
            ocf = new Ocf(container)
            return ocf
          } else {
            throw new Error(`could not find epub container from path ${Ocf.containerPath}`)
            return null
          }
        }).then((ocf) => {
          if (ocf) {
            zip.files[ocf.container?.defaultRendition().fullPath].async('string').then((xmlString) => {
              epubPackage = Package.loadFromXML(xmlString)
              if (epubPackage != null) {
                epub = new Epub(ocf, epubPackage)
              }
            }).then(() => {
              if (epub) {
                console.log(JSON.stringify(epub, null, 2))
              }
            }).catch((error) => {
              throw error
            })
          }
        }).catch((error) => {
          console.error(error)
        })
      })
    })
  } catch (error) {
    console.error(error)
  }
} else {
  console.error('Usage: yarn load-epub-file -f <epub file path>')
}