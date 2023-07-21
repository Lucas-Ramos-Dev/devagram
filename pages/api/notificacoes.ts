import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { NotificacaoModel } from '@/models/NotificacaoModel';

//

const notificacaoEndpoint = async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg> | any) => {
    try {

        const notificacao = await NotificacaoModel.create({
            usuarioLogadoId: "teste", 
            usuarioRealizaAcaoId: "teste",
            tipoNotificacao: "teste",    
            publicacao: "teste",         
            dataNotificacao: Date(),    
            visualizada: false,        
        });

        const teste = notificacao.save();
        console.log(teste);

        return res.status(200).json({msg: "notificacao criada com sucesso!"});
    




        // // if(req.method === 'GET'){
        // //     //se dentro da minha req existir uma query, e dentro de minha query tiver a 
        // //     //propriedade id, entao faco atribuicao a uma variavel realizando uma busca 
        // //     //com o metodo findById no banco de dados. Por ultimo verifico se este usuario existe, 
        // //     //caso nao, me retorna um erro 400 que siguinifica que ocorreu um erro na requisicao ou req mal informada.
        // //     if(req?.query?.id){
        // //         const usuario = UsuarioModel.findById(req?.query?.id);
        // //         if(!usuario){
        // //             return res.status(400).json({msg: 'Usuario nao encontrado!'});
        // //         }
                
        // //         //faco uma busca das publicacoes para listagem atraves do modelo no meu banco de dados
        // //         const publicacoes = await PublicacaoModel.find({idUsuario: usuario})
                


        // //         //criacao de um objeto com propriedades que definirao as categorias das notificacoes, onde cada propriedade
        // //         // carrega um tipo, new Date(), que corresponde a data atual e em seguida alteraremos seus valores para 
        // //         //carregarem as notificacoes dos dias especificados.
        // //         const categoriaNotificacao = {
        // //             novas: new Date(), //nao precisaremos as novas notificacoes pois elas carregam o valor da data atual 
        // //             ultSeteDias: new Date(),
        // //             ultTrintaDias: new Date()
        // //         }

        // //         //const novasNaoVisualizadas = categoriaNotificacao.novas;

        // //         //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
        // //         //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
        // //         //7 dias e retorna seu valor. 
        // //         const vistaSeteDiasAtras = new Date(); 
        // //         vistaSeteDiasAtras.setDate(vistaSeteDiasAtras.getDate() - 7);
        // //         categoriaNotificacao.ultSeteDias = vistaSeteDiasAtras;

        // //         //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
        // //         //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
        // //         //7 dias e retorna seu valor. 
        // //         const vistaTrintaDiasAtras = new Date();
        // //         vistaTrintaDiasAtras.setDate(vistaTrintaDiasAtras.getDate() - 30);
        // //         categoriaNotificacao.ultTrintaDias = vistaTrintaDiasAtras;
               
        // //         const novasNaoVisualizadas = categoriaNotificacao.novas;
                
        // //         await NotificacaoModel




    
        //     }

            
            




        // }else{
        //     return res.status(405).json({erro: 'Método informado não é válido!'});
        // }
                    
    } catch (e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }
}
    

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));
