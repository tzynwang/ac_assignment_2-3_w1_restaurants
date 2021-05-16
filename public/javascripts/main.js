const elementObjects = {
  searchForm: document.querySelector('#searchForm'),
  searchFormInput: document.querySelector('input[name="keyword"]'),
  sortTypeSelection: document.querySelector('#sort'),
  restaurantList: document.querySelector('.restaurant-list')
}

const view = {
  displaySortResults (responseData) {
    elementObjects.restaurantList.innerHTML = ''
    if (responseData.errorMessage !== undefined) {
      elementObjects.restaurantList.innerHTML += `
      <div class="mb-5">
        <p>${responseData.errorMessage}</p>
      </div>
      `
      return
    }
    responseData.forEach(restaurant => {
      elementObjects.restaurantList.innerHTML += `
    <div class="col-10 col-md-4 mx-auto hover-transform">
        <a href="/restaurants/${restaurant._id}" class="text-secondary">
          </a><div class="card mb-3"><a href="/restaurants/${restaurant._id}" class="text-secondary">
            <img class="card-img-top" src="${restaurant.image}" alt="${restaurant.name_en}">
            </a><div class="card-body p-3"><a href="/restaurants/${restaurant._id}" class="text-secondary">
              <h3 class="h6 card-title mb-1">${restaurant.name}</h3>

              <div class="restaurant-category mb-1">
                <i class="fas fa-utensils pr-2"></i> ${restaurant.category}
              </div>

              </a><div class="badge-and-operation d-flex justify-content-between"><a href="/restaurants/${restaurant._id}" class="text-secondary">
                <span class="badge badge-pill badge-danger font-weight-normal">
                  ${restaurant.rating} ✭
                </span>
                </a><div class="operation-buttons"><a href="/restaurants/${restaurant._id}" class="text-secondary">
                  </a><div><a href="/restaurants/${restaurant._id}" class="text-secondary">
                    </a><a href="/restaurants/${restaurant._id}/edit" class="btn btn-outline-success btn-sm">
                      <span class="d-md-none">編輯</span>
                      <i class="fas fa-edit"></i></a>
                  </div>
                  <button type="button" class="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target="#deleteConfirmation${restaurant._id}">
                    <span class="d-md-none">刪除</span>
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>

      </div>
      <div class="modal fade" id="deleteConfirmation${restaurant._id}" tabindex="-1" aria-labelledby="modal${restaurant._id}"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <p class="h5 modal-title" id="modal${restaurant._id}">刪除確認</p>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              確定要刪除「${restaurant.name}」嗎？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">算了</button>
              <form action="/restaurants/${restaurant._id}/?_method=DELETE" method="POST">
                <button type="submit" class="btn btn-outline-danger">確認刪除</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      `
    })
  }
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

elementObjects.sortTypeSelection.addEventListener('change', (event) => {
  const sortType = event.target.value
  axios.post('/sort', { type: sortType })
    .then(response => {
      view.displaySortResults(response.data)
    })
    .catch(error => console.log(error))
})
