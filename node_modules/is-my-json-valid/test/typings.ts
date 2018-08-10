import createValidator = require('../')

/** Static assertion that `value` has type `T` */
// Disable tslint here b/c the generic is used to let us do a type coercion and
// validate that coercion works for the type value "passed into" the function.
// tslint:disable-next-line:no-unnecessary-generics
function assertType<T>(value: T): void {}

const input = null as unknown

const nullValidator = createValidator({ type: 'null' })

if (nullValidator(input)) {
  assertType<null>(input)
}

assertType<createValidator.ValidationError[]>(nullValidator.errors)
assertType<createValidator.ValidationError>(nullValidator.errors[0])
assertType<string>(nullValidator.errors[0].field)
assertType<string>(nullValidator.errors[0].message)
assertType<string>(nullValidator.errors[0].type)
assertType<unknown>(nullValidator.errors[0].value)

const numberValidator = createValidator({ type: 'number' })

if (numberValidator(input)) {
  assertType<number>(input)
}

const stringValidator = createValidator({ type: 'string' })

if (stringValidator(input)) {
  assertType<string>(input)
}

const personValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
  },
  required: [
    'name'
  ]
})

if (personValidator(input)) {
  assertType<string>(input.name)
  assertType<number | undefined>(input.age)
  input.age === undefined
  input.age === 1
}

const namesValidator = createValidator({
  type: 'array',
  items: { type: 'string' }
})

if (namesValidator(input)) {
  assertType<number>(input.length)
  assertType<string>(input[0])
}

const boxValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    items: { type: 'array', items: { type: 'boolean' } },
  },
  required: [
    'name',
    'items',
  ]
})

if (boxValidator(input)) {
  assertType<string>(input.name)
  assertType<number>(input.items.length)
  assertType<boolean>(input.items[0])
}

const matrixValidator = createValidator({
  type: 'array',
  items: {
    type: 'array',
    items: {
      type: 'number'
    }
  }
})

if (matrixValidator(input)) {
  assertType<number>(input[0][0])
}

const userValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    items: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'name',
    'items',
  ]
})

if (userValidator(input)) {
  assertType<string>(input.name)
  assertType<number>(input.items.length)
  assertType<string>(input.items[0])
}

const user2Validator = createValidator({
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {
        first: { type: 'string' },
        last: { type: 'string' },
      },
      required: [
        'last' as 'last'
      ]
    },
    items: {
      type: 'array',
      items: { type: 'string' },
    }
  },
  required: [
    'name'
  ]
})

if (user2Validator(input)) {
  assertType<{ first: string | undefined, last: string }>(input.name)
  assertType<string | undefined>(input.name.first)
  assertType<string>(input.name.last)

  if (input.items !== undefined) {
    assertType<number>(input.items.length)
    assertType<string>(input.items[0])
  }
}
