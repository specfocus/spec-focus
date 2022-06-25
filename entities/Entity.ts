export type Identifier = string | number;

export interface Entity {
  id: Identifier;
  [key: string]: any;
}