using Microsoft.AspNetCore.SignalR;
using PlayasLimpiasWebApp.Models;
using PlayasLimpiasWebApp.Services;
using System;
using System.Threading.Tasks;

namespace PlayasLimpiasWebApp.Hubs
{
   public class UserStatusHub : Hub
{
    private readonly UserStatusService _userStatusService;
    private readonly UserService _userService;

    public UserStatusHub(UserStatusService userStatusService, UserService userService)
    {
        _userStatusService = userStatusService;
        _userService = userService;
    }

    public override async Task OnConnectedAsync()
    {
        // Set the user online
        _userStatusService.SetUserOnline(Context.UserIdentifier);

        // Get all usernames from the UserService
        var allUsernames = _userService.GetAllUsers();

        // Send the updated user status along with all usernames
        await Clients.All.SendAsync("UpdateUserStatus", _userStatusService.GetAllUserStatuses(), allUsernames);
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        // Set the user offline
        _userStatusService.SetUserOffline(Context.UserIdentifier);

        // Get all usernames from the UserService
        var allUsernames = _userService.GetAllUsers();

        // Send the updated user status along with all usernames
        await Clients.All.SendAsync("UpdateUserStatus", _userStatusService.GetAllUserStatuses(), allUsernames);
        
        await base.OnDisconnectedAsync(exception);
    }
}

}
