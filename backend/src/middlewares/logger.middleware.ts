import { Request, Response, NextFunction } from "express";

interface LatencyRecord {
  duration: number;
  timestamp: number;
  statusCode: number;
  path: string;
}

const latencyHistory: LatencyRecord[] = [];
const MAX_HISTORY = 1000;

let totalRequests = 0;
let totalErrors = 0;

export function getPerformanceMetrics() {
  if (latencyHistory.length === 0) {
    return {
      totalRequests,
      totalErrors,
      p50Ms: 0,
      p90Ms: 0,
      p95Ms: 0,
      p99Ms: 0,
      avgMs: 0,
      minMs: 0,
      maxMs: 0,
      samples: 0,
    };
  }

  const sorted = [...latencyHistory.map((r) => r.duration)].sort((a, b) => a - b);
  const count = sorted.length;

  const getPercentile = (pct: number) => {
    const idx = Math.min(Math.floor((pct / 100) * count), count - 1);
    return sorted[idx];
  };

  const sum = sorted.reduce((acc, v) => acc + v, 0);

  return {
    totalRequests,
    totalErrors,
    p50Ms: getPercentile(50),
    p90Ms: getPercentile(90),
    p95Ms: getPercentile(95),
    p99Ms: getPercentile(99),
    avgMs: Math.round((sum / count) * 10) / 10,
    minMs: sorted[0],
    maxMs: sorted[count - 1],
    samples: count,
  };
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;
  totalRequests++;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();

    if (statusCode >= 400) {
      totalErrors++;
    }

    // Record sample (capped at MAX_HISTORY)
    latencyHistory.push({
      duration,
      timestamp: Date.now(),
      statusCode,
      path: originalUrl,
    });
    if (latencyHistory.length > MAX_HISTORY) {
      latencyHistory.shift();
    }

    const color =
      statusCode >= 500
        ? "\x1b[31m" // red
        : statusCode >= 400
        ? "\x1b[33m" // yellow
        : statusCode >= 300
        ? "\x1b[36m" // cyan
        : "\x1b[32m"; // green
    const reset = "\x1b[0m";

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms`
    );
  });

  next();
}
