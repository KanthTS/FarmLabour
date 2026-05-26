/**
 * Farm Labour service region: Mantralayam mandal (Kurnool, Andhra Pradesh) only.
 */

export const SERVICE_STATE_CODE = 'AP'
export const SERVICE_STATE_LABEL = 'Andhra Pradesh'
export const SERVICE_DISTRICT = 'Kurnool'
export const SERVICE_MANDAL = 'Mantralayam'
export const SERVICE_REGION_NOTE =
  'Jobs are available only in villages under Mantralayam mandal, Kurnool district, Andhra Pradesh.'

/** @deprecated Use SERVICE_DISTRICT — kept for compatibility */
export const SERVICE_DISTRICTS = [SERVICE_DISTRICT]

/** All villages under Mantralayam mandal (PIN 518345 unless noted). */
export const MANTRALAYAM_VILLAGES = {
  'Mantralayam (Town)': '518345',
  Basapuram: '518345',
  Budur: '518345',
  Chetnihalli: '518345',
  Chilakaladona: '518345',
  Dibbanadoddi: '518345',
  Kachapuram: '518345',
  Kaggallu: '518345',
  Kalludevakunta: '518345',
  Madhavaram: '518345',
  Malapalle: '518345',
  Manchala: '518345',
  Narayanapuram: '518345',
  Paramandoddi: '518345',
  Rachumarri: '518345',
  Rampuram: '518345',
  Singarajanahalli: '518345',
  'Sowla Halli': '518345',
  Sugur: '518345',
  Sunkeswari: '518345',
  Vagaruru: '518345',
  Ibrahimpuram: '518345',
  'N.Khairavadi': '518345',
}

export const locationData = {
  AP: {
    label: SERVICE_STATE_LABEL,
    cities: {
      Kurnool: {
        mandals: {
          Mantralayam: {
            villages: MANTRALAYAM_VILLAGES,
          },
        },
      },
    },
  },
}

export function getDistricts() {
  return [SERVICE_DISTRICT]
}

export function getMandals(district) {
  if (district !== SERVICE_DISTRICT) return []
  return [SERVICE_MANDAL]
}

export function getVillages(district, mandal) {
  if (district !== SERVICE_DISTRICT || mandal !== SERVICE_MANDAL) return []
  return Object.keys(MANTRALAYAM_VILLAGES).sort((a, b) => a.localeCompare(b))
}

export function getZipcode(district, mandal, village) {
  if (district !== SERVICE_DISTRICT || mandal !== SERVICE_MANDAL) return ''
  return MANTRALAYAM_VILLAGES[village] || '518345'
}

export function buildLocationLabel({ village, mandal, district }) {
  return [village, mandal || SERVICE_MANDAL, district || SERVICE_DISTRICT, SERVICE_STATE_LABEL]
    .filter(Boolean)
    .join(', ')
}

export function isServiceLocation({ district, mandal, village }) {
  if (district !== SERVICE_DISTRICT || mandal !== SERVICE_MANDAL) return false
  if (village && !MANTRALAYAM_VILLAGES[village]) return false
  return true
}

export function isMantralayamVillage(village) {
  return Boolean(MANTRALAYAM_VILLAGES[village])
}
