export declare namespace NovelAppService {
  
  export abstract class Translation {
    abstract translate(text: string, toLang: string): Promise<string>
    abstract audio(text: string): Promise<string>
  }
  
  class Storage {
    
     getItem(key: string): Promise<string>
  
     setItem(key: string, value: string): Promise<void>
  
     removeItem(key: string): Promise<void>
  
     keys(): Promise<string[]>
  
     sizes(): Promise<number>
  }
  
  export abstract class SessionStorage extends Storage {}
  
  export abstract class LocalStorage extends Storage {}
  
}

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
    title: string
    description: string
    subtitle?: string
    prefix?:string
    suffix?:string
    
    authors: string[]
    publishers: string[]
    url ?: string
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
