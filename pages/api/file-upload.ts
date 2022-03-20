import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable';
import fs from 'fs';
import withAuthentication from "../../lib/withAuthentication";
import { User } from "../../types/DbModels";
import { userCollection } from "../../db/collections";

// first we need to disable the default body parser
export const config = {
    api: {
      bodyParser: false,
    }
};

type FormidablePromise = {
    fields: formidable.Fields;
    files?: any;
  };
  
function formidablePromise(req: NextApiRequest): Promise<FormidablePromise> {
return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (error: Error, fields: formidable.Fields, files: formidable.Files) => {
    if (error) {
        return reject(error);
    }
    resolve({ fields, files });
    });
});
}

const handler = async (req: NextApiRequest, res: NextApiResponse, user: User) => {
    let response = {status: 'failed'}
    let status = 500;

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files)=>{
        if(err) console.log(err);
    });

    try {
        const { fields, files } = await formidablePromise(req);
        console.log(fields);
        const dir = './public/'+user._id.toString()+'/profiles/';
        const ext = files.image.originalFilename.slice(files.image.originalFilename.lastIndexOf('.'));
        const fileName = Date.now()%100000+user._id.toString().slice(-8)+'_'+user.name.replace(' ', '_')+ext;
        const newPath = dir + fileName;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFile(files.image.filepath, newPath, (err) => {
            if (err) throw err;
        })

        // update image name to database
        await (await userCollection()).updateOne({_id: user._id}, {'$set': {image: '/'+user._id.toString()+'/profiles/'+fileName}})

        status = 200;
        response.status = 'success';

    }catch(err:any){
        console.log(err);
    }finally{
        res.status(status).json(response);
    }
    
}

export default withAuthentication(handler);