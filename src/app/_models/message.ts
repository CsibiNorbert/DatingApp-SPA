export interface Message {
    // Contains properties that we are returning in our messageToReturnDto
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoUrl: string;
    recipientId: number;
    recipientKnownAs: string;
    recipientPhotoUrl: string;
    messageContent: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
