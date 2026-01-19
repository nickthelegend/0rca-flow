'use server';

/**
 * Manually fetches tools from an MCP server using raw JSON-RPC.
 */
export async function fetchMcpTools(
    url: string,
    transportType: 'http' | 'sse' = 'http',
    headers?: Record<string, string>
) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/event-stream",
                ...headers,
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "tools/list",
                params: {},
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText.slice(0, 100)}`);
        }

        const responseText = await response.text();
        let data: any;

        // Try SSE parsing
        const lines = responseText.split('\n');
        const dataLines = lines.filter(line => line.trim().startsWith('data:'));

        if (dataLines.length > 0) {
            for (const line of dataLines) {
                try {
                    const jsonStr = line.substring(line.indexOf('data:') + 5).trim();
                    if (jsonStr) {
                        data = JSON.parse(jsonStr);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        if (!data) {
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error("Failed to parse response as JSON or SSE.");
            }
        }

        if (data.error) {
            throw new Error(data.error.message || "MCP Server Error");
        }

        if (!data.result || !data.result.tools) {
            throw new Error("Invalid MCP response: 'result.tools' not found");
        }

        const tools = data.result.tools.map((tool: any) => ({
            name: tool.name,
            description: tool.description || '',
            inputSchema: tool.inputSchema || tool.parameters || {}
        }));

        return {
            success: true,
            tools: tools
        };
    } catch (error: any) {
        console.error(`[MCP Manual Fetch Error] ${error.message}`);
        return {
            success: false,
            error: error.message || "Failed to reach MCP server."
        };
    }
}
