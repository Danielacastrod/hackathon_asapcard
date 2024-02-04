import { Person } from '../models';

export const PersonService = {
  findById: async (id: string) => {
    const exemplo = await Person.findByPk(id);
    return exemplo;
  },
};