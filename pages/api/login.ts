
import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB} from '../../middlewares/conectMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from "../../models/UsuarioModel";

const endpointLogin = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
    
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){

            const usuarioEncontrado = usuariosEncontrados[0];
            return res.status(200).json({msg: `Usuário ${usuarioEncontrado.nome} autenticado com sucesso!`});
        }else{
            return res.status(400).json({erro: 'Usuário ou senha inválido!'});
        }

    }else{
        //retorna o status de uma requisição (405 - method not allowed(método não permitido)) feita pelo usuário onde esta requisição não é permitida
        return res.status(405).json({erro: 'Método Informado não é válido!'});
    }  
}

//primeiro irá realizar a conexão com o banco de dados para depois chamar o endpoint
export default conectMongoDB(endpointLogin);