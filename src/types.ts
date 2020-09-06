export type Performance = { playID: string; audience: number }
export type Invoice = {
  customer: string
  performances: Performance[]
}
export type Play = { name: string; type: string }
export type Plays = Record<string, Play>

export type PerformanceData = Performance & {
  play: Play
  amount: number
  volumeCredits: number
}
export type StatementData = {
  customer: string
  performances: PerformanceData[]
  totalAmount: number
  totalVolumeCredits: number
}
