// mcp_frontend/src/main.ts

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