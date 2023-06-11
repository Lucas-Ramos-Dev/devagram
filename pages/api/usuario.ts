import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import { politicaCORS } from './politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .put(  async(req: any, res: NextApiResponse <RespostaPadraoMsg>) => {
        
        try {

            //se eu quero alterar o usuário então eu preciso primeiro pegar o usuário no DB
            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            //se não existe usuario no DB então me retorna um erro
            if(!usuario){
                return res.status(400).json({erro: 'Usuário não encontrado!'})
            }

            //realizando a captura do dado(nome) que será alterado através da requisição no body onde é feito ferificação da existência desse dado e se o mesmo é menor que (2) caracteres.
            const { nome } = req.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }

            //realizando a captura do arquivo através de uma requisição e realizando alteração somente no cosmic.
            const { file } = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatares = image.media.url;
                }
            }

            //alterando os dados no DB
            await UsuarioModel.findByIdAndUpdate({_id: usuario._id}, usuario);

            return res.status(200).json({msg: 'Usuário alterado com sucesso!'});
            
        } catch (e) {
            console.log(e);
            res.status(400).json({erro: 'Não foi possível atualizar usuário!'})
        }
    }).get(async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any>) => {

        try {
            const { userId } = req.query;//buscando o userId através de uma query onde este userId é achado no tokenJWT
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null //ocultando o campo senha para que não a retorne no json dos dados do usuário
            return res.status(200).json(usuario);
            
        } catch (e) {
            console.log(e)
            return res.status(400).json({erro: 'Não foi possível obter os dados do usuário'});
        }

    });

export const config = {
    api : {
        bodyParser: false
    }
}


export default politicaCORS(validarTokenJWT(conectMongoDB(handler)));
//valida o tokenJWT para depois realizar conexão com o DB
    //conecta no DB para depois logar o usuário através do usuarioEndpoint
