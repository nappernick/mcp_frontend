// mcp_frontend/src/pages/mcpAssistant.ts

import { BackroadNodeManager } from '@backroad/backroad';
import { addSidebar } from '../components/sidebar';
import { callMcpTool } from '../utils/mcp';
// Import JSON5 and Ajv
import * as JSON5 from 'json5';
import Ajv, { JSONSchemaType } from 'ajv';

interface Message {
  by: string;
  content: string;
}

interface McpResponse {
  message?: string;
}

export const mcpAssistantPage = async (br: BackroadNodeManager) => {
  addSidebar(br);

  // Title
  br.write({ body: '# MCP Research Assistant\n---' });

  // Get or initialize the conversation history
  const messages = br.getOrDefault('messages', []) as Message[];

  // Display conversation history
  messages.forEach((message) => {
    br.chatMessage({ name: message.by }).write({ body: message.content });
  });

  // Input for the user's query
  const query = br.chatInput({ id: 'userInput', placeholder: 'Type your query here...' });

  if (query) {
    // Add the user's message to the conversation history
    const newMessages: Message[] = [...messages, { by: 'User', content: query }];

    // Save the current state before making async calls
    br.setValue('messages', newMessages);

    // Display loading message
    br.write({ body: 'Processing your query, please wait...' });

    try {
      // Call the MCP server
      const mcpResponse = await callMcpTool(query);

      if (!mcpResponse) {
        throw new Error('Received empty response from MCP server.');
      }

      // Use JSON5 and Ajv to parse and validate the response
      const ajv = new Ajv();
      const responseSchema = {
        type: 'object',
        properties: {
          message: { type: 'string', nullable: true },
        },
        required: [],
        additionalProperties: false,
      };

      const validate = ajv.compile(responseSchema);

      // Assume mcpResponse is a JSON string
      const parsedResponse = JSON5.parse(JSON5.stringify(mcpResponse));

      const valid = validate(parsedResponse);
      if (!valid) {
        console.error('Invalid MCP response format:', validate.errors);
        throw new Error('Invalid response format from MCP server.');
      }

      // Add the MCP server's response to the conversation history
      const responseContent = parsedResponse.message || 'No response content received.';
      newMessages.push({ by: 'MCP Assistant', content: responseContent as string });

      // Update the messages state
      br.setValue('messages', newMessages);
    } catch (error: any) {
      console.error('Error calling MCP server:', error.message);

      newMessages.push({
        by: 'MCP Assistant',
        content: `An error occurred: ${error.message}`,
      });

      // Update the messages state
      br.setValue('messages', newMessages);
    }
  }
};