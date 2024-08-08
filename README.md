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

### Node.js v22.6.0
- Run for 400 tests

```bash
$ hyperfine --warmup 20 --runs 10 'yarn test-mocha' 'yarn test-node'
Benchmark 1: yarn test-mocha
  Time (mean ± σ):      1.526 s ±  0.020 s    [User: 1.145 s, System: 0.229 s]
  Range (min … max):    1.502 s …  1.560 s    10 runs

Benchmark 2: yarn test-node
  Time (mean ± σ):      1.618 s ±  0.050 s    [User: 1.377 s, System: 0.243 s]
  Range (min … max):    1.555 s …  1.736 s    10 runs

Summary
  yarn test-mocha ran
    1.06 ± 0.04 times faster than yarn test-node
✨  Done in 96.75s.
```

- Run for 4000 tests
```bash
$ hyperfine --warmup 20 --runs 10 'yarn test-mocha' 'yarn test-node'
Benchmark 1: yarn test-mocha
  Time (mean ± σ):      3.617 s ±  0.432 s    [User: 2.748 s, System: 0.405 s]
  Range (min … max):    3.106 s …  4.502 s    10 runs

Benchmark 2: yarn test-node
  Time (mean ± σ):      3.699 s ±  0.184 s    [User: 3.953 s, System: 0.402 s]
  Range (min … max):    3.541 s …  4.120 s    10 runs

Summary
  yarn test-mocha ran
    1.02 ± 0.13 times faster than yarn test-node
✨  Done in 215.29s.
```

### Node.js v20.16.0
Run for 400 tests
```bash
$ hyperfine --warmup 20 --runs 10 'yarn test-mocha' 'yarn test-node'
Benchmark 1: yarn test-mocha
  Time (mean ± σ):      1.533 s ±  0.026 s    [User: 1.184 s, System: 0.227 s]
  Range (min … max):    1.486 s …  1.578 s    10 runs

Benchmark 2: yarn test-node
  Time (mean ± σ):      1.620 s ±  0.087 s    [User: 1.529 s, System: 0.250 s]
  Range (min … max):    1.515 s …  1.798 s    10 runs

Summary
  yarn test-mocha ran
    1.06 ± 0.06 times faster than yarn test-node
✨  Done in 96.28s.
```


### Node.js v20.13.1
Run for 400 tests
```bash
$ hyperfine --warmup 20 --runs 10 'yarn test-mocha' 'yarn test-node'
Benchmark 1: yarn test-mocha
  Time (mean ± σ):      1.412 s ±  0.018 s    [User: 1.105 s, System: 0.205 s]
  Range (min … max):    1.390 s …  1.440 s    10 runs

Benchmark 2: yarn test-node
  Time (mean ± σ):      1.544 s ±  0.138 s    [User: 1.462 s, System: 0.240 s]
  Range (min … max):    1.424 s …  1.820 s    10 runs

Summary
  yarn test-mocha ran
    1.09 ± 0.10 times faster than yarn test-node
✨  Done in 89.82s.
```