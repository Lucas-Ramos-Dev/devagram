import { NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';

const handler = nc()
    .use(upload.single('file'))
    .post(async(req: any, res: NextApiResponse <RespostaPadraoMsg>) => {

        try {

            const { userId } = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro: 'Usuário não encontrado!'});
            }

            //verifica se o usuário informou os valores (descricao) no body
            if(!req || !req.body){
                return res.status(400).json({erro: 'Parâmetros de entrada não informados'});
            }

            //se informados, realiza um destructuring  do valor e atribui a uma constante
            const { descricao } = req?.body;

            //verifica se não tem descricao ou o tamanho da descricao for menor que 2
            if(!descricao || descricao.length < 2){
                return res.status(400).json({erro: 'Descrição não é válida!'});
            }
    
            //verifica se não existe arquivo upado na requisição
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro: 'A imagem é obrigatória!'});
            }

            //se os dados estiverem preenchidos então a imagem será transferida para o cosmic através de uma requisição
            const image = await uploadImagemCosmic(req);

            //criando um objeto para os dados da publicação
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date(),
            }
            //evento assíncrono onde por fim será criada a publicação através do model PublicacaoModel
            await PublicacaoModel.create(publicacao);
            
            //passado e validado por todas as verificações e retornado uma res de 'sucesso' onde indica que a publicação está validada e criada com sucesso
            return res.status(200).json({msg: 'Publicação criada com sucesso!'});

        } catch (e) {
            console.log(e);
            return res.status(400).json({erro: 'Erro ao cadastrar publicação!'});
        }
    });

//alterando a configuração do bodyParser da api para que a mesma receba os dados originais. quando o (bodyParse: true) os dados recebidos da req são convertidos para JSON.
export const config = {
    api : {
        bodyParser: false
    }
}

//quando esta api for chamada será chamado primeiramente em sequência os middleware de conexão com o banco(mongoDB),
//de validação de token após o login(o usuário precisa está logado para criar uma publicação),
//e por último middleware de publicação onde é feito todas as verificações antes de validar a mesma 
export default conectMongoDB(validarTokenJWT(handler));