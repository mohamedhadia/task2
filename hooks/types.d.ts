export type Session = {
  id: number;
  title: string;
  cover_image: string;
  date: string;
  from: string;
  till: string;
  venue: {
    id: number;
    name: string;
    capacity: number;
    image: string;
    venue_type: string | null;
  };
};

export type SessionCreate = {
  speaker_ids: number[];
  moderator_ids: number[];
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  date: string;
  from: string;
  till: string;
  event_id: number;
};

export interface UserCreate {
  first_name: string;
  last_name: string;
  image: string;
  email: string;
  event_id: number;
}
