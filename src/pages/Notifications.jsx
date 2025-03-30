import React from "react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "quiz",
      title: "New Live Quiz",
      message: "Saturday Live Quiz starts in 3 days. Don't miss it!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "achievement",
      title: "Achievement Unlocked",
      message: "Congratulations! You've earned the 'Early Bird' badge.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 3,
      type: "friend",
      title: "New Friend",
      message: "Oluwole23 has joined using your referral link!",
      time: "2 days ago",
      read: true,
    },
    {
      id: 4,
      type: "reward",
      title: "Reward Credited",
      message: "N500 has been added to your account balance.",
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-[#16956C] text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read
                ? "bg-white border-gray-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800">{notification.title}</h3>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            <p className="text-gray-600 text-sm">{notification.message}</p>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-gray-500">No notifications yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
