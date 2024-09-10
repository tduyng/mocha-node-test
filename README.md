# Reproduce `node:test` performance issues

## Context

This repository aims to reproduce and investigate the performance issues observed when migrating from Mocha to Node.js's built-in node:test module. The project contains a simple set of code and tests to benchmark and compare the execution times between `mocha` and `node:test`.

## Project overview

In our main project, which consists of over 10,000 tests, we encountered significant performance degradation after trying to analyse the migration from `mocha` to `node:test`

Below is a summary of the project's setup and the observed execution times:

Original stack:
- Testing framework: `Mocha`
- Languages & tools: `TypeScript, expect` (standalone from `Jest`), `sinon, mocha-param`
- Execution time: 55 seconds to 1 minute

After migration:
- Testing framework: `node:test`
- Languages & tools: `TypeScript, expect, sinon, it-param` (adapted for `node:test`)
- Execution time: Extremely slow, hangs, and eventually slows down significantly. Execution time extends beyond 20-25 minutes and tests still do not complete.

## Benchmark results

So far, we have not been able to reproduce the significant performance issues in this simplified project. The benchmarks indicate that the performance difference between `mocha` and `node:test` in this repository is not really big like in our project.

(Run on MacBook Pro amd 2019 - 6 cores - 16GB RAM)

### Node.js v22.8.0
- Run for 18000 tests

```bash
❯ npm run benchmark

> mocha-node-test@1.0.0 benchmark
> hyperfine --warmup 1 'npm run test-mocha' 'npm run test-node'

Benchmark 1: npm run test-mocha
  Time (mean ± σ):      7.985 s ±  0.339 s    [User: 6.225 s, System: 0.707 s]
  Range (min … max):    7.437 s …  8.475 s    10 runs

Benchmark 2: npm run test-node
  Time (mean ± σ):     11.461 s ±  1.490 s    [User: 12.721 s, System: 0.843 s]
  Range (min … max):    9.787 s … 14.054 s    10 runs

Summary
  npm run test-mocha ran
    1.44 ± 0.20 times faster than npm run test-node
```