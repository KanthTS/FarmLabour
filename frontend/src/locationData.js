// Simple hierarchical location data: state -> city -> mandal -> village -> zipcode
// NOTE: This is a small sample (mainly AP/TS). Extend as needed.

export const locationData = {
  AP: {
    label: 'Andhra Pradesh',
    cities: {
      'Anantapur': {
        mandals: {
          'Anantapur': {
            villages: {
              'Anantapur Rural': '515001',
              'Kakkalapalle': '515002'
            }
          },
          'Dharmavaram': {
            villages: {
              'Dharmavaram Rural': '515671'
            }
          }
        }
      },
      'Guntur': {
        mandals: {
          'Guntur': {
            villages: {
              'Guntur Rural': '522001',
              'Nallapadu': '522005'
            }
          }
        }
      }
    }
  },
  TS: {
    label: 'Telangana',
    cities: {
      'Hyderabad': {
        mandals: {
          'Shaikpet': {
            villages: {
              'Manikonda': '500089',
              'Puppalguda': '500075'
            }
          },
          'Serilingampally': {
            villages: {
              'Madhapur': '500081',
              'Gachibowli': '500032'
            }
          }
        }
      },
      'Warangal': {
        mandals: {
          'Hanamkonda': {
            villages: {
              'Hanamkonda Rural': '506001'
            }
          }
        }
      }
    }
  }
}

