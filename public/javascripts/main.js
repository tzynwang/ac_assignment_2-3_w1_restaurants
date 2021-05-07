const elementObjects = {
  searchForm: document.querySelector('#searchForm'),
  searchFormInput: document.querySelector('input[name="keyword"]')
}

const controller = {
  inputVerify (inputs) {
    return inputs.trim() !== ''
  }
}

elementObjects.searchForm.addEventListener('submit', (event) => {
  const userInput = elementObjects.searchFormInput.value
  if (!controller.inputVerify(userInput)) {
    event.preventDefault()
    window.alert('請至少輸入一個英文或中文字 🥺')
  }
})
