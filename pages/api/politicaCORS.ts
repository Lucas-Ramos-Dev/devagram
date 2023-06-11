import { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler: NextApiHandler) => async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
    try {

        await NextCors(req, res, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT'],
            optionsSuccessStatus: 200 //navegadores antigos apresentam problema quando retornado 204
        });

        return handler(req, res);
        
    }catch(e) {
        console.log(e);
        return res.status(500).json({erro: 'Ocorreu um erro ao tratar política de CORS!'});
    }
}