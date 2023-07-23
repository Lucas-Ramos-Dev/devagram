//Se iremos realizar um GET que consiste em recuperar informacoes de um servidor(DB), 
//entao teremos que guardar os dados em um local, neste caso, iremos criar um SchemaModel 
//para guardar alguns dados que compoe uma notificacao.

import mongoose, { Schema } from "mongoose";

const NotificacaoSchema = new Schema({
    usuarioLogadoId:      {type: String,   require: true}, //usuarioLogado - usuario que vai recebe4/ver as notificacoes
    usuarioRealizaAcaoId: {type: String,   require: true}, //usuarioSeguidor - usuario que vai realizar a acao - curtir/comentar/seguir
    tipoNotificacao:      {type: String,   require: true}, //curtida, comentario, novoSeguidor
    publicacao:           {type: String,   require: false}, //a publicacao onde ocorreu o evento(curtida, comentario)
    dataNotificacao:      {type: Date,     require: true}, //data que ocorreu o evento
    visualizada:          {type: Boolean,  require: true, default: false} //se a notificacao foi ou nao visualizada
});

export const NotificacaoModel = (mongoose.models.notificacoes || 
    mongoose.model('notificacoes', NotificacaoSchema));

//criar banco de dados
//api - criar nova notificacao
//api - buscar as notificacoes de um usuario especifico
//api - atualizar as notificacoes

