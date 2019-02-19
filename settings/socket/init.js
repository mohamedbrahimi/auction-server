

export const initSocket = async (io, socket) => {


    socket.on('disconnect', function(){
        io.emit('users-changed', {user: '555', event: 'left'});  
    });
    socket.on('set-nickname', async (nickname) => {
        io.emit('users-changed', {user: '555', event: 'joined'}); 
      });
    socket.on('addbid', function(bid){
        io.emit('message', {
            auction: bid
        });         
      });
     
}


