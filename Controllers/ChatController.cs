using Microsoft.AspNetCore.Mvc;
using PlayasLimpiasWebApp.Services;
using System.Linq;
using PlayasLimpiasWebApp.Models;
using System.Collections.Generic;



namespace PlayasLimpiasWebApp.Controllers
{
    public class ChatController : Controller
    {
        private readonly UserStatusService _userStatusService;

        public ChatController(UserStatusService userStatusService)
        {
            _userStatusService = userStatusService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Chat()
        {
            var currentUser = User.Identity.Name ?? "Anonymous";
            var onlineUsers = _userStatusService.GetAllUserStatuses()
                                    .Where(u => u.Status == UserStatus.Online)
                                    .Select(u => u.UserId)
                                    .ToList();
            // Pass currentUser and UserList to the view
            ViewData["UserList"] = onlineUsers ?? new List<string>();
            ViewData["CurrentUser"] = currentUser; // Add currentUser to ViewData
            return View();
        }



    }
}
