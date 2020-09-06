import { statement } from '.'
import invoices from './invoices.json'
import plays from './plays.json'
describe('statement', () => {
  it('returns output of statement', () => {
    const expected = `청구 내역 (고객명: BigCo)
  Hamlet: $650.00 (55석)
  As You Like It: $580.00 (35석)
  Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`

    const result = statement(invoices[0], plays)
    expect(result).toBe(expected)
  })
})
