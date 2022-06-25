import { Transform } from 'readable-stream';
import type { TransformOptions } from 'readable-stream';

export class Through extends Transform {
  public root: any;

  constructor(
    transform: (chunk: any, encoding: BufferEncoding, callback: (error?: Error, data?: any) => void) => void,
    flush: (callback: (error?: Error, data?: any) => void) => void,
    options?: TransformOptions
  ) {
    super(options);
    super._transform = transform;
    super._flush = flush;
  }

  destroy(...args: any[]) {

  }

  emit(...args: any[]) {

  }

  push(...args: any[]) {

  }
}