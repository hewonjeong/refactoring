import {
  Invoice,
  Play,
  Plays,
  Performance,
  PerformanceData,
  StatementData,
} from './types'

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
    const { play, amount, volumeCredits } = createPerformanceCalculator(
      performance,
      playFor(performance)
    )
    return { ...performance, play, amount, volumeCredits }
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

function createPerformanceCalculator(performance: Performance, play: Play) {
  switch (play.type) {
    case 'tragedy':
      return new TragedyCalculator(performance, play)
    case 'comedy':
      return new ComedyCalculator(performance, play)
    default:
      throw new Error(`unknown type: ${play.type}`)
  }
}

class PerformanceCalculator {
  performance: Performance
  play: Play

  constructor(performance: Performance, play: Play) {
    this.performance = performance
    this.play = play
  }

  get amount(): number {
    throw new Error('subclass responsibility')
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience
    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}
