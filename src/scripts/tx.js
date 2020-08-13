import b64 from "base64-js"

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
  console.log(`decoding base64 tx str: ${base64str}`)
  let str = decodeBase64(base64str)
  console.log(`decoded tx str: ${str}`)
  let idx = str.indexOf('{')
  let json = str.substring(idx)
  console.log(`json value: ${json}`)
  return JSON.parse(json)
}
