import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const meuBucketDevaria = createBucketClient({
    bucketSlug: 'devaria-devagram-5d17e320-fcff-11ed-ae07-e54431c8d2f4',
    readKey: 'MeoZ4V77rRCCOvd5TzeGYukI4rwVqAEifJtGxRj7DLK7ShXgcp',
    writeKey : 'lCNari6LClMU1P7bpdxD5bbNPHwTDh99yfs5VUlwpDb3xXCyCb'
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

const uploadImagemCosmic = async (req: any) => {
    if(req?.file?.originalname){
        const media_object={
            originalname: req.file.originalname,
            buffer: req.file.buffer,
        };


        if(req.url && req.url.includes('publicacao')){
            console.log('Imagem subiu para a pasta [publicacoes]')
            return await meuBucketDevaria.media.insertOne({
                media: media_object,
                folder: 'publicacoes'
            });
        }else{
            console.log('Imagem subiu para a pasta [avatares]');
            return await meuBucketDevaria.media.insertOne({
                media: media_object,
                folder: 'avatares'
            });
        }
    }
}

export { upload, uploadImagemCosmic };



