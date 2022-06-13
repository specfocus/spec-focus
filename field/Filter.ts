import { SimpleObject } from '../../object';
import { Model } from '../model';

export class Filter<T extends SimpleObject> {
  constructor(public model: Model<T>) {

  }
}