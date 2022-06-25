export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

export interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}