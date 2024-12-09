// mcp_frontend/index.ts

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