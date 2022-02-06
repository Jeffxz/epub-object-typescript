import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as JSZip from 'jszip'
import { Container, Epub, Ocf, Package } from '../../index'
import Ncx from '../../src/NCX/Ncx'
import EpubHelper from '../../src/EpubHelper';

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
              zip.files[ocf.container?.rootfiles[0].fullPath]
                .async('string')
                .then((xmlString) => {
                  epubPackage = Package.loadFromXML(xmlString)
                  if (epubPackage != null) {
                    epub = new Epub(ocf, epubPackage)
                  }
                })
                .then(() => {
                  if (epub) {
                    console.log(JSON.stringify(epub, null, 2))
                    const epubHelper = new EpubHelper(epub)
                    if (epubHelper.nav) {
                      console.log(`===> found nav file ${JSON.stringify(epubHelper.nav)}`)
                    }
                    if (epubHelper.toc && epubHelper.toc.href) {
                      console.log(`===> found toc file ${epubHelper.toc.href}`)
                      const opfFolderPath = path.dirname(
                        ocf.container?.rootfiles[0].fullPath
                      )
                      const tocPath = path.join(opfFolderPath, epubHelper.toc.href)
                      zip.files[tocPath].async('string').then((xmlString) => {
                        const ncx = Ncx.loadFromXML(xmlString)
                        console.log(`===> found page list ${JSON.stringify(ncx?.navMap)}`)
                        if (ncx?.pageList) {
                          console.log(JSON.stringify(ncx.pageList))
                        }
                      })
                    }
                    if (epubHelper.coverImage) {
                      console.log(
                        `===> found cover image file ${JSON.stringify(
                            epubHelper.coverImage
                        )}`
                      )
                    }
                    if (epubHelper.a11yLevel) {
                      console.log(`===> found a11y level ${epubHelper.a11yLevel}`)
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
