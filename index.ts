type Performance = { playID: string; audience: number }
type Invoice = {
  customer: string
  performances: Performance[]
}
type Play = { name: string; type: string }
type Plays = Record<string, Play>

type PerformanceData = Performance & {
  play: Play
  amount: number
  volumeCredits: number
}
type StatementData = {
  customer: string
  performances: PerformanceData[]
  totalAmount: number
  totalVolumeCredits: number
}

export function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice: Invoice, plays: Plays): StatementData {
  const statementData: any = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData

  function enrichPerformance(performance: Performance) {
    const result = Object.assign({} as PerformanceData, performance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  function playFor(performance: Performance) {
    return plays[performance.playID]
  }

  function amountFor(performance: PerformanceData) {
    let result = 0
    switch (performance.play.type) {
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
        throw new Error(`알 수 없는 장르: ${performance.play.type}`)
    }
    return result
  }

  function totalAmount(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }

  function volumeCreditsFor(performance: PerformanceData) {
    let result = 0
    result += Math.max(performance.audience - 30, 0)

    if ('comedy' === performance.play.type) {
      result += Math.floor(performance.audience / 5)
    }

    return result
  }
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
