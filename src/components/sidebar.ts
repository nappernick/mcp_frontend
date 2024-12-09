// mcp_frontend/src/components/sidebar.ts

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