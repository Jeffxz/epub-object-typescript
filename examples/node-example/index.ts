import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as JSZip from 'jszip'
import { Container, Epub, Ocf, Package } from '../../index'
import { Ncx } from '../../src/Packages'

const program = new Command()
program.option('-f, --file <epub>', 'convert a single epub file')

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
        zip.files[Ocf.containerPath]
          .async('string')
          .then((xmlString) => {
            const container = Container.loadFromXML(xmlString)
            if (container) {
              ocf = new Ocf(container)
              return ocf
            } else {
              throw new Error(
                `could not find epub container from path ${Ocf.containerPath}`
              )
              return null
            }
          })
          .then((ocf) => {
            if (ocf) {
              zip.files[ocf.container?.defaultRendition().fullPath]
                .async('string')
                .then((xmlString) => {
                  epubPackage = Package.loadFromXML(xmlString)
                  if (epubPackage != null) {
                    epub = new Epub(ocf, epubPackage)
                  }
                })
                .then(() => {
                  if (epub) {
                    // console.log(JSON.stringify(epub, null, 2))
                    if (epub._nav) {
                      console.log(`found nav file ${JSON.stringify(epub._nav)}`)
                    }
                    if (epub._toc && epub._toc.href) {
                      console.log(`found toc file ${epub._toc.href}`)
                      const opfFolderPath = path.dirname(
                        ocf.container?.defaultRendition().fullPath
                      )
                      const tocPath = path.join(opfFolderPath, epub._toc.href)
                      zip.files[tocPath].async('string').then((xmlString) => {
                        const ncx = Ncx.loadFromXML(xmlString)
                        console.log(JSON.stringify(ncx?.navMap))
                        if (ncx?.pageList) {
                          console.log(JSON.stringify(ncx.pageList))
                        }
                      })
                    }
                    if (epub._coverImage) {
                      console.log(
                        `found cover image file ${JSON.stringify(
                          epub._coverImage
                        )}`
                      )
                    }
                    if (epub._a11yLevel) {
                      console.log(`found a11y level ${epub._a11yLevel}`)
                    }
                  }
                })
                .catch((error) => {
                  throw error
                })
            }
          })
          .catch((error) => {
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
