
// @ts-ignore
import faker from 'faker';

import { UserData } from '../App.tsx';
export const generateUserData = ( errorRate: number, numRecords: number): UserData[] => {
  const userData: UserData[] = [];

  for (let i = 0; i < numRecords; i++) {
    let name = faker.name.findName();
    let address = faker.address.streetAddress();
    let phone = faker.phone.phoneNumber();

    if (Math.random() < errorRate) {
      name = 'Error';
      address = 'Error';
      phone = 'Error';
    }

    userData.push({
      id: faker.datatype.uuid(),
      name,
      address,
      phone
    });
  }

  return userData;
}
