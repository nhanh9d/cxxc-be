import { UserStatus } from "../entity/user.entity";

export class UserDto {
  id?: number;
  fullname: string;
  birthday: Date;
  gender: string;
  phone: string;
  isActive: boolean;
  firebaseId: string;
  status?: UserStatus;
  profileImages: string[];
  verificationImages: string[];
}