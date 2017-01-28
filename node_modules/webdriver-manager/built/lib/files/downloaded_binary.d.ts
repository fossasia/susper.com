import { Binary } from '../binaries/binary';
/**
 * The downloaded binary is the binary with the list of versions downloaded.
 */
export declare class DownloadedBinary extends Binary {
    versions: string[];
    binary: Binary;
    constructor(binary: Binary);
    id(): string;
}
