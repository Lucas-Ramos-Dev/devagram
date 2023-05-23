import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        console.log('ENV chave JWT não informada na execução do projeto!');
        return res.status(500).json({erro: 'ENV chave JWT não informada na execução do projeto!'});
    }

    if(!req || !req.headers){
        console.log('Não foi possível validar o token de acesso!');
        return res.status(401).json({erro: 'Não foi possível validar o token de acesso!'});
    }

    if(req.method !== 'OPTIONS'){

        const authorization = req.headers['authorization'];
        if(!authorization){
            console.log('Não foi possível validar o token de acesso!');
            return res.status(401).json({erro: 'Não foi possível validar o token de acesso!'});
        }

        const token = authorization.substring(7);
        if(!token){
            console.log('Não foi possível validar o token de acesso!');
            return res.status(401).json({erro: 'Não foi possível validar o token de acesso!'});
        }

        const tokenDecoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
        if(!tokenDecoded){
            console.log('Não foi possível validar o token de acesso!');
            return res.status(401).json({erro: 'Não foi possível validar o token de acesso!'});            
        }

        if(!req.query){
            req.query = {};
        }else{
            req.query.userId = tokenDecoded._id;
        }

    return handler(req, res);

    }

}
