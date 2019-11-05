import { Photo } from './Photo';

// If we use interfaces we can see the intelisense in the HTML when we do iterpolation
export interface User {
  // userForListDto
  id: number;
  username: string;
  knownAs: string;
  age: number;
  gender: string;
  lastactive: Date;
  photoUrl: string;
  city: string;
  country: string;

  // UserForDetailedDto
  interests?: string;
  introductio?: string;
  lookingfor?: string;
  photos?: Photo[];
}
