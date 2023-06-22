//REFERENCIA HTML
const lblonline  = document.querySelector( '#lblonline' );
const lbloffline = document.querySelector( '#lbloffline');
const txtMensaje = document.querySelector( '#txtMensaje'); 
const btnEnviar  = document.querySelector( '#btnEnviar' ); 
//REFEREBCIA HTML

const ClienteSocket = io();


ClienteSocket.on('connect' , () =>{
    // console.log('Conectado al servidor');

    lbloffline.style.display = 'none';
    lblonline.style.display = '';
});


ClienteSocket.on('disconnect' , () =>{
    // console.log('Desconectado del servidor');

    lblonline.style.display = 'none';
    lbloffline.style.display = '';
});

ClienteSocket.on('enviar-mensaje' , ( payload ) =>{
    console.log(payload);
})

btnEnviar.addEventListener( 'click', ()=>{
    const mensaje = txtMensaje.value;
    const payload = {
        mensaje,
        id: 'ABC123',
        fecha: new Date().getTime()
    }

    ClienteSocket.emit( 'enviar-mensaje' , payload , ( id )=>{
        console.log('Desde el server' , id);
    });

} );
