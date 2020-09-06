import createStatementData from './createStatementData'
import { Invoice, Plays, StatementData } from '../types'

export default function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays))
}


function renderHtml(data: StatementData) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`
  result += '<table>\n'
}

function renderPlainText(data: StatementData) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`

  return result

  function usd(number: number) {
    return new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(number / 100)
  }
}
