const { Socket } = require('socket.io');
const TicketControl = require('../models/ticket-control');




const ticketControl = new TicketControl();


const socketController = ( socket ) => {


    //SE DISPARAN CUANDO UN NUEVO CLIENTE SE CONECTA
    socket.emit( 'ultimo-ticket' , ticketControl.ultimo );
    socket.emit( 'estado-actual' , ticketControl.ultimos4);
    socket.emit( 'tickets-pendientes' , ticketControl.tickets.length );



    socket.on( 'siguiente-ticket' , ( payload , callback ) => {
       
        const siguiente = ticketControl.siguienteTicket();

        //TODO: Notificar que hay un nuevo ticket pendiente
        socket.broadcast.emit( 'tickets-pendientes' , ticketControl.tickets.length );

        callback( siguiente );

    });




    socket.on( 'atender-ticket' , ( {escritorio} , callback ) =>{


        if( !escritorio ){
            return callback( {
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }


        const ticket = ticketControl.atenderTickets( escritorio );

        //TODO: NOTIFICAR CAMBIO EN LOS ULTIMOS 4 y Tickets pendientes

        socket.broadcast.emit( 'estado-actual' , ticketControl.ultimos4);  //GET IT
        socket.broadcast.emit( 'tickets-pendientes' , ticketControl.tickets.length ); //Emito a todos menos emisor
        socket.emit( 'tickets-pendientes' , ticketControl.tickets.length ); //Emito al emisor tambien

        

        if( !ticket ){
            callback( {
                ok: false,
                msg: 'Ya no hay mas tickets pendientes'
            });
        }else{
            callback({
                ok: true,
                ticket
            });
        }

    });








}


module.exports = {
    socketController
}