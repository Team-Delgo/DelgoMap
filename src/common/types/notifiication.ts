export interface Notification {
  categoryCode: string | null;
  createAt: string
  image: string
  isRead: boolean | null
  message: string
  notificationId: number | null
  notificationType: string
  objectId: number
  profile: string | null
  userId: number | null
}

export type NotificationTab = 'activity' | 'announcement';
