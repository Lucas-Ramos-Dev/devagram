import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { SeguidorModel } from '@/models/SeguidorModel';
import { politicaCORS } from './politicaCORS';

const feedEndpoint  = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any> ) => {
    try {

        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro: 'Usuário não encontrado!'});
                }

                const publicacoes = await PublicacaoModel
                    .find({idUsuario: usuario.id})
                    .sort({data: -1});//ordenando as publicações buscadas da mais nova p/ as mais antigas(data)
            
                return res.status(200).json(publicacoes); 
            }else{
                const { userId } =req.query;
                const usuarioLogado = await UsuarioModel.findById(userId);
                
                if(!usuarioLogado){
                    return res.status(400).json({erro: 'Usuário não encontrado!'});
                }
    
                const seguidores = await SeguidorModel.find({usuarioId: usuarioLogado._id});
                const seguidoresIds = seguidores.map( seguidor => seguidor.usuarioSeguidoId);
    
                const publicacoes = await PublicacaoModel.find({
                    $or: [
                        {idUsuario: usuarioLogado._id},
                        {idUsuario: seguidoresIds}
                    ]
                }).sort({data: -1});

                const result = [];
                for(const publicacao of publicacoes){
                    const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
                    if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario: {
                            nome: usuarioDaPublicacao.nome, 
                            avatar: usuarioDaPublicacao.avatar
                        }};
                        result.push(final);
                    }
                }
    
                return res.status(200).json(result);
            }
            
        }else{
            return res.status(405).json({erro: 'Método informado não é válido!'});
        }

    } catch(e){
        console.log(e);
        res.status(400).json({erro: 'Não foi possível obter o Feed!'});
    }
}

export default politicaCORS(validarTokenJWT(conectMongoDB(feedEndpoint)));