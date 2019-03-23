
import Auction from '../../src/catalog/auction/auction.model';
import config  from '../config';  

export const initSocket = async (io, socket) => {


    socket.on('disconnect', function(){
        io.emit('users-changed', {user: '555', event: 'left'});  
    });
    socket.on('set-nickname', async (nickname) => {
        io.emit('users-changed', {user: '555', event: 'joined'}); 
      });
    socket.on('addbid', async function(bid){
 
        const auction = await Auction.findById(bid.auction_id);

        if((auction.endDate - config.client.timer ) <= new Date()){
            await Auction.findByIdAndUpdate(bid.auction_id, { endDate: Date.now() + config.client.timer });
        }
        io.emit('message', {
            auction: bid
        });    
        
      });

    
    socket.on('addparticipation', function(participation){
        io.emit('participation', {
            auction: participation
        });         
      });
  
    socket.on('updateauction', function(auction){
        io.emit('updateauction', {
            auction: auction
        });         
      });
    
    socket.on('updatearticle', function(article){
        io.emit('updatearticle', {
            article: article
        });         
      });
     
}


