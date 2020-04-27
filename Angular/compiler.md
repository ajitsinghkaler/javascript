# Angular Compiler

- Angular is maily divided into 2 compile time and runtime

## Compile time

- Angular mostly follows a declarative approach ie you declare what needs to be done and does not care what happens under the hood.

- Angular compiler architecture mstly follows TS compiler architecture.

- TS compiler -- Program Creation => Type Checking => Emit
- Angular Compiler (NGC)-- Program Creation => Analysis => Resolve => Type Checking => Emit

- Program Creation - Getting all the files via imports
- Analysis - Go class by class and see all Angular decorators one by one. This time does not know which modules it belongs to
- Resolve - Rsolve looks at bigger picture on how classes fits in modules and make optimizations accordong to it.
- Type Checking - Type errors in angular and type checking
- Emit - Convert Ts to JS most expensive opertaion.

Lib.ts is compiled into 2 files lib.js and lib.t.js.

- lib.js actual running code
- lib.t.js component info and type checking info.

Main things that angular compiles does

- Ng Module Scopes - 2 types with declarations and exports.
Modules compilation scope declarations array that w can use in this module.
Modules with exports - Export scope o all module imports. Graph is built and on basis of declarations array joins HTML to Ts file.

- Partial Evaluation - Compiler contains full Ts intreperter becaus to create optimizaions we need to evaluate some ts.

- Template type checking - compile all templates into TS code also called type check blocks.Ts code which is ghost code so cannot show errors in it So comments given of the lines to where to show error.

## From Architecture.md [link](https://github.com/angular/angular/blob/master/packages/compiler/design/architecture.md)

Broadly speaking, The Ivy model is that Angular decorators (@Injectable, etc) are compiled to static properties on the classes (ɵprov). This operation must take place without global program knowledge, and in most cases only with knowledge of that single decorator.

The one exception is @Component, which requires knowledge of the metadata from the @NgModule which declares the component in order to properly generate the component def (ɵcmp).

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
