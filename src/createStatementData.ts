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
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function playFor(performance: Performance) {
    return plays[performance.playID]
  }

  function totalAmount(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
}

class PerformanceCalculator {
  performance: Performance
  play: Play

  constructor(performance: Performance, play: Play) {
    this.performance = performance
    this.play = play
  }

  get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break

      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break

      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`)
    }
    return result
  }

  get volumeCredits() {
    let result = 0
    result += Math.max(this.performance.audience - 30, 0)

    if ('comedy' === this.play.type) {
      result += Math.floor(this.performance.audience / 5)
    }

    return result
  }
}
