Typescript is rapidly gaining momentum. So, today I thought I talk about it a little. Here is an overview of the typescript architecture.

## Typescript Architecture

Overall the typescript architecture is 

```
                                                                |------------|
                           |----------------------------------> | TypeScript |
                           |                                    |   .d.ts    |
                           |                                    |------------|
                           |
|------------|          |-----|               |-----|           |------------|
| TypeScript | -parse-> | AST | ->transform-> | AST | ->print-> | JavaScript |
|   source   |    |     |-----|       |       |-----|           |   source   |
|------------|    |        |          |                         |------------|
                  |    type-check     |
                  |        |          |
                  |        v          |
                  |    |--------|     |
                  |--> | errors | <---|
                       |--------|

```

Let us now discuss each step briefly:

1. Parse: It is a traditional recursive descent parser, tweaked a bit to support incremental parsing, that emits an abstract syntax tree (AST). It is a tree that helps in identifying which files are imported in a file.

1. Type Checker: The type-checker constructs a symbol table and then performs type analysis of every expression in the file, reporting errors it finds.

1. Transform: The transform step is a set of AST to AST transformations that perform various tasks such as, removing type declarations, lowering module and class declarations to ES5, converting async methods to state-machines, etc.

1. Print: Actual conversion of TS to JS the most expensive operation of the whole process.

So, what is the use of all this? Actually typescript provides some extension points which we change the output and make many awesome things.

# Extension points

TypeScript supports the following extension points to alter its output. You can: 

1. Modify the TypeScript source it sees (CompilerHost.getSourceFile)

1. Alter the list of transforms (CustomTransformers). You can read about how to create a custom transform which is the most recommended way to change a typescript program [here](https://dev.doctorevidence.com/how-to-write-a-typescript-transform-plugin-fc5308fdd943).

1. Intercept the output before it is written (WriteFileCallback)

It is not recommended to alter the source code as this complicates the managing of source maps, and is not supported by TypeScript's language service plug-in model.

> Let me know your thoughts on this. Would you love to have more such articles?