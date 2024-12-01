import { Schema, model } from 'mongoose'


const monthlyReportSchema = new Schema({
  totals: {
    type: 'object',
    required: true,
    properties: {
      income: {
        type: 'number',
        required: true
      },
      expense: {
        type: 'number',
        required: true
      },
      expenseCategories: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            required: true
          },
          total: {
            type: 'number',
            required: true
          }
        }
      },
    }
  },
  compare: {
    type: 'object',
    required: true,
    properties: {
      prevMonth: {
        type: 'object',
        properties: {
          income: {
            type: 'object',
            properties: {
              amount: {
                type: 'number'
              },
              percentage: {
                type: 'number'
              }
            }
          },
          expense: {
            type: 'object',
            properties: {
              amount: {
                type: 'number'
              },
              percentage: {
                type: 'number'
              }
            }
          },
          surplus: {
            type: 'object',
            properties: {
              amount: {
                type: 'number'
              },
              percentage: {
                type: 'number'
              }
            }
          }
        }
      },
      yearOverYear: {
        type: 'object',
        properties: {
          income: {
            type: 'number'
          },
          expense: {
            type: 'number'
          },
          surplus: {
            type: 'number'
          }
        }
      }
    }
  },
  userId: {
    type: 'string',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now
  }
})

export const Report = model('Report', monthlyReportSchema)