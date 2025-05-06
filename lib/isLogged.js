import { getItemWithExpiry } from '../lib/encrypter';

export function isLogged() {
    const encryptedJWTPDB = getItemWithExpiry('encryptedJWTPDB');
    const PDB_U_NAME = getItemWithExpiry('PDB_U_NAME');
    const PDB_U_ROLE = getItemWithExpiry('PDB_U_ROLE');
    const PDB_U_EMAIL = getItemWithExpiry('PDB_U_EMAIL');

    if (encryptedJWTPDB && PDB_U_NAME && PDB_U_ROLE && PDB_U_EMAIL) {
        return true;
    } else {
        return false;
    }
}

export function getRole() {
    return getItemWithExpiry('PDB_U_ROLE');
}