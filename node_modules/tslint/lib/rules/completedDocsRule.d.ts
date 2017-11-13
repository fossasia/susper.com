import * as ts from "typescript";
import * as Lint from "../index";
import { IInputExclusionDescriptors } from "./completed-docs/exclusionDescriptors";
export declare const ALL = "all";
export declare const ARGUMENT_CLASSES = "classes";
export declare const ARGUMENT_ENUMS = "enums";
export declare const ARGUMENT_ENUM_MEMBERS = "enum-members";
export declare const ARGUMENT_FUNCTIONS = "functions";
export declare const ARGUMENT_INTERFACES = "interfaces";
export declare const ARGUMENT_METHODS = "methods";
export declare const ARGUMENT_NAMESPACES = "namespaces";
export declare const ARGUMENT_PROPERTIES = "properties";
export declare const ARGUMENT_TYPES = "types";
export declare const ARGUMENT_VARIABLES = "variables";
export declare const DESCRIPTOR_TAGS = "tags";
export declare const DESCRIPTOR_LOCATIONS = "locations";
export declare const DESCRIPTOR_PRIVACIES = "privacies";
export declare const DESCRIPTOR_VISIBILITIES = "visibilities";
export declare const LOCATION_INSTANCE = "instance";
export declare const LOCATION_STATIC = "static";
export declare const PRIVACY_PRIVATE = "private";
export declare const PRIVACY_PROTECTED = "protected";
export declare const PRIVACY_PUBLIC = "public";
export declare const TAGS_FOR_CONTENT = "content";
export declare const TAGS_FOR_EXISTENCE = "exists";
export declare const VISIBILITY_EXPORTED = "exported";
export declare const VISIBILITY_INTERNAL = "internal";
export declare type All = typeof ALL;
export declare type DocType = All | typeof ARGUMENT_CLASSES | typeof ARGUMENT_ENUMS | typeof ARGUMENT_ENUM_MEMBERS | typeof ARGUMENT_FUNCTIONS | typeof ARGUMENT_INTERFACES | typeof ARGUMENT_METHODS | typeof ARGUMENT_NAMESPACES | typeof ARGUMENT_PROPERTIES | typeof ARGUMENT_TYPES | typeof ARGUMENT_VARIABLES;
export declare type Location = All | typeof LOCATION_INSTANCE | typeof LOCATION_STATIC;
export declare type Privacy = All | typeof PRIVACY_PRIVATE | typeof PRIVACY_PROTECTED | typeof PRIVACY_PUBLIC;
export declare type Visibility = All | typeof VISIBILITY_EXPORTED | typeof VISIBILITY_INTERNAL;
export declare class Rule extends Lint.Rules.TypedRule {
    static FAILURE_STRING_EXIST: string;
    static defaultArguments: IInputExclusionDescriptors;
    static ARGUMENT_DESCRIPTOR_BLOCK: {
        properties: {
            [x: string]: {
                properties: {
                    [x: string]: {
                        items: {
                            type: string;
                        };
                        type: string;
                    };
                };
            } | {
                enum: string[];
                type: string;
            };
        };
        type: string;
    };
    static ARGUMENT_DESCRIPTOR_CLASS: {
        properties: {
            [x: string]: {
                properties: {
                    [x: string]: {
                        items: {
                            type: string;
                        };
                        type: string;
                    };
                };
            } | {
                enum: string[];
                type: string;
            };
        };
        type: string;
    };
    static metadata: Lint.IRuleMetadata;
    private readonly exclusionFactory;
    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[];
    private getExclusionsMap(ruleArguments);
}
