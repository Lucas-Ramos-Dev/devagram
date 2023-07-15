//Se iremos realizar um GET que consiste em recuperar informacoes de um servidor(DB), 
//entao teremos que guardar os dados em um local, neste caso, iremos criar um SchemaModel 
//para guardar alguns dados que compoe uma notificacao.

import mongoose, { Schema } from "mongoose";

const NotificacaoSchema = new Schema({
    userAcao:        {type: String,  require: true},
    tipo:            {type: String,  require: true, default: []}, //tipos a serem guardados: curtidas, comentarios, novosSeguidores
    publicacao:      {type: String,  require: true},
    dataNotificacao: {type: Date,    require: true},
    visualizada:     {type: Boolean, require: true}
});

export const NotificacaoModel = (mongoose.models.notificacoes || 
    mongoose.model('notificacoes', NotificacaoSchema));
