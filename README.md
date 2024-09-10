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

So far, we have not been able to reproduce the significant performance issues in this simplified project. The benchmarks indicate that the performance difference between `mocha` and `node:test` in this repository is negligible.

(Run on MacBook Pro amd 2019 - 6 cores - 16GB RAM)

### Node.js v22.8.0
- Run for 10000 tests

```bash
❯ npm run benchmark

> mocha-node-test@1.0.0 benchmark
> hyperfine --warmup 1 'yarn test-mocha' 'yarn test-node'

Benchmark 1: yarn test-mocha
  Time (mean ± σ):     12.832 s ±  1.306 s    [User: 10.827 s, System: 1.085 s]
  Range (min … max):   10.386 s … 14.292 s    10 runs

Benchmark 2: yarn test-node
  Time (mean ± σ):     24.628 s ±  9.719 s    [User: 24.773 s, System: 1.795 s]
  Range (min … max):   17.392 s … 47.207 s    10 runs

Summary
  yarn test-mocha ran
    1.92 ± 0.78 times faster than yarn test-node
```