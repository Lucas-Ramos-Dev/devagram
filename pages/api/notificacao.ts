import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';


const notificacaoEndpoint = async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any> ) => {
    try {

        if(req.method === 'GET'){
            //se dentro da minha req existir uma query, e dentro de minha query tiver a 
            //propriedade id, entao faco atribuicao a uma variavel realizando uma busca 
            //com o metodo findById no banco de dados. Por ultimo verifico se este usuario existe, 
            //caso nao, me retorna um erro 400 que siguinifica que ocorreu um erro na requisicao ou req mal informada.
            if(req?.query?.id){
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }
                
                //faco uma busca das publicacoes para listagem atraves do modelo no meu banco de dados
                const publicacoes = await PublicacaoModel
                    .find({idUsuario: usuario})
                    .sort({data: -1});
            
                return res.status(200).json(publicacoes); 
            }

            




        }else{
            return res.status(405).json({erro: 'Método informado não é válido!'});
        }
                    
    } catch (e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }
}
    

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));
