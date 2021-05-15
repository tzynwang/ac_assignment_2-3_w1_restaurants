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

module.exports = router
