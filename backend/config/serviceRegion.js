/** Service area: Mantralayam mandal only (Kurnool, Andhra Pradesh). */

const SERVICE_STATE_CODE = 'AP'
const SERVICE_DISTRICT = 'Kurnool'
const SERVICE_MANDAL = 'Mantralayam'

const MANTRALAYAM_VILLAGES = [
  'Mantralayam (Town)',
  'Basapuram',
  'Budur',
  'Chetnihalli',
  'Chilakaladona',
  'Dibbanadoddi',
  'Kachapuram',
  'Kaggallu',
  'Kalludevakunta',
  'Madhavaram',
  'Malapalle',
  'Manchala',
  'Narayanapuram',
  'Paramandoddi',
  'Rachumarri',
  'Rampuram',
  'Singarajanahalli',
  'Sowla Halli',
  'Sugur',
  'Sunkeswari',
  'Vagaruru',
  'Ibrahimpuram',
  'N.Khairavadi',
]

const SERVICE_DISTRICTS = [SERVICE_DISTRICT]

function isAllowedJobLocation(body) {
  const state = body.state || body.location
  if (state && state !== SERVICE_STATE_CODE && state !== 'Andhra Pradesh') {
    return { ok: false, message: 'Jobs can only be posted in Andhra Pradesh.' }
  }

  const district = body.city
  const mandal = body.mandal
  const village = body.village

  if (district !== SERVICE_DISTRICT) {
    return {
      ok: false,
      message: 'Jobs can only be posted in Kurnool district (Mantralayam mandal).',
    }
  }

  if (mandal !== SERVICE_MANDAL) {
    return {
      ok: false,
      message: 'Jobs can only be posted in Mantralayam mandal.',
    }
  }

  if (!village || !MANTRALAYAM_VILLAGES.includes(village)) {
    return {
      ok: false,
      message: 'Select a valid village under Mantralayam mandal.',
    }
  }

  return { ok: true }
}

const MANTRALAYAM_VILLAGE_NAMES = MANTRALAYAM_VILLAGES

function isMantralayamLocation(location) {
  if (!location || typeof location !== 'string') return false
  const loc = location.toLowerCase()
  if (loc.includes('mantralayam')) return true
  return MANTRALAYAM_VILLAGE_NAMES.some((v) => loc.includes(v.toLowerCase()))
}

module.exports = {
  SERVICE_STATE_CODE,
  SERVICE_DISTRICTS,
  SERVICE_DISTRICT,
  SERVICE_MANDAL,
  MANTRALAYAM_VILLAGES: MANTRALAYAM_VILLAGE_NAMES,
  isMantralayamLocation,
  isAllowedJobLocation,
}
