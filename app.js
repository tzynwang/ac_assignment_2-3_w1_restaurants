const express = require('express')
const app = express()
const port = 3000

const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const helpers = handlebarsHelpers()
const bodyParser = require('body-parser')

app.engine('handlebars', expressHandlebars({ helpers: helpers, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const restaurantList = require('./restaurant.json')

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const id = Number(req.params.id)
  const targetRestaurant = restaurantList.results.find((restaurant) => {
    return restaurant.id === id
  })
  res.render('show', { restaurant: targetRestaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const searchResult = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  let matchResult
  searchResult.length === 0
    ? matchResult = true
    : matchResult = false
  const keywordSpan = `<span>${keyword}</span>`
  res.render('index', { keyword: keywordSpan, matchResult: matchResult, restaurants: searchResult })
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
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
  restaurantList.results.forEach((restaurant, index) => {
    if (restaurant.id === id) {
      restaurantList.results.splice(index, 1)
    }
  })
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
