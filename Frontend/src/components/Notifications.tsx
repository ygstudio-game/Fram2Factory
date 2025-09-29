import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, Package, CreditCard, Users, Truck, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { User, Screen } from '../types';

interface NotificationsProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

export function Notifications({ user, onNavigate }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = [
    {
      id: '1',
      type: 'match',
      title: 'New AI Match Found',
      message: user?.role === 'factory' 
        ? 'Rajesh Kumar (95% match) has wheat available matching your requirements'
        : 'Tech Foods Ltd. is looking for wheat - 94% match with your crops',
      timestamp: '2 minutes ago',
      read: false,
      urgent: true,
      icon: Users,
      color: 'purple'
    },
    {
      id: '2',
      type: 'contract',
      title: 'Contract Update',
      message: 'Contract C001 status updated to "In Transit" - delivery expected in 3 days',
      timestamp: '1 hour ago',
      read: false,
      urgent: false,
      icon: Package,
      color: 'blue'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Advance payment of ₹25,00,000 received for Contract C001',
      timestamp: '3 hours ago',
      read: true,
      urgent: false,
      icon: CreditCard,
      color: 'green'
    },
    {
      id: '4',
      type: 'inquiry',
      title: 'New Inquiry Received',
      message: user?.role === 'factory' 
        ? 'Green Valley Co-op sent an inquiry about rice procurement'
        : 'Agro Processing Co. wants to purchase 150 tons of your corn',
      timestamp: '5 hours ago',
      read: true,
      urgent: false,
      icon: Bell,
      color: 'orange'
    },
    {
      id: '5',
      type: 'delivery',
      title: 'Delivery Confirmation',
      message: 'Contract C002 delivery completed successfully. Final payment initiated.',
      timestamp: '1 day ago',
      read: true,
      urgent: false,
      icon: Truck,
      color: 'green'
    },
    {
      id: '6',
      type: 'alert',
      title: 'Quality Check Required',
      message: 'Quality inspection scheduled for tomorrow at 10 AM for Contract C001',
      timestamp: '1 day ago',
      read: true,
      urgent: false,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      id: '7',
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Your account has been successfully verified. You can now access all features.',
      timestamp: '2 days ago',
      read: true,
      urgent: false,
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconColor = (color: string) => {
    const colors = {
      purple: 'text-purple-600 bg-purple-100',
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const markAsRead = (notificationId: string) => {
    // Handle marking notification as read
    console.log(`Mark notification ${notificationId} as read`);
  };

  const markAllAsRead = () => {
    // Handle marking all notifications as read
    console.log('Mark all notifications as read');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Notifications</h1>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-white/50">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'All notifications have been read' : 'No notifications yet'}
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className="cursor-pointer"
            >
              <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 ${
                !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
              } ${notification.urgent ? 'border-orange-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      getIconColor(notification.color)
                    }`}>
                      <notification.icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {notification.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for certain notification types */}
                  {(notification.type === 'match' || notification.type === 'inquiry') && !notification.read && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
                        {notification.type === 'match' ? 'Contact' : 'Respond'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}