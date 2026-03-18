require('dotenv').config()

const base = process.env.SEED_BASE || 'http://127.0.0.1:4000'

async function request(path, method, body, token) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`${method} ${path} ${res.status}: ${txt}`)
  }
  return res.json()
}

async function main() {
  const farmerPayloads = [
    { email: 'farmer1@example.com', password: 'Farmer@123', role: 'farmer', firstName: 'Ravi', lastName: 'Kumar', location: 'Nizamabad' },
    { email: 'farmer2@example.com', password: 'Farmer@123', role: 'farmer', firstName: 'Leela', lastName: 'Devi', location: 'Warangal' },
  ]
  const labourPayloads = [
    { email: 'labour1@example.com', password: 'Labour@123', role: 'labour', firstName: 'Sita', location: 'Nizamabad', skills: ['Harvesting', 'Weeding'], experienceYears: 3 },
    { email: 'labour2@example.com', password: 'Labour@123', role: 'labour', firstName: 'Arun', location: 'Karimnagar', skills: ['Irrigation'], experienceYears: 2 },
  ]

  const farmers = []
  for (const f of farmerPayloads) {
    try {
      const r = await request('/auth/register', 'POST', f)
      farmers.push({ token: r.token, user: r.user })
    } catch (e) {
      // user may exist; try login
      const r = await request('/auth/login', 'POST', { email: f.email, password: f.password })
      farmers.push({ token: r.token, user: r.user })
    }
  }

  const labourers = []
  for (const l of labourPayloads) {
    try {
      const r = await request('/auth/register', 'POST', l)
      labourers.push({ token: r.token, user: r.user })
    } catch (e) {
      const r = await request('/auth/login', 'POST', { email: l.email, password: l.password })
      labourers.push({ token: r.token, user: r.user })
    }
  }

  const now = new Date()
  const start = new Date(now.getTime() + 3 * 24 * 3600 * 1000).toISOString()
  const end = new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString()

  const jobsToCreate = [
    {
      title: 'Harvest paddy field',
      content: 'Need help harvesting paddy on 3 acres.',
      fieldSize: '3 acres',
      wages: 550,
      startDate: start,
      endDate: end,
      location: 'Nizamabad',
      zipcode: 503001,
      Timings: '6am-2pm',
      reviewData: { rating: 5, comment: 'Reliable team' },
    },
    {
      title: 'Drip irrigation setup',
      content: 'Install drip lines for cotton field.',
      fieldSize: '2 acres',
      wages: 650,
      startDate: start,
      endDate: end,
      location: 'Warangal',
      zipcode: 506002,
      Timings: '7am-3pm',
      reviewData: { rating: 5, comment: 'Skilled workers preferred' },
    },
  ]

  const createdJobs = []
  for (let i = 0; i < jobsToCreate.length; i++) {
    const farmer = farmers[i % farmers.length]
    const body = {
      ...jobsToCreate[i],
      jobId: `${Date.now()}${i}`,
      DateOfCreation: now.toISOString(),
      DateOfModification: now.toISOString(),
      isJobActive: true,
    }
    const res = await request('/jobs', 'POST', body, farmer.token)
    createdJobs.push(res.payload)
  }

  // Apply labourers to first job
  const targetJob = createdJobs[0]
  for (let i = 0; i < labourers.length; i++) {
    const lab = labourers[i]
    const appBody = {
      applicationId: `${Date.now()}${i}`,
      fullname: lab.user.firstName,
      jobId: targetJob._id,
      experience: 'Field work',
      workinghours: 'full-time',
      skills: (lab.user.skills || ['General']).join(', '),
      location: lab.user.location || 'Nizamabad',
    }
    await request('/labour-api/application', 'POST', appBody, lab.token)
  }

  console.log('Seed complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
