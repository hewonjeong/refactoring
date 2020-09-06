import {
  Invoice,
  Play,
  Plays,
  Performance,
  PerformanceData,
  StatementData,
} from '../types'

export default function createStatementData(
  invoice: Invoice,
  plays: Plays
): StatementData {
  const result: any = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result

  function enrichPerformance(performance: Performance) {
    const calculator = new PerformanceCalculator(
      performance,
      playFor(performance)
    )
    const result = Object.assign({} as PerformanceData, performance)
    result.play = calculator.play
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

class PerformanceCalculator {
  performance: Performance
  play: Play

  constructor(performance: Performance, play: Play) {
    this.performance = performance
    this.play = play
  }
}
