import { Command } from 'commander'

interface Params {
  output?: string
  template?: string
}

interface CLI extends Params, Command {}
