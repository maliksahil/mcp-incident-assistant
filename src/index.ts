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
