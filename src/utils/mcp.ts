// mcp_frontend/src/utils/mcp.ts

import axios from 'axios';
// Import JSON5 and Ajv
import * as JSON5 from 'json5';
import Ajv, { JSONSchemaType } from 'ajv';

interface McpResponse {
  message?: string;
}

export async function callMcpTool(query: string): Promise<McpResponse> {
  const MCP_SERVER_URL = 'http://127.0.0.1:8000';

  const requestPayload = {
    jsonrpc: '2.0',
    method: 'generate_with_tools',
    params: {
      messages: [{ role: 'user', content: query }],
      tools: [
        {
          name: 'search_and_store',
          description: 'Searches for data and stores it.',
          input_schema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'The search query.' },
              numResults: { type: 'number', description: 'Number of results to retrieve.' },
            },
            required: ['query'],
          },
        },
      ],
      options: {},
    },
    id: Date.now(),
  };

  try {
    const response = await axios.post(MCP_SERVER_URL, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.error) {
      console.error('MCP server returned error:', response.data.error);
      throw new Error(response.data.error.message);
    }

    if (!response.data.result) {
      throw new Error('No result returned from MCP server.');
    }

    // Use JSON5 and Ajv to parse and validate the MCP response
    const ajv = new Ajv();
    const mcpResponseSchema = {
      type: 'object',
      properties: {
        message: { type: 'string', nullable: true },
      },
      required: [],
      additionalProperties: false,
    } as const;

    const validate = ajv.compile(mcpResponseSchema);

    // The response data might not be standard JSON
    const responseData = response.data.result;
    const responseJson = JSON5.stringify(responseData);
    const parsedResponse = JSON5.parse(responseJson);

    const valid = validate(parsedResponse);
    if (!valid) {
      console.error('Invalid MCP response format:', validate.errors);
      throw new Error('Invalid response format from MCP server.');
    }

    return parsedResponse as McpResponse;
  } catch (error: any) {
    if (error.response) {
      console.error('MCP server error:', error.response.data);
    } else if (error.request) {
      console.error('No response from MCP server.');
    } else {
      console.error('Error in MCP request setup:', error.message);
    }
    throw error;
  }
}