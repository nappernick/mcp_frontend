// mcp_frontend/src/pages/files.ts

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