type Performance = { playID: string; audience: number }
type Invoice = {
  customer: string
  performances: Performance[]
}
type Play = { name: string; type: string }
type Plays = Record<string, Play>

export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `청구 내역 (고객명: ${invoice.customer})\n`

  const format = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format

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

  for (let perf of invoice.performances) {
    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0)

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === playFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5)
    }

    // 청구 내역을 출력한다.
    result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience }석)\n` // prettier-ignore
    totalAmount += amountFor(perf)
  }

  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
}
