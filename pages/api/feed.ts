import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import publicacao from './publicacao';

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
            
                return res.status(405).json(publicacoes); 
            }
        }
        return res.status(405).json({erro: 'Método informado não é válido!'});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({erro: 'Não foi possível obter o Feed!'});
    }
}

export default validarTokenJWT(conectMongoDB(feedEndpoint));