using Microsoft.AspNetCore.SignalR;

namespace learning.Hubs
{
    public class ProgressHub : Hub{
        public async Task SendProgress(string message){
            await Clients.All.SendAsync("ReceiveUpdate ", message);
        }
    }
}