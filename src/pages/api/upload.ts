import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed.' });
    }

    try {
      const cloudflareUploadUrl: string = 'YOUR_CLOUDFLARE_ENDPOINT_URL';
      const headers: any = {
        // Headers for Cloudflare upload
      };

      const response = await axios.post(cloudflareUploadUrl, req.file.buffer, { headers: headers });

      // Assuming Cloudflare's response includes the image URL in the `url` property.
      const imageUrl = response.data.url;
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload to Cloudflare.' });
    }
  });
};
