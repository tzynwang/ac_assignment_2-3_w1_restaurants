const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// add restaurant (view)
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(allRestaurants => {
      const categories = []
      allRestaurants.forEach(restaurant => {
        if (!categories.includes(restaurant.category)) {
          categories.push(restaurant.category)
        }
      })
      res.render('add', { categories })
    })
    .catch(error => console.log(error))
})

// add restaurant (save)
router.post('/', (req, res) => {
  Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: `http://maps.google.com/maps?z=12&t=m&q=${req.body.name}`,
    rating: req.body.rating,
    description: req.body.description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// information edit page (view)
router.get('/:id/edit', (req, res) => {
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

// information edit page (save)
router.put('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(targetRestaurant => {
      for (const key in req.body) {
        if (req.body[key].length > 0) {
          targetRestaurant[key] = req.body[key]
        }
      }
      return targetRestaurant.save()
    })
    .then(() => res.redirect('/'))
})

// delete restaurant
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(targetRestaurant => targetRestaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
