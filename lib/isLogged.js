import { getItemWithExpiry } from '../lib/encrypter';

export function isLogged() {
    const encryptedJWTPDB = getItemWithExpiry('encryptedJWTPDB');
    const PDB_U_NAME = getItemWithExpiry('PDB_U_NAME');
    const PDB_U_ROLE = getItemWithExpiry('PDB_U_ROLE');

    if (encryptedJWTPDB && PDB_U_NAME && PDB_U_ROLE) {
        return true;
    } else {
        return false;
    }
}

export function getRole() {
    return getItemWithExpiry('PDB_U_ROLE');
}