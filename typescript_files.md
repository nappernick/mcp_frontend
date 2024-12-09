# TypeScript Files

## ./index.ts

```typescript
// index.ts

import { run } from '@backroad/backroad';
import { filesPage } from './src/pages/files';
import { sipPage } from './src/pages/sip';
import { mcpAssistantPage } from './src/pages/mcpAssistant';
import { addSidebar } from './src/components/sidebar';

run((br) => {
  // Home Page Content
  br.write({
    body: `# 🛣️ Welcome to Backroad
This is a quick start template to help you get started developing Backroad apps. You can also check out the examples on [Stackblitz](https://stackblitz.com/@sudo-vaibhav/collections/backroad)`,
  });

  br.linkGroup({
    items: [
      {
        label: 'Read the Docs',
        href: 'https://backroad.sudomakes.art/docs/fundamentals/introduction/',
        target: '_blank',
      },
      {
        label: 'Learn Backroad in 3 minutes',
        href: 'https://backroad.sudomakes.art/docs/fundamentals/introduction/',
        target: '_blank',
      },
      {
        label: 'Backroad GitHub',
        href: 'https://github.com/sudomakes/backroad',
        target: '_blank',
      },
      {
        label: 'Backroad Website',
        href: 'https://backroad.sudomakes.art',
        target: '_blank',
      },
      {
        label: 'Examples on Stackblitz',
        href: 'https://stackblitz.com/@sudo-vaibhav/collections/backroad',
        target: '_blank',
      },
    ],
  });

  br.write({
    body: `Backroad presents an unconventional way of **making UI with Node.js with very minimal code**. In the complexity-ridden world of web technology, **Backroad aims to offer a simpler alternative, a road less travelled**

---

Backroad is currently in beta-development phase. If you like the idea behind it and would like to see it develop further, please [consider starring Backroad on GitHub](https://github.com/sudomakes/backroad), or tell your developer friends about it. Thanks for trying Backroad 💖`,
  });

  addSidebar(br);

  // Set up pages
  filesPage(
    br.page({
      path: '/files',
    })
  );

  sipPage(
    br.page({
      path: '/sip',
    })
  );

  mcpAssistantPage(
    br.page({
      path: '/mcp',
    })
  );
});
```


## ./src/components/sidebar.ts

```typescript
// components/sidebar.ts

import { BackroadNodeManager } from '@backroad/backroad';

export const addSidebar = (br: BackroadNodeManager) => {
  br.sidebar({}).linkGroup({
    items: [
      { href: '/', label: 'Home 🏠' },
      { href: '/files', label: 'Files 📂' },
      { href: '/sip', label: 'Dashboard 📊' },
      { href: '/mcp', label: 'MCP Assistant 🤖' }, // Added MCP Assistant link
    ],
  });
};
```


## ./src/main.ts

```typescript
// src/main.ts

import { run } from '@backroad/backroad';
import { filesPage } from './pages/files';
import { sipPage } from './pages/sip';
import { mcpAssistantPage } from './pages/mcpAssistant'; // Importing mcpAssistantPage
import { addSidebar } from './components/sidebar'; // Adjust the path if necessary

run((br) => {
  br.write({
    body: `# 🛣️ Welcome to Backroad
This is a quick start template to help you get started developing Backroad apps. You can also check out the examples on [Stackblitz](https://stackblitz.com/@sudo-vaibhav/collections/backroad)`,
  });

  br.linkGroup({
    items: [
      // Your link items
    ],
  });

  br.write({
    body: `Backroad presents an unconventional way of **making UI with Node.js with very minimal code**. In the complexity-ridden world of web technology, **Backroad aims to offer a simpler alternative, a road less travelled**

---

Backroad is currently in beta-development phase. If you like the idea behind it and would like to see it develop further, please [consider starring Backroad on GitHub](https://github.com/sudomakes/backroad), or tell your developer friends about it. Thanks for trying Backroad 💖`,
  });

  addSidebar(br);

  // Set up pages
  filesPage(
    br.page({
      path: '/files',
    })
  );

  sipPage(
    br.page({
      path: '/sip',
    })
  );

  mcpAssistantPage(
    br.page({
      path: '/mcp', // Register the MCP Assistant page at path '/mcp'
    })
  ); // Include the MCP Assistant page
});
```


## ./src/pages/files.ts

```typescript
// pages/files.ts

import { BackroadNodeManager } from '@backroad/backroad';
import * as Jimp from 'jimp';
import { addSidebar } from '../components/sidebar';

export const filesPage = async (br: BackroadNodeManager) => {
  addSidebar(br);

  const [photo] = br.fileUpload({ label: 'Pick Image' });
  if (photo) {
    br.write({ body: '# Grayscale Image' });
    const image = await Jimp.read(photo.filepath);
    const base64Image = await image.grayscale().getBase64Async(Jimp.MIME_JPEG);
    br.image({ src: base64Image, width: 600 });
  }
};
```


## ./src/pages/mcpAssistant.ts

```typescript
// pages/mcpAssistant.ts

import { BackroadNodeManager } from '@backroad/backroad';
import { addSidebar } from '../components/sidebar';
import { callMcpTool } from '../utils/mcp';


interface Message {
  by: string;
  content: string;
}

interface McpResponse {
  message?: string;
  entities?: any[];
  relations?: any[];
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
    const newMessages: Message[] = [
      ...messages,
      { by: 'User', content: query },
    ];

    // Save the current state before making async calls
    br.setValue('messages', newMessages);

    // Display loading message
    br.write({ body: 'Processing your query, please wait...' });

    // Prepare the request to the MCP server
    try {
      // Send the query to the MCP server via a tool
      const mcpResponse = await callMcpTool(query);

      // Add the MCP server's response to the conversation history
      newMessages.push({ by: 'MCP Server', content: mcpResponse.message || 'Operation completed.' });

      // Update the messages state
      br.setValue('messages', newMessages);

      // Optionally display entities and relations if available
      if (mcpResponse.entities && mcpResponse.entities.length > 0) {
        br.write({ body: '## Extracted Entities' });
        br.table({
          data: mcpResponse.entities,
          columns: {
            id: { header: 'ID' },
            name: { header: 'Name' },
            type: { header: 'Type' },
            observations: { header: 'Observations' },
          },
        });
      }

      if (mcpResponse.relations && mcpResponse.relations.length > 0) {
        br.write({ body: '## Extracted Relations' });
        br.table({
          data: mcpResponse.relations,
          columns: {
            id: { header: 'ID' },
            from: { header: 'From' },
            type: { header: 'Type' },
            to: { header: 'To' },
          },
        });
      }

    } catch (error) {
      // Handle errors
      console.error('Error calling MCP server:', error);
      newMessages.push({ by: 'MCP Server', content: 'An error occurred while processing your request.' });

      // Update the messages state
      br.setValue('messages', newMessages);
    }
  }
};

// Function to call the MCP server's tool
// async /* The `callMcpTool` function is responsible for making a request to the MCP (Model Checking
// Protocol) server's tool. Here's a breakdown of what the function does: */
// function callMcpTool(query: string): Promise<McpResponse> {
//   const MCP_SERVER_URL = 'http://localhost:3000'; // Adjust to match your MCP server URL
//   const TOOL_NAME = 'search_and_store'; // The tool you want to call

//   // Prepare the MCP request
//   const requestPayload = {
//     jsonrpc: '2.0',
//     method: 'callTool',
//     params: {
//       name: TOOL_NAME,
//       arguments: {
//         query: query,
//         numResults: 5, // Adjust as needed
//       },
//     },
//     id: Date.now(),
//   };

//   try {
//     // Send the request to the MCP server
//     const response = await axios.post(MCP_SERVER_URL, requestPayload, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Check for errors in the response
//     if (response.data.error) {
//       throw new Error(response.data.error.message);
//     }

//     // Return the result
//     return response.data.result as McpResponse;
//   } catch (error: any) {
//     // Enhanced error handling
//     if (error.response) {
//       console.error('MCP server error:', error.response.data);
//     } else if (error.request) {
//       console.error('No response from MCP server:', error.request);
//     } else {
//       console.error('Error in MCP request setup:', error.message);
//     }
//     throw error;
//   }
// }
```


## ./src/pages/sidebar.ts

```typescript
import { BackroadNodeManager } from "@backroad/backroad";

export const addSidebar = (br: BackroadNodeManager) => {
  br.sidebar({}).linkGroup({
    items: [
      { href: "/", label: "Home 🏠" },
      { label: "Files 📂", href: "/files" },
      { label: "Dashboard 📊", href: "/sip" },
    ],
  });
};

```


## ./src/pages/sip.ts

```typescript
// pages/sip.ts

import { BackroadNodeManager } from '@backroad/backroad';
import { addSidebar } from '../components/sidebar';

export const sipPage = (br: BackroadNodeManager) => {
  addSidebar(br);

  const [col1, col2] = br.columns({ columnCount: 2 });
  const amount = col1.numberInput({
    label: 'Investment ($)',
    defaultValue: 100,
  });
  const rate = col1.numberInput({ label: 'Interest (%)', defaultValue: 10 });
  const years = col1.radio({
    label: 'Period',
    options: ['5 Years', '10 Years', '15 Years'],
  });
  const [finalAmount, chartData] = doMath(amount, rate, years);
  col1.write({ body: `## Final Amount: $${finalAmount.toFixed(2)}` });
  col2.pie({ data: chartData });
};

const doMath = (amount: number, rate: number, years: string) => {
  const periodMap: { [key: string]: number } = { '5 Years': 5, '10 Years': 10, '15 Years': 15 };
  const period = periodMap[years] || 0;
  const finalAmount = amount * Math.pow(1 + rate / 100, period);
  const chartData = {
    labels: ['Initial Amount', 'Interest'],
    datasets: [
      {
        data: [amount, finalAmount - amount],
        backgroundColor: ['#64bc9d', '#3b6f5d'],
        borderWidth: 0,
      },
    ],
  };
  return [finalAmount, chartData] as const;
};
```


## ./src/utils/mcp.ts

```typescript
// utils/mcp.ts

import axios from 'axios';

interface McpResponse {
  message?: string;
  entities?: any[];
  relations?: any[];
}

export async function callMcpTool(query: string, toolName: string = 'search_and_store'): Promise<McpResponse> {
  const MCP_SERVER_URL = 'http://127.0.0.1:8000'; // Adjust as needed

  const requestPayload = {
    jsonrpc: '2.0',
    method: 'call_tool',
    params: {
      name: toolName,
      arguments: {
        query: query,
        numResults: 5, // Adjust as needed
      },
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
      throw new Error(response.data.error.message);
    }

    return response.data.result as McpResponse;
  } catch (error: any) {
    if (error.response) {
      console.error('MCP server error:', error.response.data);
    } else if (error.request) {
      console.error('No response from MCP server:', error.request);
    } else {
      console.error('Error in MCP request setup:', error.message);
    }
    throw error;
  }
}
```

