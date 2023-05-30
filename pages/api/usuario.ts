import type { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';

const usuarioEndpoint = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | any>) => {

    try {

        const { userId } = req.query;//buscando o userId através de uma query onde este userId é achado no tokenJWT
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null //ocultando o campo senha para que não a retorne no json dos dados do usuário
        return res.status(200).json(usuario);
        
    } catch (e) {
        console.log(e)
        return res.status(400).json({erro: 'Não foi possível obter os dados do usuário'});
    }

}

export default validarTokenJWT(conectMongoDB(usuarioEndpoint));
//valida o tokenJWT para depois realizar conexão com o DB
    //conecta no DB para depois logar o usuário através do usuarioEndpoint
