import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const {
    BUCKET_SLUG,
    BUCKET_READ_KEY,
    BUCKET_WRITE_KEY} = process.env;


const meuBucketDevaria = createBucketClient({
    bucketSlug: 'BUCKET_SLUG',
    readKey: 'BUCKET_READ_KEY',
    writeKey: 'BUCKET_WRITE_KEY'
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage
});

const uploadImagemCosmic = async (req: any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
            folder: meuBucketDevaria.media
        };

        if(media_object.folder === req.url && req.url.includes('publicacoes')){
            return await meuBucketDevaria.media.insertOne({
                media: media_object
            });
        }else{
            return await meuBucketDevaria.media.insertOne({
                media: media_object
            });
        }        
    }
}

console.log('passou da função!')

export { upload, uploadImagemCosmic };



