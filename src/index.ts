import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize the server with some personality
const server = new McpServer({
    name: "IncidentResponsePro",
    version: "1.2.0",
});

// Fake data because real production data is scary
const MOCK_ALERTS = [
    { id: "ALRT-001", service: "auth-api", status: "CRITICAL", message: "Memory leak detected" },
    { id: "ALRT-002", service: "payment-gateway", status: "WARNING", message: "Latency > 500ms" },
];

// Register our resource
server.registerResource(
  "active-alerts",
  "resource://incidents/active",
  { 
    description: "Provides a list of currently active system alerts", 
    mimeType: "application/json" 
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify(MOCK_ALERTS, null, 2),
    }],
  })
);

// Register the tool
server.registerTool(
  "resolve_incident",
  {
    title: "Service restart",
    description: "The name of the service to restart (e.g., 'auth-api')",
    inputSchema: {
      serviceName: z.string().describe("The name of the service to restart (e.g., 'auth-api')"),
      reason: z.string().describe("A brief explanation for the audit log of why this fix is being applied"),
    },
  },
  async ({ serviceName, reason }) => {
    // Pro-tip: Use console.error for logs. stdout is for the JSON-RPC protocol!
    console.error(`[AUDIT] AI is attempting to fix ${serviceName}. Reason: ${reason}`);
    
    // Simulating a realistic 80% success rate
    const success = Math.random() > 0.2; 

    if (success) {
      return {
        content: [{ type: "text", text: `SUCCESS: ${serviceName} has been gracefully restarted.` }]
      };
    }
    
    return {
      content: [{ type: "text", text: `FAILURE: Could not restart ${serviceName}. Please check logs manually.` }],
      isError: true
    };
  }
);