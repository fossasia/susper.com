import * as ts from 'typescript';
import { FileResolver } from './fileResolver/fileResolver';
import { AbstractResolver, MetadataUrls } from './urlResolvers/abstractResolver';
import { DirectiveMetadata, ComponentMetadata, TemplateMetadata } from './metadata';
export declare class MetadataReader {
    private _fileResolver;
    private _urlResolver;
    constructor(_fileResolver: FileResolver, _urlResolver?: AbstractResolver);
    read(d: ts.ClassDeclaration): DirectiveMetadata;
    readDirectiveMetadata(d: ts.ClassDeclaration, dec: ts.Decorator): DirectiveMetadata;
    readComponentTemplateMetadata(dec: ts.Decorator, external: MetadataUrls): TemplateMetadata;
    readComponentStylesMetadata(dec: ts.Decorator, external: MetadataUrls): any[];
    readComponentMetadata(d: ts.ClassDeclaration, dec: ts.Decorator): ComponentMetadata;
    protected getDecoratorArgument(decorator: ts.Decorator): ts.ObjectLiteralExpression;
}
