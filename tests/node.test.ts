import { describe, before, after, afterEach } from 'node:test'
import { createSandbox, SinonFakeTimers, SinonStub, useFakeTimers } from 'sinon'
import { expect } from 'expect'
import { itParam } from './it_param'
import * as core from '../src/index'
import { NB_TESTS, testCases } from './support'

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

        itParam('should fetch data and process it ${value}', testCases, async () => {
            const data = { some: 'data' }
            fetchStub.withArgs(url).resolves({ ok: true, json: () => Promise.resolve(data) })
            processDataStub.withArgs(data).returns({ processed: 'data' })

            expect(await core.fetchData(url)).toEqual({ processed: 'data' })
            expect(fetchStub.calledOnce).toBeTruthy()
            expect(processDataStub.calledOnce).toBeTruthy()
            expect(consoleErrorStub.notCalled).toBeTruthy()
        })

        itParam(
            'should throw an error if network response is not ok ${value}',
            testCases,
            async () => {
                fetchStub.resolves({ ok: false, statusText: 'Not Found' })

                await expect(core.fetchData('http://example.com')).rejects.toThrowError(
                    new Error('Network response was not ok: Not Found')
                )
                expect(fetchStub.calledOnce).toBeTruthy()
                expect(processDataStub.notCalled).toBeTruthy()
                expect(consoleErrorStub.calledOnce).toBeTruthy()
            }
        )
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

        for (let i = 0; i < NB_TESTS; i++) {
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

    describe('fetchDataMultiples', () => {
        const sandbox = createSandbox()
        let fetch1Stub: SinonStub,
            fetch2Stub: SinonStub,
            fetch3Stub: SinonStub,
            fetch4Stub: SinonStub
        before(() => {
            fetch1Stub = sandbox.stub(core, 'fetch1')
            fetch2Stub = sandbox.stub(core, 'fetch2')
            fetch3Stub = sandbox.stub(core, 'fetch3')
            fetch4Stub = sandbox.stub(core, 'fetch4')
            fetch1Stub.resolves('1')
            fetch2Stub.resolves('2')
            fetch3Stub.resolves('3')
            fetch4Stub.resolves('4')
        })

        afterEach(() => {
            sandbox.resetHistory()
        })
        after(() => {
            sandbox.restore()
        })

        itParam('should fetch data multiples ${value}', testCases, async () => {
            expect(await core.fetchDataMultiples()).toEqual('1,2,3,4')
            expect(fetch1Stub.calledOnce).toBeTruthy()
            expect(fetch2Stub.calledOnce).toBeTruthy()
            expect(fetch3Stub.calledOnce).toBeTruthy()
            expect(fetch4Stub.calledOnce).toBeTruthy()
        })
    })

    describe('fetch1', () => {
        itParam('should return data from fetch1 ${value}', testCases, async () => {
            expect(await core.fetch1()).toEqual('fetch1')
        })
    })

    describe('fetch2', () => {
        itParam('should return data from fetch2 ${value}', testCases, async () => {
            expect(await core.fetch2()).toEqual('fetch2')
        })
    })

    describe('fetch3', () => {
        itParam('should return data from fetch3 ${value}', testCases, async () => {
            expect(await core.fetch3()).toEqual('fetch3')
        })
    })

    describe('fetch4', () => {
        itParam('should return data from fetch4 ${value}', testCases, async () => {
            expect(await core.fetch4()).toEqual('fetch4')
        })
    })
})
