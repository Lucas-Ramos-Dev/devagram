import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { test } from 'node:test';

const usuarioEndpoint = (req: NextApiRequest, res: NextApiResponse) => {
    
    return res.status(200).json('Usuário autenticado com suceso!');

}

export default validarTokenJWT(usuarioEndpoint);
