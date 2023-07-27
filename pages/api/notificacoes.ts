import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import { NotificacaoModel } from '@/models/NotificacaoModel';

const notificacaoEndpoint = async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg> | any) => {
    try {

        if(req.method === 'GET'){
            if(req?.query?.id){
                //responsavel por validar se o usuario passou um id dentro da requisicao
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }


                //responsavel por verificar se existe e listar todas as notificacoes atraves de uma busca 
                //no modelo do db NotificacaoModel, lista as notificacoes do usuario logado buscando pelo seu id

                //buscar pelo dataNotificacao
                //instanciar a data atual
                //reduzir a instancia em 7 dias
                //enviar o retorno em um dataNotificacao com o visualizada = true

                const novasNotificacoes = new Date();
                const listaNotificacao

                const vistaSeteDiasAtras = new Date();
                vistaSeteDiasAtras.setDate(vistaSeteDiasAtras.getDate() - 7);
                const listaNotificacaoSeteDiasAtras = await NotificacaoModel.find({usuarioLogadoId: req.query.id, dataNotificacao: { $gte: vistaSeteDiasAtras }, visualizada: true});
                console.log(listaNotificacaoSeteDiasAtras);

                const vistaTrintaDiasAtras = new Date();
                vistaTrintaDiasAtras.setDate(vistaTrintaDiasAtras.getDate() - 30);
                const listaNotificacaoTrintaDiasAtras = NotificacaoModel.find({usuarioLogadoId: req.query.id, dataNotificacao: { $gte: vistaSeteDiasAtras }, visualizada: true});
                console.log(res.status(200).json(listaNotificacaoTrintaDiasAtras));

                if(listaNotificacao.length > 0){
                    return res.status(200).json(listaNotificacao);
                }else{
                    return res.status(404).json({msg: 'Nenhuma notificacao encontrada!'});
                }

            }
        }
        

        if(req.method === 'POST'){
            if(req?.query?.id){
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }

                
                console.log('cheguei');



                const notificacao = await NotificacaoModel.create({
                    usuarioLogadoId: req.query.id, 
                    usuarioRealizaAcaoId: null,
                    tipoNotificacao: null,    
                    publicacao: null,         
                    dataNotificacao: new Date(),    
                    visualizada: false,
                });

                notificacao.save();

                return res.status(200).json(notificacao);

            }
        }
        
            
    }catch(e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }

}

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));





 // const categoriaNotificacao = {
                //     novas:          new Date(),
                //     ultiSeteDias:   new Date(),
                //     ultiTrintaDias: new Date()
                // }

                // notificacao.$where(() => {
                //     return categoriaNotificacao.novas;
                // });

                // notificacao.$where(() => {
                //     categoriaNotificacao.ultiSeteDias.setDate(categoriaNotificacao.ultiSeteDias.getDate() - 7);
                //     return categoriaNotificacao.ultiSeteDias;
                // });

                // notificacao.$where(() => {
                //     categoriaNotificacao.ultiTrintaDias.setDate(categoriaNotificacao.ultiTrintaDias.getDate() - 30);
                //     return categoriaNotificacao.ultiTrintaDias;
                // });

















//     if(req.method === 'GET'){
    //         if(req?.query?.id){
    //             const usuario = UsuarioModel.findById(req?.query?.id);
    //             if(!usuario){
    //                 return res.status(400).json({msg: 'Usuario nao encontrado!'});
    //             }

    //             const listagemNotificacoesUsuarioId = await NotificacaoModel.find({
    //                 $or: [
    //                     {usuarioLogadoId: usuario},
    //                     {usuarioRealizaAcaoId: usuario}
    //                 ]
    //             }).exec();

    //             if(listagemNotificacoesUsuarioId){

    //                 //criacao de um objeto com propriedades que definirao as categorias das notificacoes, onde cada propriedade
    //                 // carrega um tipo, new Date(), que corresponde a data atual e em seguida alteraremos seus valores para 
    //                 //carregarem as notificacoes por datas especificadas.
    //                 const categoriaNotificacao = {
    //                     novas:[{
    //                         notificacao.usuarioRealizaAcaoId = 
    //                     }], //nao precisaremos alterar as novas notificacoes pois elas carregam o valor da data atual 
    //                     ultimasSeteDias:    [],
    //                     ultimasTrintaDias:  []
    //                 }

    //                 categoriaNotificacao.novas = () => {
                        
    //                 }


    //                 //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
    //                 //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
    //                 //7 dias e retorna seu valor. 
    //                 const vistaSeteDiasAtras = new Date();
    //                 vistaSeteDiasAtras.setDate(vistaSeteDiasAtras.getDate() - 7);
    //                 categoriaNotificacao.ultimasSeteDias = vistaSeteDiasAtras;

    //                 //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
    //                 //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
    //                 //7 dias e retorna seu valor.
    //                 const vistaTrintaDiasAtras = new Date();
    //                 vistaTrintaDiasAtras.setDate(vistaTrintaDiasAtras.getDate() - 30);
    //                 categoriaNotificacao.ultimasTrintaDias = vistaTrintaDiasAtras;

    //                 listagemNotificacoesUsuarioId = categoriaNotificacao;


    //                 return res.status(200).json(listagemNotificacoesUsuarioId);
    //             }

    //     }else{
    //         return res.status(405).json({erro: 'Método informado não é válido!'});
    //     }

                    
        
    // }