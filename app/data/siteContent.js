export const menuData = {
  Appetizers: [
    { name: 'Chicken Samosa', price: '$1.99', desc: 'Crispy pastry filled with spiced chicken' },
    { name: 'Veggie Samosa', price: '$1.99', desc: 'Crispy pastry filled with spiced vegetables' },
    { name: 'Tok-Jhal Chotpoti', price: '$7.99', desc: 'Tangy, spicy chickpea stew with potatoes' },
    { name: 'Fuska', price: '$7.99', desc: 'Eight crispy shells filled with spiced potato and chickpeas' },
    { name: 'Haleem', price: '$9.99', desc: 'Slow-cooked stew of meat, lentils, grains, and naan' },
    { name: 'BK Chicken Wrap with Fries', price: '$9.99', desc: 'Soft wrap filled with tasty chicken, paired with golden fries' },
    { name: 'BK Burger with Fries', price: '$9.99', desc: 'Classic juicy burger served with golden crispy fries' },
    { name: 'Petis (Puff Pastry)', price: '$2.99', desc: 'Flaky puff pastry with savory filling' },
    { name: 'Chicken Corn Soup', price: '$5.99', desc: 'Savory broth with shredded chicken, sweet corn, and silky egg' },
  ],
  'Signature Dishes': [
    { name: 'Dhakaiya Kacchi Biryani', price: '$15.99', desc: 'Slow-cooked goat, aromatic basmati, traditional Dhaka spices', star: true },
    { name: 'Chicken Biryani', price: '$11.99', desc: 'Classic spiced rice with tender chicken' },
    { name: 'Beef Tehari', price: '$12.99', desc: 'Basmati rice cooked with mustard oil & tender beef' },
    { name: 'Roast Polao', price: '$12.99', desc: 'Aromatic rice served with Bengali-style chicken roast' },
    { name: 'Butter Chicken', price: '$10.99', desc: 'Creamy tomato gravy with charcoal-grilled chicken' },
    { name: 'Chicken Tikka with Naan', price: '$10.99', desc: 'Marinated chicken grilled with light spices' },
  ],
  'Fish & Vegetables': [
    { name: 'Hilsha Fish Curry with Rice', price: '$13.99', desc: 'Lentil rice served with one hilsha fish' },
    { name: 'Ruhu Fish Curry', price: '$13.99', desc: 'Two ruhu fish in a spiced curry with rice' },
    { name: 'Channa Masala with Naan', price: '$9.99', desc: 'Chickpeas in spiced gravy with naan' },
    { name: 'Chole Batura', price: '$10.99', desc: 'Chickpea curry with fried bread' },
    { name: 'Palak Paneer', price: '$10.99', desc: 'Creamy spinach and paneer' },
    { name: 'Mixed Vegetables with Naan', price: '$7.99', desc: 'Fresh mixed veggies served with warm naan' },
  ],
  'Sweets & Drinks': [
    { name: 'Rasgulla', price: '$10.99/lb' },
    { name: 'Chomchom', price: '$12.99/lb' },
    { name: 'Kalo Jaam', price: '$10.99/lb' },
    { name: 'Gulab Jaam', price: '$10.99/lb' },
    { name: 'Kaccha Golla', price: '$10.99/lb' },
    { name: 'Malai Chop', price: '$11.99/lb' },
    { name: 'Balushai', price: '$11.99/lb' },
    { name: 'Haribhanga', price: '$12.99/lb' },
    { name: 'Rosh Malai', price: '$12.99/lb' },
    { name: 'Mishti Doi', price: '$10.99/lb' },
    { name: 'Jalebi', price: '$9.99/lb' },
    { name: 'Nazia’s Combo', price: '$11.99/lb' },
    { name: 'Mango Lassi', price: '$4.99' },
    { name: 'Coconut Slushie', price: '$3.99' },
    { name: 'Strawberry Slushie', price: '$3.99' },
    { name: 'Malai Tea', price: '$1.99' },
  ],
}

export const categories = Object.keys(menuData)

export const foodImages = [
  {
    src: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    alt: 'Dhakaiya Kacchi Biryani',
    rotate: 'rotate-3',
    caption: 'Kacchi Biryani',
  },
  {
    src: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    alt: 'Bangladeshi curry platter',
    rotate: '-rotate-2',
    caption: 'Home-style Curry',
  },
  {
    src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    alt: 'Handcrafted Mishti Sweets',
    rotate: 'rotate-1',
    caption: 'Fresh Mishti',
  },
]

export const deliveryPlatforms = [
  {
    name: 'DoorDash',
    icon: 'doordash',
    description: 'Biryani, curries, mishti — brought to your door.',
    href: 'https://www.doordash.com/search/store/bangla%20kitchen%20houston/',
    className: 'sm:col-span-7',
  },
  {
    name: 'Uber Eats',
    icon: 'ubereats',
    description: 'Order straight from the Uber Eats app.',
    href: 'https://www.ubereats.com/search?q=Bangla%20Kitchen%20Houston',
    className: 'sm:col-span-5 sm:mt-6',
  },
]

export const contacts = {
  restaurantPhone: '(281) 530-9200',
  restaurantPhoneHref: 'tel:+12815309200',
  cateringPhone: '(346) 970-1417',
  cateringPhoneHref: 'tel:+13469701417',
  secondaryPhone: '(346) 333-8818',
  secondaryPhoneHref: 'tel:+13463338818',
  address: '11102 S Texas 6 Suite 112, Sugarland, TX 77498',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=11102%20S%20Texas%206%20Suite%20112%2C%20Sugar%20Land%2C%20TX%2077498',
  hours: [
    { day: 'Tuesday', time: '11 AM - 9 PM' },
    { day: 'Wednesday', time: '11 AM - 9 PM' },
    { day: 'Thursday', time: '11 AM - 9 PM' },
    { day: 'Friday', time: '11 AM - 9 PM' },
    { day: 'Saturday', time: '11 AM - 9 PM' },
    { day: 'Sunday', time: '11 AM - 8 PM' },
    { day: 'Monday', time: 'Closed' },
  ],
}
