export declare namespace NovelServices {
  
  export interface ContentsItem {
    title: string
    url: string
    updated ?: string
    created ?: string
    subtitle?: string
    prefix?:string
    suffix?:string
    children?: ContentsItem[]
  }
  
  export interface Meta {
    id: string
    url : string
    title: string
    description: string
    subtitle?: string
    prefix?:string
    suffix?:string
    contents: ContentsItem[]
    authors: string[]
    publishers: string[]
  }
  
  export abstract class RuleResolver {
    public readonly domain: string
    getChapter(url: string): Promise<string| void>
    getMeta(url: string): Promise<string|void>
    test(url: string): Boolean
  }
  
  
  export type FileURL = string
  export abstract class Storage {
    initialize()
    saveFile(path: string, content: string): Promise<FileURL|void>
    
    saveFileStream(path: string, stream: NodeJS.ReadableStream): Promise<FileURL| void>
    
    getFileStream(path: string): Promise<NodeJS.ReadableStream | void>
    
    getFileContent(path: string): Promise<string>
  }
}
