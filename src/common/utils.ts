import { pick } from 'lodash';

export const getInfoData = (field: string[], object: object) => {
    return pick(object, field);
};
