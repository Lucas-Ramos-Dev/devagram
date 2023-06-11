import type { NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import { politicaCORS } from './politicaCORS';

const pesquisaEndpoint = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any[]>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro: 'Usuário não encontrado!'});
                }else{
                    usuarioEncontrado.senha = null;
                    return res.status(200).json(usuarioEncontrado);
                }
            }

            const { filtro } = req?.query;

            if(!filtro  || filtro.length < 2){
                return res.status(400).json({erro: 'Favor informar pelo menos 2 caracteres para a busca!'});

            }else{
                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [{nome: {$regex : filtro, $options: 'i'}},
                         {email: {$regex : filtro, $options: 'i'}}]
                });

                return res.status(200).json(usuariosEncontrados);
            }

        }else{
            return res.status(405).json({erro: 'Método informádo não é válido!'});
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível buscar usuário(s)' + e});
    }

}

export default politicaCORS(validarTokenJWT(conectMongoDB(pesquisaEndpoint)));