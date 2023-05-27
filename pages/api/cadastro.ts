
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type { CadstroRequisicao} from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import md5 from 'md5';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import nc from 'next-connect';

    
const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {

    //capturando os dados do body e tranformando-os em dados tipados com as propriedades necessárias para o usuário realizar o cadastro.    
    const usuario = req.body as CadstroRequisicao;

    //validando os dados recebidos (nome, email, senha)
    if(!usuario.nome || usuario.nome.length < 2){
        console.log('Nome inválido!')
        return res.status(400).json({erro: 'Nome inválido!'});
    }

    if(
        !usuario.email 
        || usuario.email.length < 5 
        || !usuario.email.includes('@') 
        || !usuario.email.includes('.') 
        ){
            console.log('E-mail inválido!')
            return res.status(400).json({erro: 'E-mail inválido!'});
    }

    if(!usuario.senha || usuario.senha.length < 4){
        console.log('Senha inválido!')
        return res.status(400).json({erro: 'Senha inválido!'});
    }

    //realizando validação para verificar duplicidade de contas onde é retornado um status(400) devido já ser existente. 
    const usuariosComMesmoEmail = await UsuarioModel.find({email: usuario.email});
    if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
        console.log('Já existe uma conta com o email informado!');
        return res.status(400).json({erro: 'Já existe uma conta com o email informado!'});
    }

    //enviar a imagem do multer para o cosmic
    const image = await uploadImagemCosmic(req);

    //criado um novo objeto para trabalhar com criptografia de senha através do modulo (md5) onde é tratado na propriedade senha e atribuído esse objeto ao usuário criado.
    const usuarioASerSalvo = {
        nome: usuario.nome,
        email: usuario.email,
        senha: md5(usuario.senha),
        avatar: image?.media?.url
    }

    //operação assíncrona, criando e salvando no banco de dados e retornando um status(200) de criação de usuário com sucesso 
    await UsuarioModel.create(usuarioASerSalvo);
    console.log('Usuário criado com sucesso!')
    return res.status(200).json({msg: 'Usuário criado com sucesso!'});
        
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default conectMongoDB(handler);