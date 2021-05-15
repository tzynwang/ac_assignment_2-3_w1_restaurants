const express = require('express')
const app = express()
const port = 3000

const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
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
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.find()
    .lean()
    .then(allRestaurants => {
      const targetRestaurant = allRestaurants.find((restaurant) => restaurant._id.toString() === id.toString())
      const categories = []
      allRestaurants.forEach(restaurant => {
        if (!categories.includes(restaurant.category)) {
          categories.push(restaurant.category)
        }
      })
      res.render('edit', { restaurant: targetRestaurant, categories })
    })
    .catch(error => console.log(error))
})

app.put('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(targetRestaurant => {
      console.log(targetRestaurant)
      for (const key in req.body) {
        if (req.body[key].length > 0) {
          targetRestaurant[key] = req.body[key]
        }
      }
      return targetRestaurant.save()
    })
    .then(() => res.redirect('/'))
})

app.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(targetRestaurant => targetRestaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
