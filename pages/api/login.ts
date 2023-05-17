
import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB} from '../../middlewares/conectMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointLogin = (
    req: NextApiRequest, 
    res: NextApiResponse <RespostaPadraoMsg>
) => {
    
    if(req.method === 'POST'){
        const {login, password} = req.body;

        if(login === 'admin@123.com'  &&  password === 'admin'){
            return res.status(200).json({msg: 'Usuário autenticado com sucesso!'});
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