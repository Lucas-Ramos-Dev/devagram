
import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB} from '../../middlewares/conectMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { LoginResposta } from '../../types/LoginResposta';
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from 'jsonwebtoken';
import md5 from 'md5';


const endpointLogin = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | LoginResposta>) => {

    //verificando se a .env está criada e informada
    const { MINHA_CHAVE_JWT } = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: 'ENV JWT não informada!'});
    }
    
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token});

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