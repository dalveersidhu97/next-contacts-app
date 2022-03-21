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

const saveFile = (files: any, user: User) => {

    const fileName = user._id.toString()+'_'+user.name.replace(' ', '_');
        
        const dir = './public/'+user._id.toString()+'/profiles/';
        const ext = files.image.originalFilename.slice(files.image.originalFilename.lastIndexOf('.'));
        const newPath = dir + fileName+ext;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFile(files.image.filepath, newPath, (err) => {
            if (err) throw err;
            return;
        })

        //fs.unlinkSync(files.image.filepath);
        return {fileName, ext, newPath: files.image.filepath}
}

const handler = async (req: NextApiRequest, res: NextApiResponse, user: User) => {
    let response = {status: 'failed', message: ""}
    let status = 200;

    try {
        const { fields, files } = await formidablePromise(req);
        let updatedFileds: {name?:string, image?:string, email?:string, phone?: string} = {}
        
        if(fields.name) updatedFileds.name = fields.name as string;
        if(fields.email) updatedFileds.email = fields.email as string;
        if(fields.phone) updatedFileds.phone = fields.phone as string;

        if(files && files.image){
            const {fileName, ext, newPath} = saveFile(files, user);
            updatedFileds.image = '/'+user._id.toString()+'/profiles/'+fileName+ext
        }

        console.log(fields)
        console.log(updatedFileds)

        // update image name to database
        await (await userCollection()).updateOne({_id: user._id}, {'$set':  updatedFileds})

        status = 200;
        response.status = 'success';

    }catch(err:any){
        if(err && err.code == 11000) {
            response.message = 'Email already been taken!';
            return res.status(status).json(response);
        }else {
            status = 400;
            response.message = 'Please try again!';
        }
        console.log(err);
    }
    
    res.status(status).json(response);
    
    
}

export default withAuthentication(handler);