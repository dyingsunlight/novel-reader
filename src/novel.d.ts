declare namespace NovelAppService {
  
  export interface Adaptor<T extends Translation, SS extends SessionStorage, LS extends LocalStorage> {
    Translation: { new(): T },
    SessionStorage: { new(prefix: string): SS },
    LocalStorage: { new(prefix: string): LS }
  }
  
  export abstract class Translation {
    abstract translate(text: string, toLang: string): Promise<string>
    
    abstract audio(text: string): Promise<string>
  }
  
  interface Storage {
     getItem(key: string): Promise<string>
  
     setItem(key: string, value: string): Promise<void>
  
     removeItem(key: string): Promise<void>
  
     keys(): Promise<string[]>
  
     sizes(): Promise<number>
  }
  
  export abstract class SessionStorage extends Storage {}
  
  export abstract class LocalStorage extends Storage {}
  
}

declare namespace NovelServices {
  export abstract class RuleResolver {}
}
