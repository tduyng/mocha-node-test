import { it, TestContext } from 'node:test'

type Callback<T> = (value: T) => void | Promise<void>

function run<T>(desc: string, data: T[], callback: Callback<T>): void {
    for (const val of data) {
        it(renderTemplate(desc, val), async (t: TestContext) => {
            try {
                const result = callback(val)
                if (result instanceof Promise) {
                    await result
                }
            } catch (error) {
                t.diagnostic(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        })
    }
}

function renderTemplate<T>(template: string, value: T): string {
    try {
        const result = eval('`' + template + '`')
        return typeof result === 'string' ? result : template
    } catch {
        return template
    }
}

function itParam<T>(desc: string, data: T[], callback: Callback<T>): void {
    run(desc, data, callback)
}

export { itParam }
