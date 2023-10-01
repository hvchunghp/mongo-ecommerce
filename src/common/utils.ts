import { pick } from 'lodash';

export const pickData = (field: string[], object: object) => {
    return pick(object, field);
};
