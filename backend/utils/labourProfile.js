const { isMantralayamLocation } = require('../config/serviceRegion')

function calcLabourProfileCompletion(user) {
  if (!user) return 0

  const checks = [
    { weight: 12, ok: Boolean(user.firstName?.trim()) },
    { weight: 8, ok: Boolean(user.lastName?.trim()) },
    { weight: 15, ok: Boolean(user.phoneNo?.trim()) },
    { weight: 22, ok: isMantralayamLocation(user.location) },
    { weight: 13, ok: Boolean(user.profileImageUrl?.trim()) },
    { weight: 12, ok: Array.isArray(user.skills) && user.skills.length > 0 },
    { weight: 10, ok: Number(user.experienceYears) > 0 },
    { weight: 8, ok: Boolean(user.availability?.trim()) },
  ]

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0)
  const earned = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0)
  return Math.min(100, Math.round((earned / totalWeight) * 100))
}

function getProfileCompletionBreakdown(user) {
  return [
    { field: 'First name', complete: Boolean(user?.firstName?.trim()), weight: 12 },
    { field: 'Last name', complete: Boolean(user?.lastName?.trim()), weight: 8 },
    { field: 'Phone number', complete: Boolean(user?.phoneNo?.trim()), weight: 15 },
    {
      field: 'Location (Mantralayam mandal, AP)',
      complete: isMantralayamLocation(user?.location),
      weight: 22,
    },
    { field: 'Profile photo', complete: Boolean(user?.profileImageUrl?.trim()), weight: 13 },
    {
      field: 'Skills',
      complete: Array.isArray(user?.skills) && user.skills.length > 0,
      weight: 12,
    },
    { field: 'Experience (years)', complete: Number(user?.experienceYears) > 0, weight: 10 },
    { field: 'Availability', complete: Boolean(user?.availability?.trim()), weight: 8 },
  ]
}

module.exports = {
  calcLabourProfileCompletion,
  getProfileCompletionBreakdown,
}
