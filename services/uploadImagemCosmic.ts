import multer from "multer";
import cosmicjs from 'cosmicjs';

const {
    COSMIC_SLUG,
    COSMIC_WRITE_KEY} = process.env;

const Cosmic = cosmicjs(); // criando uma instância do cosmicjs e criado também os dois buckets para trabalhar com o upload de arquivos em buckets diferentes(avatares e publicações). 

const cosmicBucket = Cosmic.bucket({
    slug: COSMIC_SLUG,
    write_key: COSMIC_WRITE_KEY
});

//o multer primeiramente grava os arquivos em uma memória temporária para depois realizar o processo de upload especificado logo abaixo
const storage = multer.memoryStorage();

//criando a função de upload de arquivo em cima do arquivo que é gravado temporariamente pelo multer.memoryStorage()
const upload = multer({storage: storage});

console.log('ta aqui!')

const uploadImagemCosmic = async (req: any) => {
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
            folder: (req.url && req.url.include('publicacoes')) ? 'Publicacoes' : 'Avatares' 
        };

        return await cosmicBucket.addMedia({
            media_object
        });
    }
}

console.log('passou da função')

export { upload, uploadImagemCosmic };



