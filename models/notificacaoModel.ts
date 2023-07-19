//Se iremos realizar um GET que consiste em recuperar informacoes de um servidor(DB), 
//entao teremos que guardar os dados em um local, neste caso, iremos criar um SchemaModel 
//para guardar alguns dados que compoe uma notificacao.

import mongoose, { Schema } from "mongoose";

const NotificacaoSchema = new Schema({
    usuarioLogadoId:  {type: String,   require: true}, //usuarioLogado
    usuarioRealizaAcaoId: {type: String,   require: true}, //usuarioSeguidor
    tipoNotificacao:    {type: String,   require: true}, //curtida, comentario, novoSeguidor
    publicacao:         {type: String,   require: true}, //a publicacao onde ocorreu o evento(curtida, comentario). Novo seguidor sera direcionado para o usuarioLogado
    dataNotificacao:    {type: Date,     require: true}, //data que ocorreu o evento
    visualizada:        {type: Boolean,  require: true}  //se a notificacao foi visualizada ou nao
});

export const NotificacaoModel = (mongoose.models.notificacoes || 
    mongoose.model('notificacoes', NotificacaoSchema));

