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
  // input verify
  const label = {
    name: '餐廳名稱',
    name_en: '餐廳名稱（英文）',
    category: '類型',
    image: '照片（直連網址）',
    location: '地址',
    postcode: '郵遞區號',
    city: '城市',
    section: '行政區域',
    address: '地址',
    phone: '電話',
    rating: '評分'
  }
  const userInput = req.body
  for (const key in userInput) {
    if (key !== 'description' && (userInput[key].length === 0 || userInput[key] === undefined)) {
      res.render('add', { errorMessage: `請輸入${label[key]}的資料 😌`, userInput })
      return
    }
  }

  Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    postcode: req.body.postcode,
    city: req.body.city,
    section: req.body.section,
    address: req.body.address,
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
        if (req.body[key].length > 0 && req.body[key] !== undefined) {
          targetRestaurant[key] = req.body[key]
        }
      }
      return targetRestaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
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
