import '@testing-library/jest-dom'
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function () {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  },
  configurable: true,
})
