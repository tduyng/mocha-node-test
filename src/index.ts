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
