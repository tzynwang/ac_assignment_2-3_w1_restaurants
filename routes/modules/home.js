const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  return Restaurant.find()
    .lean()
    .then(allRestaurants => {
      const searchResults = allRestaurants.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
      })
      let noMatchResult
      searchResults.length === 0
        ? noMatchResult = true
        : noMatchResult = false
      const keywordSpan = `<span>${keyword}</span>`
      res.render('index', { keyword: keywordSpan, noMatchResult, restaurants: searchResults })
    })
    .catch(error => console.log(error))
})

router.post('/sort', (req, res) => {
  const sortType = req.body.type
  let sortColumn
  switch (sortType) {
    case 'asc':
      sortColumn = { name: 'asc' }
      break
    case 'desc':
      sortColumn = { name: 'desc' }
      break
    case 'category':
      sortColumn = { category: 'asc' }
      break
    case 'postcode':
      sortColumn = { postcode: 'asc' }
      break
    default:
      res.send({ errorMessage: '唔……排序的類型好像有點問題，請透過下拉選單來排序餐廳卡片唷 😌' })
      return
  }
  Restaurant.find()
    .lean()
    .sort(sortColumn)
    .then(results => res.send(results))
    .catch(error => console.log(error))
})

module.exports = router
