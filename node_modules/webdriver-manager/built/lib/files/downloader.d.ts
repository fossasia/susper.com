/// <reference types="q" />
import * as q from 'q';
import { Binary } from '../binaries/binary';
/**
 * The file downloader.
 */
export declare class Downloader {
    /**
     * Download the binary file.
     * @param binary The binary of interest.
     * @param outputDir The directory where files are downloaded and stored.
     * @param opt_proxy The proxy for downloading files.
     * @param opt_ignoreSSL To ignore SSL.
     * @param opt_callback Callback method to be executed after the file is downloaded.
     */
    static downloadBinary(binary: Binary, outputDir: string, opt_proxy?: string, opt_ignoreSSL?: boolean, opt_callback?: Function): void;
    /**
     * Resolves proxy based on values set
     * @param fileUrl The url to download the file.
     * @param opt_proxy The proxy to connect to to download files.
     * @return Either undefined or the proxy.
     */
    static resolveProxy_(fileUrl: string, opt_proxy?: string): string;
    static httpHeadContentLength(fileUrl: string, opt_proxy?: string, opt_ignoreSSL?: boolean): q.Promise<any>;
    /**
     * Ceates the GET request for the file name.
     * @param fileUrl The url to download the file.
     * @param fileName The name of the file to download.
     * @param opt_proxy The proxy to connect to to download files.
     * @param opt_ignoreSSL To ignore SSL.
     */
    static httpGetFile_(fileUrl: string, fileName: string, outputDir: string, opt_proxy?: string, opt_ignoreSSL?: boolean, callback?: Function): void;
}
