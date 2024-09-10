export const fetchData = async (url: string): Promise<Record<string, unknown>> => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const data = (await response.json()) as Record<string, unknown>
        return processData(data)
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}

export const processData = (data: Record<string, unknown>): Record<string, unknown> => {
    return {
        ...data,
        processedAt: new Date().toISOString(),
        isValid: true,
        additionalInfo: 'info' in data ? `Processed info: ${data['info']}` : 'No info available',
    }
}

export const fetchDataMultiples = async (): Promise<string> => {
    try {
        const responses = await Promise.all([fetch1(), fetch2(), fetch3(), fetch4()])
        return responses.join(',')
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}

export const fetch1 = (): Promise<string> => Promise.resolve('fetch1')
export const fetch2 = (): Promise<string> => Promise.resolve('fetch2')
export const fetch3 = (): Promise<string> => Promise.resolve('fetch3')
export const fetch4 = (): Promise<string> => Promise.resolve('fetch4')
