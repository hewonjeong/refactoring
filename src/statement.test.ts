import statement from './statement'
import invoices from './invoices.json'
import plays from './plays.json'

describe('statement', () => {
  it('returns output of statement', () => {
    const expected = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`

    const result = statement(invoices[0], plays)
    expect(result).toBe(expected)
  })
})
