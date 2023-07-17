import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import nextConnect from 'next-connect';
import { NextRequest } from 'next/server';


const handler = nextConnect().put(async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any> ) => {

        try {

            const { userId } = req?.query; //recuperando o ID decodificado do usuarioLogado no momento
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({msg: 'Usuario nao encontrado!'});
            }
                
        } catch (e) {
            console.log(e);
            return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
        }
    
    }).get(async (req: NextRequest, res: NextApiResponse <RespostaPadraoMsg | any>) => {

    });

export default politicaCORS(validarTokenJWT(conectMongoDB(handler)));
