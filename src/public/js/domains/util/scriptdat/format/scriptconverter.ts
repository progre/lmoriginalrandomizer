import sha3 from 'js-sha3';
import Script from '../data/Script';
import { decode, encode } from './codec';

// tslint:disable:max-line-length
const SCRIPT_DAT_HASH = 'd18f3a643bee62db6870b35b1a1781bcc4067bd7409fa620168e16054ddc7ce645463b59e06d0768d87eff9ad9bdc1f0efd04dbc498d2e5de73d5a863a692a90';
const SCRIPT_DAT_EN_HASH = '146e1b6e9e63ed22fb84b3c38f4d25a0723b07fe3fefe9395af68d6eeaa3b1108b288847ec50114efff4e7600afccc68a983d681b94cbb55a507b21f45d52db7';
// tslint:enable:max-line-length

export function readScriptDat(file: ArrayBuffer) {
  if (!isValidScriptDat(file)) {
    throw new Error('invalidfile');
  }
  const txt = decode(file);
  return Script.parse(txt);
}

export function buildScriptDat(nativeLib: any, script: Script) {
  const str = script.stringify();
  const array = new Uint8Array(str.length);
  encode(nativeLib, str, array.byteLength, array);
  return array;
}

export function isValidScriptDat(file: ArrayBuffer) {
  const fileHash = sha3.sha3_512(file);
  return fileHash === SCRIPT_DAT_HASH || fileHash === SCRIPT_DAT_EN_HASH;
}
