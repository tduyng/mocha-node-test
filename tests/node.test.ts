import { describe, before, after, afterEach } from 'node:test'
import { createSandbox, SinonFakeTimers, SinonStub, useFakeTimers } from 'sinon'
import { expect } from 'expect'
import { itParam } from './it_param'
import * as core from '../src/index'

describe('src > index', () => {
    describe('fetchData', () => {
        const sandbox = createSandbox()
        let fetchStub: SinonStub, consoleErrorStub: SinonStub, processDataStub: SinonStub
        before(() => {
            fetchStub = sandbox.stub(global, 'fetch')
            consoleErrorStub = sandbox.stub(console, 'error')
            processDataStub = sandbox.stub(core, 'processData')
        })
        afterEach(() => {
            sandbox.reset()
        })
        after(() => {
            sandbox.restore()
        })

        const url = 'http://example.com'
        const testCases = Array.from({ length: 100 })

        itParam('should fetch data and process it', testCases, async () => {
            const data = { some: 'data' }
            fetchStub.withArgs(url).resolves({ ok: true, json: () => Promise.resolve(data) })
            processDataStub.withArgs(data).returns({ processed: 'data' })

            expect(await core.fetchData(url)).toEqual({ processed: 'data' })
            expect(fetchStub.calledOnce).toBeTruthy()
            expect(processDataStub.calledOnce).toBeTruthy()
            expect(consoleErrorStub.notCalled).toBeTruthy()
        })

        itParam('should throw an error if network response is not ok', testCases, async () => {
            fetchStub.resolves({ ok: false, statusText: 'Not Found' })

            await expect(core.fetchData('http://example.com')).rejects.toThrowError(
                new Error('Network response was not ok: Not Found')
            )
            expect(fetchStub.calledOnce).toBeTruthy()
            expect(processDataStub.notCalled).toBeTruthy()
            expect(consoleErrorStub.calledOnce).toBeTruthy()
        })
    })

    describe('processData', () => {
        let clock: SinonFakeTimers

        before(() => {
            clock = useFakeTimers(date)
        })

        after(() => {
            clock.restore()
        })

        const date = new Date('2024-08-08T00:00:00Z')
        const testCases: ({ input: Record<string, unknown> } & Record<string, unknown>)[] = []

        for (let i = 0; i < 100; i++) {
            testCases.push({
                description: `should return processed data with additional info - case ${i + 1}`,
                input: { info: `some info ${i + 1}` },
                expected: {
                    info: `some info ${i + 1}`,
                    processedAt: date.toISOString(),
                    isValid: true,
                    additionalInfo: `Processed info: some info ${i + 1}`,
                },
            })
            testCases.push({
                description: `should return processed data without additional info - case ${i + 1}`,
                input: { other: `data ${i + 1}` },
                expected: {
                    other: `data ${i + 1}`,
                    processedAt: date.toISOString(),
                    isValid: true,
                    additionalInfo: 'No info available',
                },
            })
        }

        itParam('${value.description}', testCases, (testCase) => {
            expect(core.processData(testCase.input)).toEqual(testCase.expected)
        })
    })
})
