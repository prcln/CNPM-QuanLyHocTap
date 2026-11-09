/**
 * Simulated latency and delay utilities.
 * Independent of mock database and business models.
 */

let inMemoryLatency = 400

export const getSimulatedLatency = (): number => {
  return inMemoryLatency
}

export const setSimulatedLatency = (ms: number): void => {
  inMemoryLatency = Math.max(0, ms)
}

export const sleep = (ms = getSimulatedLatency()): Promise<void> => {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

