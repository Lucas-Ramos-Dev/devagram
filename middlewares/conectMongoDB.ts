import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';

export const conectMongoDB = (handler: NextApiHandler) =>
    //async onde informo que minha função é assíncrona e aceita várias treads, várias operações em conjunto e simuntâneas que no caso desta função, trabalha com uma promisse de uma conexão com o banco de dados.
    async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {

        //verifica se o banco já está conectado, se estiver conectado, seguir para o endpoint ou próximo middleware. feita uma condição para verificar se o mongoose está conectado através de uma lista de conexões(poderíamos ter mais de uma conexão), ele pega a primeira conexão e verifica se ela está pronta pra uso através da propriedade readyState=(pronta pra uso, estado de printo), se estiver tudo correto então é retornado a req=requisição e res=resposta.  
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }else{
            
            //verificando que não está conectado então vamos conectar. Passos = obter a variável de ambiente preenchida do .env
            const {DB_CONEXAO_STRING} = process.env;
            
            //se a .env estiver vazia aborta o uso do sistema e avisa o programador
            if(!DB_CONEXAO_STRING){
                return res.status(500).json({erro: '.ENV de configuração não informada!'});
            }else{

                //duas funções para devolver logs dos estados de conexão com o banco de dados
                mongoose.connection.on('connected', () => {
                    console.log('Banco de dados conectado com sucesso!');
                });
                mongoose.connection.on('error', erro => {
                    console.log('Ocorreu um erro ao conectar no banco de dados!');
                });

                //promisse onde é realizada uma espera de conexão com o banco de dados 
                await mongoose.connect(DB_CONEXAO_STRING);

                //agora posso seguir para o meu endpoint, pois o banco de dados está conectado
                return handler(req, res);
            }
        }
    }