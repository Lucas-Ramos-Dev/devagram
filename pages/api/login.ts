import type { NextApiRequest, NextApiResponse } from "next";
import { conectMongoDB} from '../../middlewares/conectMongoDB';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { LoginResposta } from '../../types/LoginResposta';
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from 'jsonwebtoken';
import md5 from 'md5';

//criando endpoint de login onde esta função se torna assíncrona pois depende de respostas de envs, verificaç~]ao de métodos http, busca e verificação de usuários, e conexão com banco de dados
const endpointLogin = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg | LoginResposta>) => {

    //verificando se a .env está criada e informada
    const { MINHA_CHAVE_JWT } = process.env;
    if(!MINHA_CHAVE_JWT){
        console.log('ENV JWT não informada!');
        return res.status(500).json({erro: 'ENV JWT não informada!'});
    }

    //verifica se o tipo de método http é 'POST' que no caso é o método que envia informações para o servior, e se for este método, executa uma função, se não for o método 'POST', retorna um erro status(405) onde o tipo de método http não é válido pois é enviado uma informação para o servidor onde é verificado se esta informação existe (login e senha)
    if(req.method === 'POST'){
        //realizando um destructuring dos elementos {login, senha} do body através de uma requisição
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);
            console.log('Usuário logado e token gerado com sucesso!')
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token});

        }else{
            console.log('Usuário ou senha inválido!');
            return res.status(400).json({erro: 'Usuário ou senha inválido!'});
        }

    }else{
        //retorna o status de uma requisição (405 - method not allowed(método não permitido)) feita pelo usuário onde esta requisição não é permitida
        console.log('Método Informado não é válido!');
        return res.status(405).json({erro: 'Método Informado não é válido!'});
    }  
}

//primeiro irá realizar a conexão com o banco de dados para depois chamar o endpoint
export default conectMongoDB(endpointLogin);