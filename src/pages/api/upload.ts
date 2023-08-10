import { Writable } from 'stream';

import formidable from 'formidable';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';

import { Blob } from "buffer";


const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 2,
  allowEmptyFiles: true,
  multiples: false,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const chunks: never[] = [];

    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: () => fileConsumer(chunks),
      uploadDir: '/public',

    });

    // do something with the files
    const contents = Buffer.from(chunks); // or I think it is .concat(chunks)
    
    // let data = new FormData();
    // data.append('file', files);
    // let config = {
    //     method: 'POST',
    //     url: 'https://api.cloudflare.com/client/v4/accounts/39aa4ea3c7a7d766adc4428933324787/images/v1',
    //     headers: {
    //         ...data.getHeaders(),
    //         'Authorization': 'Bearer LpMNSFUw7gmxpn4ZZ7P2ZAcReF6Q-HlbIWqthbO0',
    //         'Content-Type': 'multipart/form-data;',
    //         'X-Auth-Email': ''
    //     },
    //     data: data
    // };
    // axios(config)
    //     .then((response) => {
    //         res.status(200).send(response.data)
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(400).send(error.message)
    //     });
  } catch (e) {
    // handle errors
    console.log('e', e);
    
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};