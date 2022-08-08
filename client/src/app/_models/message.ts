export interface Message {
  id: number;
  content: string;
  dateRead?: Date;
  messageSent: Date;
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientUsername: string;
  recipientPhotoUrl: string;
}
