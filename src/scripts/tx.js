import b64 from "base64-js"
import * as cbor from "../assets/js/cbor.js"

// See https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
export const encodeBase64 = (str, encoding = 'utf-8') => {
  let bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
  return b64.fromByteArray(bytes)
}

// See https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
export const decodeBase64 = (str, encoding = 'utf-8') => {
  let bytes = b64.toByteArray(str);
  return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes)
}

export const decodeTx = (base64str) => {
  let str = decodeBase64(base64str)
  let idx = str.indexOf('{')
  let json = str.substring(idx)
  return JSON.parse(json)
}

export const decodeST = (base64str) => {
  return cbor.decode(decodeBase64(base64str))
}
