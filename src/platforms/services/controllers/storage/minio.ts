import { Client } from 'minio'
import {NovelServices} from "novel-model"

export default class MinioStorage implements NovelServices.Storage {
  private region = process.env['STORAGE_MINIO_REGION'] || 'us-west-1'
  private endpoint = process.env['STORAGE_MINIO_ENDPOINT'] || 'localhost'
  private port = Number(process.env['STORAGE_MINIO_ENDPOINT_PORT'] || '9000')
  
  private bucketName = 'moonset'

  private s3 = new Client({
    endPoint: this.endpoint,
    port: this.port,
    region: this.region,
    useSSL: false,
    accessKey: process.env['STORAGE_MINIO_ACCESS_KEY'],
    secretKey: process.env['STORAGE_MINIO_SECRET_KEY'],
  });
  private isAllReady = false
  
  constructor() {
    this.initialize().catch(e => {
      console.error(e)
    })
  }
  
  private async getObject(filename): Promise<string> {
    const file = await this.s3.getObject(this.bucketName, filename)
    return new Promise(resolve => {
      let data = ''
      file.on('data', function(chunk) {
        data+=chunk;
      });
      file.on('end', function() {
        resolve(<string>data)
      });
    })
  }
  private async saveObject(filename, body: string | NodeJS.ReadableStream) {
    if (typeof body === 'string') {
      await this.s3.putObject(this.bucketName, filename, Buffer.from(String(body), 'utf-8'))
    } else {
      await this.s3.putObject(this.bucketName, filename, body)
    }
  }
  
  private async createBucketIfNotExist() {
    const Buckets = await this.s3.listBuckets()
    if (Buckets.some(bucket => bucket.name === this.bucketName)) return
    console.log(this.bucketName + ' was waiting to be created.')
    await this.s3.makeBucket(this.bucketName, this.region)
    console.log(this.bucketName + ' was created')
  }
  
  async waitUntilInitialized() {
    let maxWaitTimes = 20
    let waitTime = 0
    
    while (!this.isAllReady && maxWaitTimes > waitTime++) {
      console.log('Pending for database loaded')
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    
    if (!this.isAllReady) {
      throw new Error("Timeout")
    }
  }
  
  
  async initialize() {
    await this.createBucketIfNotExist()
    this.isAllReady = true
  }
  
  async saveFile(path: string, content: string): Promise<NovelServices.FileURL|void> {
    await this.waitUntilInitialized()
    await this.saveObject(path, content)
    return path
  }
  
  async getFileContent(path: string): Promise<string> {
    return await this.getObject(path)
  }
  
  async saveFileStream(path: string, content: NodeJS.ReadableStream){
    await this.waitUntilInitialized()
    await this.saveObject(path, content)
    return path
  }
  
  async getFileStream(filename) {
    return <NodeJS.ReadableStream>await this.s3.getObject(this.bucketName, filename)
  }
}
