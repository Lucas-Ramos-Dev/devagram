import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const { 
    BUCKET_SLUG, 
    BUCKET_READ_KEY, 
    BUCKET_WRITE_KEY 
    } = process.env; //criando uma destructuring das chaves do do meu .env

//fazendo validacao dessas chaves onde verifico se estas realmente existem, case true, 
//cria o bucket geral e faz as devidas validacoes e implementacoes, caso false retorna um erro
if(BUCKET_SLUG && BUCKET_READ_KEY && BUCKET_WRITE_KEY){

    const meuBucketDevaria = createBucketClient({
        bucketSlug: BUCKET_SLUG,
        readKey: BUCKET_READ_KEY,
        writeKey : BUCKET_WRITE_KEY
    });

    //obs: definido escopo de variavel para var pois o export final nao teria acesso na chamada da funcao caso o escopo fosse let ou const
    const storage = multer.memoryStorage();
    var upload = multer({
        storage: storage
    });
    
    //obs: definido escopo de variavel para var pois o export final nao teria acesso na chamada da funcao caso o escopo fosse let ou const
    var uploadImagemCosmic = async (req: any) => {
        
        if(req?.file?.originalname){
            if( !req.file.originalname.includes('.png') &&
                !req.file.originalname.includes('.jpg') &&
                !req.file.originalname.includes('.jpeg')){
                    throw new Error('Extensão da imagem inválida!');
                }
                
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
}

export { upload, uploadImagemCosmic };



