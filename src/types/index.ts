
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tokens: number;
  streak: number;
  lastMissionDate?: Date;
};

export type Mission = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  completed: boolean;
  createdAt: Date;
};
