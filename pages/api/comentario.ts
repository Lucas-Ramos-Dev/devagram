import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { politicaCORS } from '../api/politicaCORS'
import { NotificacaoModel } from '@/models/NotificacaoModel';

const comentarioEndpoint = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
    try{

        if(req.method === 'PUT'){

            const { userId, id } = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuário não encontrado!'});
            }

            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro: 'Publicação não encontrada!'});
            }

            const notificacao = await NotificacaoModel.findById(userId);
            if(!notificacao){
                return res.status(400).json({erro: 'Notificacao não encontrada!'});
            }

            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({erro: 'Comentário não é válido!'});
            }

            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: req.body.comentario
            }

            const notificacaoComentario = await NotificacaoModel.create({
                usuarioLogadoId: req.query.id, 
                usuarioRealizaAcaoId: usuarioLogado._id,
                tipoNotificacao: 'comentario',    
                publicacao: publicacao._id,         
                dataNotificacao: new Date(),    
                visualizada: false,
            });



            publicacao.comentarios.push(comentario);
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);

            notificacao.push(notificacaoComentario);
            await NotificacaoModel.findByIdAndUpdate({usuarioRealizaAcaoId})





            return res.status(200).json({msg: 'Comentário adicionado com sucesso!'});
        
            

        }else{
            return res.status(405).json({erro: 'Método informado não é válido!'})
        }

        

    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Erro ao adicionar comentários!'});
    }
}

export default politicaCORS(validarTokenJWT(conectMongoDB(comentarioEndpoint)));