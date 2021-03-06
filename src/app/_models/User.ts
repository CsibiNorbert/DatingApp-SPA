import { Photo } from './Photo';

// If we use interfaces we can see the intelisense in the HTML when we do iterpolation
export interface User {
  // userForListDto
  id: number;
  userName: string;
  knownAs: string;
  age: number;
  gender: string;
  lastActive: any;
  photoUrl: string;
  city: string;
  country: string;
  createdProfile: Date;

  // UserForDetailedDto
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
  roles?: string[];
}
