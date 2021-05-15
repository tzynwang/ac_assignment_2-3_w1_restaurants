const express = require('express')
const app = express()
const port = 3000

const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const restaurantList = require('./restaurant.json')
const helpers = handlebarsHelpers()
const Restaurant = require('./models/restaurant')

app.engine('handlebars', expressHandlebars({ helpers: helpers, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

require('./config/mongoose')

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
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
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = Number(req.params.id)
  const targetRestaurant = restaurantList.results.find((restaurant) => restaurant.id === id)
  const categories = []
  restaurantList.results.forEach(restaurant => {
    if (!categories.includes(restaurant.category)) {
      categories.push(restaurant.category)
    }
  })
  res.render('edit', { restaurant: targetRestaurant, categories })
})

app.put('/restaurants/:id/edit', (req, res) => {
  const id = Number(req.params.id)
  const targetRestaurant = restaurantList.results.find((restaurant) => restaurant.id === id)
  // 遍歷req.body物件中所有的內容
  for (const key in req.body) {
    if (req.body[key].length > 0) {
      targetRestaurant[key] = req.body[key]
    }
  }
  res.redirect('/')
})

app.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const toDeleteIndex = restaurantList.results.findIndex(restaurant => restaurant.id === id)
  restaurantList.results.splice(toDeleteIndex, 1)
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
