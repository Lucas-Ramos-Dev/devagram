
import mongoose, { Schema } from "mongoose";

const NotificacaoSchema = new Schema({
    usuarioLogadoId:      {type: String,   require: true}, 
    usuarioRealizaAcaoId: {type: String,   require: true}, 
    tipoNotificacao:      {type: String,   require: true},   
    publicacao:           {type: String,   require: false}, 
    dataNotificacao:      {type: Date,     require: true}, 
    visualizada:          {type: Boolean,  require: true, default: false}
});

export const NotificacaoModel = (mongoose.models.notificacoes || 
    mongoose.model('notificacoes', NotificacaoSchema));




