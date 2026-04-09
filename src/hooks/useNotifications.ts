import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'gallery';
  eventId?: string;
  readBy?: string[];
  createdAt: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];

      setNotifications(allNotifications);

      // Calculate unread count
      const userId = auth.currentUser?.uid;
      if (userId) {
        const unread = allNotifications.filter(n => !n.readBy?.includes(userId)).length;
        setUnreadCount(unread);
      }

      // Handle the popup for the very latest one if it's new
      if (!snapshot.empty && snapshot.docChanges().some(change => change.type === 'added')) {
        const newest = allNotifications[0];
        const lastSeenId = localStorage.getItem('last_seen_notification_id');
        
        if (newest.id !== lastSeenId) {
          setLatestNotification(newest);
        }
      }
    }, (error) => {
      console.error("Error listening to notifications:", error);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, {
        readBy: arrayUnion(userId)
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const unreadNotifications = notifications.filter(n => !n.readBy?.includes(userId));
    
    try {
      await Promise.all(unreadNotifications.map(n => 
        updateDoc(doc(db, 'notifications', n.id), {
          readBy: arrayUnion(userId)
        })
      ));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const dismissPopup = () => {
    if (latestNotification) {
      localStorage.setItem('last_seen_notification_id', latestNotification.id);
      setLatestNotification(null);
    }
  };

  return { 
    notifications, 
    latestNotification, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    dismissPopup 
  };
};
