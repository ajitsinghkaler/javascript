# Angular 7 typescript transformers [link](https://medium.com/angular-in-depth/do-you-know-how-angular-transforms-your-code-7943b9d32829)

## Inline resource

It replaces templateUrl/styleUrls properties in @Component with template/styles respectively.

You can enable this transformer via tsconfig.json:

angularCompilerOptions {
enableResourceInlining: true
}

[Source](https://github.com/angular/angular/blob/73dcd72afbd782161c1674f1e647a1b357a78a67/packages/compiler-cli/src/transformers/inline_resources.ts)

## Lower expressions

I believe we all met such kind of errors:

Error: Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function.

when were writing metadata like:

providers: [{provide: Token, useFactory: () => new SomeClass()}]

Lower expressions transformer will rewrite () => new SomeClass() expression to a variable exported from the module allowing the compiler to import the variable without needing to understand the expression.

The transformation only works for a strictly defined set of fields: useValue, useFactory, data, id and loadChildren.

For details refer [link](https://angular.io/guide/aot-compiler#metadata-rewriting)

[Source](https://github.com/angular/angular/blob/73dcd72afbd782161c1674f1e647a1b357a78a67/packages/compiler-cli/src/transformers/lower_expressions.ts)
