import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { NotificacaoModel } from '@/models/notificacaoModel';
import { UsuarioModel } from '@/models/UsuarioModel';
import { TipoNotificacao } from '@/types/tipoNotificacao';


const notificacaoEndpoint  = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | TipoNotificacao | any> ) => {

    try {
        //temos que passar na query(url) o id do usuarioLogado onde listaremos as notificacoes disponiveis para este, 

        //o que precisamos para gerar uma notificacao?

        // - id o usuario que realizou a acao(seguidor) para capturarmos suas informacoes como (nome de perfil) - COMO FACO PRA PEGAR ESSE ID
        // - tipo de notificacao (curtida, comentario, novoSeguidor)
        // - publicacao(id) em que foi realizada uma acao (curtida ou comentario)
        // - data desta notificacao para listagem por categoria
        // - visualizada (true ou false)

        const { userId } = req?.query; //recuperando o ID decodificado do usuarioLogado no momento
        const usuario = await UsuarioModel.findById(userId);
        if(!usuario){
            return res.status(400).json({msg: 'Usuario nao encontrado!'});
        }

        const notificacao = await NotificacaoModel
            .find({idUsuarioLogado: usuario.id})

        return res.status(200).json(notificacao);



    } catch (e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }
    
}

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));