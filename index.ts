type Performance = { playID: string; audience: number }
type Invoice = {
  customer: string
  performances: Performance[]
}
type Play = { name: string; type: string }
type Plays = Record<string, Play>

export function statement(invoice: Invoice, plays: Plays) {
  const statementData: any = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  return renderPlainText(statementData, plays)

  function enrichPerformance(performance: Performance) {
    const result = Object.assign({}, performance)
    return result
  }
}

function renderPlainText(data: any, plays: Plays) {
  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (let perf of data.performances) {
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience }석)\n` // prettier-ignore
  }

  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredits()}점\n`

  return result

  function totalAmount() {
    let result = 0
    for (let perf of data.performances) {
      result += amountFor(perf)
    }
    return result
  }

  function totalVolumeCredits() {
    let result = 0
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf)
    }
    return result
  }

  function usd(number: number) {
    return new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(number / 100)
  }

  function volumeCreditsFor(performance: Performance) {
    let result = 0
    result += Math.max(performance.audience - 30, 0)

    if ('comedy' === playFor(performance).type) {
      result += Math.floor(performance.audience / 5)
    }

    return result
  }

  function playFor(performance: Performance) {
    return plays[performance.playID]
  }

  function amountFor(performance: Performance) {
    let result = 0
    switch (playFor(performance).type) {
      case 'tragedy':
        result = 40000
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30)
        }
        break

      case 'comedy':
        result = 30000
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20)
        }
        result += 300 * performance.audience
        break

      default:
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`)
    }

    return result
  }
}
