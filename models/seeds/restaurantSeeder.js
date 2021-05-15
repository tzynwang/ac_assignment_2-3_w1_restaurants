const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')
const rawData = require('../../restaurant.json')

db.once('open', () => {
  console.log('mongodb connects')
  rawData.results.forEach(data => {
    Restaurant.create({
      name: data.name,
      name_en: data.name_en,
      image: data.image,
      location: data.location,
      phone: data.phone,
      google_map: data.google_map,
      rating: data.rating,
      description: data.description
    })
  })
  console.log('data generation done')
})
