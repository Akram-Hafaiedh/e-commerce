export interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    subscribedAt: Date;
    unsubscribedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Campaign {
    id: string;
    title: string;
    message: string;
    recipientCount: number;
    sentAt: Date;
    createdAt: Date;
}
