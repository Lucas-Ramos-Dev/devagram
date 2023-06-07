import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { NextApiRequest, NextApiResponse} from 'next';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { SeguidorModel } from '../../models/SeguidorModel';

const endpointSeguir = async(req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
    
    try {
        if(req.method === 'PUT'){

            const { userId, id } = req?.query;

            //id do usuário logado - quem está realizando as ações - query
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                res.status(400).json({erro: 'Usuário logado não encontrado!'});
            }

            //id do usuário a ser seguido - query
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                res.status(400).json({erro: 'Usuário a ser seguido não encontrado!'});
            }

            //buscar se EU LOGADO segue ou não esse usuário
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                //sinal que já sigo esse usuário então criamos uma função que percorre noso DB e remove esse usuário que já sigo
                euJaSigoEsseUsuario.forEach(async(e: any) => await SeguidorModel.findByIdAndDelete({_id: e._id}));
                
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);

                usuarioASerSeguido.seguidores--;
                await  UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg: 'Deixou de seguir o usuário com sucesso!'});

            }else{
                //sinal que eu não sigo esse usuário, criando instâncias e obtenção de dados para criar um seguidor
                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id 
                };
                await SeguidorModel.create(seguidor);

                //adicionar e atualizar um seguindo no usuário logado
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);

                //adicionar e atualizar um seguidor no usuário seguido
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg: 'Usuário seguido com sucesso!'});
            }
            
        }else{
            return res.status(405).json({erro: 'Método informado não existe!'})
        }
        
    } catch (e) {
        console.log(e);
        res.status(500).json({erro: 'Não foi possível seguir/deseguir usuario informado'})
    }
}

export default validarTokenJWT(conectMongoDB(endpointSeguir));