import { createCommand } from 'commander'
import process, { exit } from 'process'
import path from 'path'
import { CLI, Params } from './@types/common'
import fs from 'fs'
import fse from 'fs-extra'

export class Program {
  public templatesFolder: string
  public program: CLI
  public params: Params
  public outputFolder: string

  constructor() {
    this.templatesFolder = path.resolve(process.cwd(), 'data')
    this.program = createCommand()
    this.init()
  }

  public run() {
    this.checkAndMakeFolder(this.outputFolder)
    this.checkAndMakeTemplate(this.params.template)
    console.log('Task Completed')
  }

  private init() {
    this.program
      .version('0.0.1', '-v, --version', 'output the current version')
      .option('-o, --output <location>', 'specify output folder name', './')
      .option('-t, --template <name>', 'specify template name', undefined)
      .parse(process.argv)

    this.params = this.program.opts()

    try {
      this.outputFolder = path.resolve(process.cwd(), this.params.output)
    } catch (error) {
      console.log('Output path is not well defined')
      exit(1)
    }
  }

  private checkAndMakeFolder(folder: string) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  }

  private checkAndMakeTemplate(templateString: string) {
    const template = templateString.toLowerCase()
    switch (template) {
      case 'python':
        this.copyPython()
        break
      case 'node-ts':
        this.copyNodeTs()
        break
      default:
        console.log('Template not found')
        exit(1)
    }
  }

  private copyPython() {
    const template = path.resolve(this.templatesFolder, 'python')
    fse.copySync(template, this.outputFolder, { recursive: true })
  }

  private copyNodeTs() {
    const template = path.resolve(this.templatesFolder, 'node-ts')
    fse.copySync(template, this.outputFolder, { recursive: true })
  }
}
