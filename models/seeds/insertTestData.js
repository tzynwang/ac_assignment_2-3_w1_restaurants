const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connect')
  Restaurant.create({
    name: '宇宙巴克',
    name_en: 'Spacebucks',
    category: '宇宙餐廳',
    image: 'https://picsum.photos/id/1060/600/480',
    postcode: 817,
    city: '南海諸島',
    section: '東沙',
    address: '閃爍星光的巷子中',
    phone: '666 11223344',
    google_map: 'https://google.com',
    rating: '777',
    description: 'Just a test data'
  })
  console.log('data generation done')
})
