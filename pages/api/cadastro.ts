
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type { CadstroRequisicao} from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import md5 from 'md5';

//função que verifica o tipo de requisição http com dois parâmetros tipados com atributos do next.js (NextApiRequest, NextApiResponse) para enviar requisições e obter respostas do servidor. Caso o tipo de requisição(method) for igual a "POST"(tipo que envia os dados para o servidor), função entrará em uma condição para verificar os atributos/campos (nome, email, senha) onde cada campo passa por uma verificação antes de serem enviados para o servidor.
const endpointCadastro = 
    async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {

        try{

            if(req.method === 'POST'){
                //capturando os dados do body e tranformando-os nos dados tipados somente com as propriedades necessárias para o usuário realizar o cadastro.    
                const usuario = req.body as CadstroRequisicao;
    
                //validando os dados recebidos (nome, email, senha)
                if(!usuario.nome || usuario.nome.length < 2){
                    return res.status(400).json({erro: 'Nome inválido!'});
                }
    
                if(
                    !usuario.email 
                    || usuario.email.length < 5 
                    || !usuario.email.includes('@') 
                    || !usuario.email.includes('.') 
                    ){
                        return res.status(400).json({erro: 'E-mail inválido!'});
                }
    
                if(!usuario.senha || usuario.senha.length < 4){
                    return res.status(400).json({erro: 'Senha inválido!'});
                }
    
                //realizando validação para verificar duplicidade de contas onde é retornado um status(400) devido já ser existente. 
                const usuariosComMesmoEmail = await UsuarioModel.find({email: usuario.email});
                if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                    return res.status(400).json({erro: 'Já existe uma conta com o email informado!'});
                }
    
                //criado um novo objeto para trabalhar com criptografia de senha através do modulo (md5) onde é tratado na propriedade senha e atribuído esse objeto ao usuário criado.
                const usuarioASerSalvo = {
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: md5(usuario.senha)
                }
    
                //operação assíncrona, criando e salvando no banco de dados e retornando um status(200) de criação de usuário com sucesso 
                await UsuarioModel.create(usuarioASerSalvo);
                return res.status(200).json({msg: 'Usuário criado com sucesso!'});
            
            }else{
                return res.status(405).json({erro: 'Método informado não é válido!'});
            }
        }catch(erroGerado){
            console.log(erroGerado);
        }

}

export default conectMongoDB(endpointCadastro);