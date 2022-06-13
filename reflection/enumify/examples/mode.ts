import {strict as assert} from 'assert';
import { Enumify } from '../enumify';

class Mode extends Enumify {
  static readonly USER_R = new Mode(0b100000000);
  static readonly USER_W = new Mode(0b010000000);
  static readonly USER_X = new Mode(0b001000000);
  static readonly GROUP_R = new Mode(0b000100000);
  static readonly GROUP_W = new Mode(0b000010000);
  static readonly GROUP_X = new Mode(0b000001000);
  static readonly ALL_R = new Mode(0b000000100);
  static readonly ALL_W = new Mode(0b000000010);
  static readonly ALL_X = new Mode(0b000000001);

  static() {
    Mode.closeEnum();
  }

  constructor(public n: any) {
    super();
  }
}
assert.equal(
  Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n | Mode.GROUP_R.n | Mode.GROUP_X.n | Mode.ALL_R.n | Mode.ALL_X.n,
  0o755
);
assert.equal(Mode.USER_R.n | Mode.USER_W.n | Mode.USER_X.n | Mode.GROUP_R.n, 0o740);
