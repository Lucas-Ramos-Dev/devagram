import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import { NotificacaoModel } from '@/models/NotificacaoModel';

const notificacaoEndpoint = async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg> | any) => {
    try {

        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }

                const publicacao = await NotificacaoModel.findById({}) // como capturar o id do usuario que realizou a acao

                const notificacao = new NotificacaoModel({
                    usuarioLogadoId: req.query.id, 
                    usuarioRealizaAcaoId: null,
                    tipoNotificacao: [{
                        comentario: 'comentou', 
                        curtida: 'curtiu', 
                        novoSeguidor: 'seguiu'
                    }],    
                    publicacao: null,         
                    dataNotificacao: new Date(),    
                    visualizada: false,
                });

                const novasNotificacoes = new Date();
                const listaNovasNotificacao = await NotificacaoModel.find({
                    usuarioLogadoId: req.query.id, 
                    dataNotificacao: novasNotificacoes, 
                    visualizada: false
                });

                const vistaSeteDiasAtras = new Date();
                vistaSeteDiasAtras.setDate(vistaSeteDiasAtras.getDate() - 7);
                const listaNotificacaoSeteDiasAtras = await NotificacaoModel.find({
                    usuarioLogadoId: req.query.id, 
                    dataNotificacao: { $gte: vistaSeteDiasAtras }, // ($gte) -> operador de consulta(query) utilizado no MongoDB em conjunto com o Mongoose. siguinifica >= (maior ou igual)
                    visualizada: true
                });

                const vistaTrintaDiasAtras = new Date();
                vistaTrintaDiasAtras.setDate(vistaTrintaDiasAtras.getDate() - 30);
                const listaNotificacaoTrintaDiasAtras = NotificacaoModel.find({
                    usuarioLogadoId: req.query.id, 
                    dataNotificacao: { $gte: vistaSeteDiasAtras }, 
                    visualizada: true
                });

                //cada categoria carregara um array de objetos que no caso, este objeto sera a notificacao em si
                const categoriaNotificacao = {
                    novas: [{listaNovasNotificacao}],
                    ultiSeteDias: [{listaNotificacaoSeteDiasAtras}],
                    ultiTrintaDias: [{listaNotificacaoTrintaDiasAtras}]
                }


                if(categoriaNotificacao){
                    return res.status(200).json(categoriaNotificacao);
                }else{
                    return res.status(404).json({msg: 'Nenhuma notificacao encontrada!'});
                }

            }
        }
        
        if(req.method === 'PUT'){
            if(req?.query?.id){
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }
                               

            }
        }
        
            
    }catch(e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }

}

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));
