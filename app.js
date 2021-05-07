const express = require('express')
const app = express()
const port = 3000

const expressHandlebars = require('express-handlebars')
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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
  res.render('index', { restaurants: searchResult })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
