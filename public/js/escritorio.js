//Referencias HTML

const lblEscritorio  = document.querySelector('h1');
const lblAtendiendoA = document.querySelector('small');
const btnAtender     = document.querySelector('button'); 
const lblCajaTexto   = document.querySelector('.alert'); 
const lblPendientes  = document.querySelector('#lblPendientes'); 



const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has( 'escritorio' ) ){

    window.location = 'index.html';
    alert('El parametro escritorio es obligatorio');
    throw new Error('El escritorio es obligatorio');

}

const escritorio = searchParams.get( 'escritorio' );
lblEscritorio.innerText = escritorio;
lblCajaTexto.style.display = 'none';




const socket = io();



socket.on('connect', () => {
   
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    
    btnAtender.disabled = true;

});


socket.on( 'tickets-pendientes' , ( pendientes ) =>{

    if( pendientes === 0 ){
        lblPendientes.style.display = 'none';
        lblCajaTexto.style.display = '';

    }else{
        lblPendientes.style.display = '';
        lblCajaTexto.style.display = 'none';
        lblPendientes.innerText = pendientes;
    }

});


btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket' , { escritorio } , ( {ok , ticket , msg} ) =>{

        if( !ok ){
            lblAtendiendoA.innerText = 'Nadie.';
            return lblCajaTexto.style.display = '';
        }


        lblAtendiendoA.innerText = 'Ticket ' + ticket.numero;

    });

});