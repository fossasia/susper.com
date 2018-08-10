interface NullSchema {
  type: 'null'
}

interface BooleanSchema {
  type: 'boolean'
}

interface NumberSchema {
  type: 'number'
}

interface StringSchema {
  type: 'string'
}

type LeafSchema = NullSchema | BooleanSchema | NumberSchema | StringSchema

interface ArraySchema<T extends LeafSchema | ArraySchema<LeafSchema | ObjectSchema<ObjectProps, any>> | ObjectSchema<ObjectProps, any>> {
  type: 'array'
  items: T
}

type ObjectProps = { [K in string]: LeafSchema | ArraySchema<LeafSchema | ArraySchema<LeafSchema | ObjectSchema<ObjectProps, any>> | ObjectSchema<ObjectProps, any>> | ObjectSchema<ObjectProps, any> }

interface ObjectSchema<T extends ObjectProps, R extends keyof T> {
  additionalProperties?: boolean
  type: 'object'
  properties: T
  required: R[]
}

interface ExtractedSchemaArray<T> extends Array<ExtractSchemaType<T>> {}

declare type ExtractedSchemaObject<T, R> = {
  [K in keyof T]: (K extends R ? ExtractSchemaType<T[K]> : ExtractSchemaType<T[K]> | undefined)
}

declare type ExtractSchemaType<Type> = (
    Type extends NullSchema ? null
    : Type extends BooleanSchema ? boolean
    : Type extends NumberSchema ? number
    : Type extends StringSchema ? string
    : Type extends ArraySchema<infer T> ? ExtractedSchemaArray<T>
    : Type extends ObjectSchema<infer T, infer R> ? ExtractedSchemaObject<T, R>
    : never
)

declare type GenericSchema = (
  { type: 'string' | 'number' | 'boolean' | 'null' } |
  { type: 'array', items: GenericSchema } |
  { type: 'object', properties: ObjectProps }
)

declare namespace factory {
  interface ValidationError {
    field: string
    message: string
    value: unknown
    type: string
  }
}

declare function createValidator<T extends ObjectProps, R extends keyof T> (schema: ObjectSchema<T, R>, options?: any): ((input: unknown, options?: any) => input is { [K in keyof T]: (K extends R ? ExtractSchemaType<T[K]> : ExtractSchemaType<T[K]> | undefined) }) & { errors: factory.ValidationError[] }
declare function createValidator<T extends GenericSchema> (schema: T, options?: any): ((input: unknown, options?: any) => input is ExtractSchemaType<T>) & { errors: factory.ValidationError[] }

declare function createFilter<T extends ObjectProps, R extends keyof T> (schema: ObjectSchema<T, R>, options?: any): ((input: { [K in keyof T]: (K extends R ? ExtractSchemaType<T[K]> : ExtractSchemaType<T[K]> | undefined) }, options?: any) => { [K in keyof T]: (K extends R ? ExtractSchemaType<T[K]> : ExtractSchemaType<T[K]> | undefined) })
declare function createFilter<T extends GenericSchema> (schema: T, options?: any): ((input: ExtractSchemaType<T>, options?: any) => ExtractSchemaType<T>)

declare type Factory = (typeof createValidator) & { filter: typeof createFilter }
declare const factory: Factory

export = factory
