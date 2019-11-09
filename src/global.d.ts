declare namespace NovelService {
  
  export interface Adaptor<T extends Translation, SS extends SessionStorage, LS extends LocalStorage> {
    Translation: { new(): T },
    SessionStorage: { new(prefix: string): SS },
    LocalStorage: { new(prefix: string): LS }
  }
  
  export abstract class Translation {
    abstract translate(text: string, toLang: string): Promise<string>
    abstract audio(text: string): Promise<string>
  }
  
  export abstract class SessionStorage {
    abstract getItem(key: string): Promise<string>
    abstract setItem(key: string, value: string): Promise<void>
    abstract removeItem(key: string): Promise<void>
    abstract keys(): Promise<string[]>
    abstract sizes(): Promise<number>
  }
  
  export abstract class LocalStorage {
    abstract getItem(key: string): Promise<string>
    abstract setItem(key: string, value: string): Promise<void>
    abstract removeItem(key: string): Promise<void>
    abstract keys(): Promise<string[]>
    abstract sizes(): Promise<number>
    abstract clear(): Promise<void>
  }
}

declare module '*.vue' {
  import Vue from "vue";
  export default Vue;
}
