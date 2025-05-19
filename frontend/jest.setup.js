require('@testing-library/jest-dom')
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function () {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  },
  configurable: true,
})
