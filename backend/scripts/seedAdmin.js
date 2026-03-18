require('dotenv').config()
const bcrypt = require('bcryptjs')
const { connectDB } = require('../config/db')
const User = require('../Models/farmerModel')

async function run() {
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'
  await connectDB(process.env.DBURL)
  const existing = await User.findOne({ email })
  if (existing) {
    console.log('Admin already exists:', email)
    process.exit(0)
  }
  const hashed = await bcrypt.hash(password, 10)
  await User.create({
    email,
    password: hashed,
    role: 'admin',
    firstName: 'Portal',
    lastName: 'Admin',
    profileImageUrl: '',
    phoneNo: '',
    location: '',
  })
  console.log('Admin created:', email)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
