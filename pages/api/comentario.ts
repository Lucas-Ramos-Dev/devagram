import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';

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

            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({erro: 'Comentário não é válido!'});
            }

            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: req.body.comentario
            }
            publicacao.comentarios.push(comentario);
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
            return res.status(200).json({msg: 'Comentário adicionado com sucesso!'});

        }else{
            return res.status(405).json({erro: 'Método informado não é válido!'})
        }

    }catch(erroCapturado){
        console.log(erroCapturado);
        return res.status(500).json({erro: 'Erro ao adicionar comentários!'});
    }
}

export default validarTokenJWT(conectMongoDB(comentarioEndpoint));