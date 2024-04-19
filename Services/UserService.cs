using System.Collections.Generic;
using System.Linq;
using PlayasLimpiasWebApp.Models;

namespace PlayasLimpiasWebApp.Services
{
    public class UserService
    {
        private readonly EventContext _context;

        public UserService(EventContext context)
        {
            _context = context;
        }

        public List<string> GetAllUsers()
        {
            // Retrieve all usernames from the database
            var userList = _context.Users.Select(u => u.UserName).ToList();
            return userList;
        }
    }
}
