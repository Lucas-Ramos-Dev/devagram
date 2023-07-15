import type { NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from './politicaCORS';

const likeEndpoint = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
    try {
        if(req.method === 'PUT'){
            //capturando o id da publicação
            const { id } = req.query;

            //cria um objeto e faz uma busca atraves do seu id, onde fazemos uma verificacao se esta publicacao existe
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                res.status(400).json({erro: 'Publicação não encontrada!'})
            }

            //faz um destructuring do objeto userId atraves de uma requisicao/consulta
            const { userId } = req.query;

            //criando um objeto usuario, fazendo uma busca do userId no DB  e atribuindo a este objeto(usuario) e verificando se o usuario/userId existe
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                res.status(400).json({erro: 'Usuário não encontrado!'})
            }

            //como vamos administrar os likes
            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => 
                e.toString() === usuario._id.toString());

                //se o index for > -1, sinal de que ele já curtiu a foto
                if(indexDoUsuarioNoLike != -1){
                    publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                    await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
                    
                    return res.status(200).json({msg: 'Publicação descurtida com sucesso!'});
                }else{
                //se o index for -1, sinal de que ele não curtiu a foto
                    publicacao.likes.push(usuario._id);
                    await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);

                    return res.status(200).json({msg: 'Publicação curtida com sucesso!'});
                }

        }else{
            return res.status(200).json({erro: 'Método informado não é válido!'})
        }

    } catch (e) {
        console.log(e)
        res.status(500).json({erro: 'Ocorreu um erro ao curtir/descurtir uma publicação!'})
    }
}

export default politicaCORS(validarTokenJWT(conectMongoDB(likeEndpoint)));
