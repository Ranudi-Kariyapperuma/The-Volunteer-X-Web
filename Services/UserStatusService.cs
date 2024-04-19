using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using PlayasLimpiasWebApp.Models;


namespace PlayasLimpiasWebApp.Services
{
    public class UserStatusService
    {
        private readonly ConcurrentDictionary<string, UserStatus> _userStatuses = new ConcurrentDictionary<string, UserStatus>();

        public void SetUserOnline(string userId)
        {
            _userStatuses.AddOrUpdate(userId, UserStatus.Online, (key, oldValue) => UserStatus.Online);
        }

        public void SetUserOffline(string userId)
        {
            _userStatuses.AddOrUpdate(userId, UserStatus.Offline, (key, oldValue) => UserStatus.Offline);
        }

        public IEnumerable<UserStatusInfo> GetAllUserStatuses()
        {
            return _userStatuses.Select(kv => new UserStatusInfo { UserId = kv.Key, Status = kv.Value });
        }
    }
}
