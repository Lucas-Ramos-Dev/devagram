import { NextApiRequest, NextApiResponse} from 'next';
import { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectMongoDB } from '../../middlewares/conectMongoDB';
import { politicaCORS } from './politicaCORS';
import { UsuarioModel } from '@/models/UsuarioModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { NotificacaoModel } from '@/models/NotificacaoModel';

const notificacaoEndpoint = async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg> | any) => {
    try {

        //criando um novo objeto atraves de uma instancia do meu NotificacaoModel com os mesmos atributos.
        //O await é usado aqui porque a função create() é uma operação assíncrona que retorna
        //uma promessa, e o await aguarda a conclusão da promessa e obtém o resultado, onde esta funcao cria e savla
        // um novo documento com os atributos definidos e, em seguida, o salva no banco de dados em uma única operação. 
        const notificacao = await NotificacaoModel.create({
            usuarioLogadoId: null, 
            usuarioRealizaAcaoId: null,
            tipoNotificacao: null,    
            publicacao: null,         
            dataNotificacao: Date(),    
            visualizada: false,        
        });

        //realizando um tratamento e salvamento dos dados no DB. O .save() é um método de instância do modelo do Mongoose. Ele é usado 
        //para salvar uma instância específica de um documento no banco de dados. Você primeiro cria uma instância de um documento, modifica 
        //os valores dos atributos conforme necessário e, em seguida, chama o método .save() para persistir essas mudanças no banco de dados.
        const novaNotificacao = await notificacao.save();
        if(novaNotificacao){
            return res.status(200).json({msg: 'Notificacao gerada com sucesso!'});
        }

        
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({msg: 'Usuario nao encontrado!'});
                }

                const listagemNotificacoesUsuarioId = await NotificacaoModel.find({
                    $or: [
                        {usuarioLogadoId: usuario},
                        {usuarioRealizaAcaoId: usuario}
                    ]
                }).exec();

                if(listagemNotificacoesUsuarioId){

                    //criacao de um objeto com propriedades que definirao as categorias das notificacoes, onde cada propriedade
                    // carrega um tipo, new Date(), que corresponde a data atual e em seguida alteraremos seus valores para 
                    //carregarem as notificacoes por datas especificadas.
                    const categoriaNotificacao = {
                        novas:[{
                            notificacao.usuarioRealizaAcaoId = 
                        }], //nao precisaremos alterar as novas notificacoes pois elas carregam o valor da data atual 
                        ultimasSeteDias:    [],
                        ultimasTrintaDias:  []
                    }

                    categoriaNotificacao.novas = () => {
                        
                    }


                    //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
                    //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
                    //7 dias e retorna seu valor. 
                    const vistaSeteDiasAtras = new Date();
                    vistaSeteDiasAtras.setDate(vistaSeteDiasAtras.getDate() - 7);
                    categoriaNotificacao.ultimasSeteDias = vistaSeteDiasAtras;

                    //nova variavel do tipo Date() onde setamos o seu valor atual atraves do metodo setDate(recebe um novo valor de 1 a 31)
                    //passando como parametro a variavel em si com o metodo getDate(pega a data atual) menos os 
                    //7 dias e retorna seu valor.
                    const vistaTrintaDiasAtras = new Date();
                    vistaTrintaDiasAtras.setDate(vistaTrintaDiasAtras.getDate() - 30);
                    categoriaNotificacao.ultimasTrintaDias = vistaTrintaDiasAtras;

                    listagemNotificacoesUsuarioId = categoriaNotificacao;


                    return res.status(200).json(listagemNotificacoesUsuarioId);
                }

        }else{
            return res.status(405).json({erro: 'Método informado não é válido!'});
        }

                    
        
    }
    }catch(e) {
        console.log(e);
        return res.status(400).json({erro: 'Nao foi possivel listar as notificacoes!'});
    }

}

    
    

export default politicaCORS(validarTokenJWT(conectMongoDB(notificacaoEndpoint)));
