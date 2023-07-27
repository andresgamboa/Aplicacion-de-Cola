const path = require('path');
const fs   = require('fs');


class Ticket {
    constructor ( numero , escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {

    constructor(){

        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); //me indica el dia en el que estamos ejemplo, 11, 01, 12, etc
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();

    }

    get toJson(){
        return{
            ultimo  : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }

    }

    init(){

        const { hoy, tickets ,ultimos4 , ultimo } = require('../db/data.json');

        if( hoy == this.hoy ){
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        }else {
            //ES UN DIA DIFERENTE
            this.guardarDB();   
        }


    }

    guardarDB(){

        //Indico en donde guardar
        const dbPath = path.join( __dirname , '../db/data.json' );
        //Indico que guardar, stingify me convierte un objeto a uno JSON entendible
        fs.writeFileSync( dbPath , JSON.stringify( this.toJson )); 

    }

    siguienteTicket(){

        this.ultimo += 1;

        const ticket = new Ticket( this.ultimo , null );
        this.tickets.push( ticket );

        this.guardarDB();

        return 'Ticket ' + ticket.numero;
    }

    atenderTickets( escritorio ){

        //Primera validacion, verificar que haya tickets que atender
        if( this.tickets.length === 0 ){
            // Si no hay tiquets, no se hace nada :v
            return null;
        }

        // Tomo el primer valor del arreglo de tickets, que contiene una instancia de la clase Tickets, con las propiedades numero y escritorio y luego la borro
        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio; //el escritorio que llega como parametro, lo asigno a la instancia de la clase tomada


        //Almaceno las instancias en los ultimos4, para saber cuales son los ultimos 4 tickets atendidos
        this.ultimos4.unshift( ticket );

        //Para esto, se hace obviamente la validacion para que ultimos4 solo tenga 4 elementos
        if( this.ultimos4.length > 4 ){
            this.ultimos4.splice( -1 , 1 );
        }

        // console.log(this.ultimos4);
        this.guardarDB();

        return ticket;


    } 


}

module.exports = TicketControl;