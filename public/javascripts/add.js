const elementObjects = {
  citiesSelect: document.querySelector('.cities'),
  sectionsSelect: document.querySelector('.sections'),
  postCodeDisplay: document.querySelector('.postcode-display')
}

const config = {
  csvPath: '../dataset/postcode.csv'
}

const data = {
  parseResult: ''
}

const view = {
  allCitiesSelect (cities) {
    cities.forEach(city => {
      elementObjects.citiesSelect.innerHTML += `
        <option value="${city}">${city}</option>
        `
    })
  },
  allSectionsSelect (founds) {
    elementObjects.sectionsSelect.innerHTML = '<option selected disabled>區域</option>'
    founds.forEach(element => {
      elementObjects.sectionsSelect.innerHTML += `
        <option value="${element.section}" data-postcode="${element.postcode}">${element.section}</option>
        `
    })
  }
}

const controller = {
  parseCSV (filePath) {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: function (results) {
        // 賦值到外部變數中
        data.parseResult = results.data
        // 取城市資料
        const cities = []
        results.data.forEach(element => {
          if (!cities.includes(element.city)) {
            cities.push(element.city)
          }
        })
        view.allCitiesSelect(cities)
      }
    })
  }
}

controller.parseCSV(config.csvPath)

elementObjects.citiesSelect.addEventListener('change', (event) => {
  const city = event.target.value
  // 篩選出該城市的所有行政區
  const founds = data.parseResult.filter(element => element.city === city)
  view.allSectionsSelect(founds)
})

elementObjects.sectionsSelect.addEventListener('change', (event) => {
  const section = event.target.value
  // 查詢郵遞區號
  const postcode = document.querySelector(`.form-select.sections option[value="${section}"]`).dataset.postcode
  // 顯示郵遞區號於畫面上
  elementObjects.postCodeDisplay.value = postcode
})
