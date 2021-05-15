const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connects')
  Restaurant.create({
    name: '測試餐廳',
    name_en: 'test data',
    category: 'test category',
    image: 'https://picsum.photos/id/1060/600/480',
    location: 'Far far galaxy',
    phone: '666 11223344',
    google_map: 'https://google.com',
    rating: '777',
    description: 'Just a test data'
  })
  console.log('data generation done')
})
