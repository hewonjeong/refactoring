import createStatementData from './createStatementData'
import { Invoice, Plays, StatementData } from '../types'

export default function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays))
}

function renderPlainText(data: StatementData) {
  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n` // prettier-ignore
  }

  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`

  return result

  function usd(number: number) {
    return new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(number / 100)
  }
}
