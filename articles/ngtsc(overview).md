I’ve been learning and contributing a lot to Angular in the last few months. I now understand the angular compiler and the magic behind it more than ever. I want to share with all of you what magic does angular do for us behind the hood and particularly I'll focus on Angular’s ngtsc compiler.

The Angular framework can mostly be divided into two major parts:

1. Compile Time
1. Runtime

Today I'll focus mostly on the magic that happens during compile time in an Angular program.

## Compilation philosophy

The latest angular compiler Ivy compiles your components into a set of instructions with only the information about its decorator and its component. This was the main idea behind the new compiler that the Angular decorators are compiled into static properties on the classes without the knowledge of the entire application.

The one exception is `@Component` decorator, which requires knowledge from the `@NgModule` which declares the component to properly generate the component definition. In particular, the selectors which are applicable during the compilation of a component template are determined by the module that declares that component. This is the reason we need global information about our components so that the same selector for our components will not tangle with other module's components.

Angular has two compilers:

1. ngtsc
2. ngcc

## ngtsc

It is mainly a `typescript` to `javascript` transpiler which converts Angular decorators into static properties in the class. It is a typescript compiler with a set of Angular transforms. This Angular transforms mainly just adjust what is emitted by the typescript [compiler](https://dev.to/ajitsinghkaler/typescript-compiler-an-overview-5f42). For example, something like this is

``` typescript
import { Component } from '@angular/core';

@Component({
  selector: 'hello-component',
  template: '<h2>Hello, Component</h2>',
})
export class HelloComponent {
}
```

will normally be translated this into something like,

```typescript
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let HelloComponent = class HelloComponent {
};
GreetComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'hello-component',
        template: '<div> Hello, World! </div>'
    })
], HelloComponent);

```

is instead emitted as

```typescript
import * as core from '@angular/core';

class HelloComponent {}
HelloComponent.ɵcmp = core.ɵɵdefineComponent({
    type: HelloComponent,
    tag: 'hello-component',
    factory: () => new HelloComponent(),
    template: function (rf, ctx) {
        if (rf & RenderFlags.Create) {
            core.ɵɵelementStart(0, 'div');
            core.ɵɵtext(1);
            core.ɵɵelementEnd();
        }
    }
});
```

We have heard a lot about the typescript compiler. Yah because basically what the angular compiler boils down to a typescript compiler `+` some transformations. To know more about the typescript compiler and its extended endpoints that Angular uses rigorously to extend its functionality please read my article on the [Typescript compiler](https://dev.to/ajitsinghkaler/typescript-compiler-an-overview-5f42). I'll be very helpful in understanding the content below. I highly recommend it.

### Decorators

Angular uses a lot of decorators.

1. @Component
1. @Directive
1. @Injectable
1. @NgModule
1. @Pipe

for classes. Other helper decorators like `@Input`, `@Output` makes the use of `@Component`, other decorators that help `@Injectable` classes customize the injector for example `@Inject` and `@SkipSelf`.

Each of these class decorators use one of the angular transformers. These take a declared class angularise it using helper decorators and produced the final Angular class.

In each of these Angular classes, these decorators are converted into static methods which can be understood by browsers. For example, the @Component decorator creates a ɵcmp static member, @Directive create a ɵdir, etc. Most of these transformations are straight forward which converts these classes using the metadata specified in these decorators to the corresponding definition for example `@Component`

``` typescript
@Component({
  selector: 'hello-component',
  template: '<h2>Hello, Component</h2>',
})
```

converts its metadata to

``` typescript
HelloComponent.ɵcmp = core.ɵɵdefineComponent({
    type: HelloComponent,
    tag: 'hello-component',
    factory: () => new HelloComponent(),
    template: function (rf, ctx) {
        if (rf & RenderFlags.Create) {
            core.ɵɵelementStart(0, 'div');
            core.ɵɵtext(1);
            core.ɵɵelementEnd();
        }
    }
});
```

**Let us refer each of these decorator transformers as `compiler`.**

## Compiler Design

Each compiler transforms a single decorator into static fields operates as a [pure function](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c). Given input in a particular decorator, it will produce an object describing the metadata and the initialized value for it.

It is very important that it makes all the transformations using the input provided in the decorator and does not depend on inputs not directly passed to it. This restriction is important for two reasons:

1. It helps to enforce the Ivy locality principle
1. It protects against incorrect builds during `--watch` mode of webpack, since the dependencies between files will be easily traceable.

Compilers operate against information extracted from TS sources by the transformer. All of this helps them to run at runtime in JIT mode because we can work out a single class using only its and do not have to compile the whole app again to understand the changes.

For example, the input to the `@Component` compiler will be:

1. A reference to the class of the component.
1. The template and style resources of the component.
1. The selector of the component.
1. A selector map for the module to which the component belongs.

To get the resources from the corresponding plate URLs and style URLs angular use ResourceLoader.

The following are the names of various compilers

1. Component compilation: Translates `@Component` => `ɵɵdefineComponent`
   - TemplateCompiler (currently known as ViewCompiler in angular code)
   - StyleCompiler
1. Pipe Compilation `PipeCompiler`: Translates `@Pipe` => `ɵɵdefinePipe`
1. Directive compilation `DirectiveCompiler`: Translates `@Directive` => `ɵɵdefineDirective`
1. Injectable Compilation `InjectableCompiler`: Translates `@Injectable` => `ɵɵdefineInjectable`
1. Module Compilation `NgModuleCompiler`: Translates `@NgModule` => `ɵɵdefineInjector` (and `ɵɵdefineNgModule` only in jit)

### Need for value resolution in compilers

During compilation, the compiler needs to statically interpret some values, especially from the decorator metadata which is a complex problem for example the following component is common.

```ts
@Component({
  selector: 'hello-component',
  templateUrl: 'template/hello.component.html',
})
export class HelloComponent {
}
```

but think of something like this. It is also permitted:

```ts
export const TEMPLATE_BASE = 'templates/';

export function getTemplateUrl(cmp: string): string {
  return TEMPLATE_BASE + '.component' + '.html';
}

export const HELLO_SELECTOR = 'hello-component';
export const HELLO_TEMPLATE_URL = getTemplateUrl('hello');

@Component({
  selector: HELLO_SELECTOR,
  templateUrl: HELLO_TEMPLATE_URL,
})
export class HelloComponent {}
```

The `ngtsc` metadata evaluator is built as a partial Typescript interpreter, which visits Typescript nodes and evaluates expressions statically. This allows metadata evaluation to happen on demand. Some restrictions are implemented on its evaluation - in particular, the evaluation will not cross node_module boundaries.

### Compiling a template

We write our templates as HTML but its finally compiled into js elements using the `TemplateCompiler`. The template is compiled in the `TemplateCompiler` by performing the following

1. Tokenizes the template
1. Parses the tokens into an HTML AST
1. Converts the HTML AST into an Angular Template AST.
1. Translates the Angular Template AST to a template function

> #### What is Angular AST
>
> The Angular Template AST is a transformed and annotated version of the HTML AST that does the following:
>
> 1. Converts Angular template syntax short-cuts such as *ngFor and [name] into there canonical versions, ( and bind-name).
> 1. Collects references (# attribute) and variables (let- attributes).
> 1. Parses and converts binding expressions in the binding expression AST using the variables and references collected

As a part of this conversion, a list of selectors and its targets is also produced this list provides helps in mapping the selectors to its corresponding components, pipes, directives.

The `TemplateCompiler` can produce a template function from a string without additional information. However, the correct interpretation of that string requires a selector scope. The selector scope is built at runtime allowing the runtime to use a function built from just a string as long as it is given a selector scope (e.g. a NgModule) to use during instantiation.

#### Selector problem in template parsing

To interpret the contents of a template angular needs the pipes, directives, components, other bindings that are used in this component. The list of the components, directives are determined by the NgModule in which it is declared. Since the module and component are in separate source files, mapping which components, directives, and pipes referenced is left at the runtime.

> ##### The tree shaking problem
>
> The process of removing unused code is traditionally referred to as "tree-shaking". To determine what codes are necessary to include, a tree-shakers produces the transitive closure of all the code referenced by the bootstrap function. If the bootstrap code references a module then the tree-shaker will include everything imported or declared into the module.
>
> Unfortunately this creates a tree shaking problem. Since there no direct link between the component and types the component references all components, directives, and pipes declared in the module, and *any module imported from the module*, must be available at runtime or risk the template failing to be interpreted correctly. Including everything can lead to a very large program that contains many components the application doesn't actually use.

To avoid the tree shaking problem, components need to know which components, pipes, and directives it depends upon. So, the module could be ignored altogether. The program then needs only contain the types the initial component rendered depends on and on any types those dependencies require.

The process of determining this list is called reference inversion because it inverts the link from the module (which holds the dependencies) to component into a link from the component to its dependencies.

#### Reference Inversion

The `ViewCompiler` must receive as input the selector scope for the component, to solve the tree shaking problem. It should indicate all of the directives and pipes that are in scope for the component.

Then will scan the component's template, and filters the list of all directives and pipes in scope down to those which match elements in the template. This list is then saved as an instruction call which will patch it onto the component's definition. The plan is someday using this we can get rid of NgModule altogether.

The process of reference inversion is to turn a list of selector targets produced by the `TemplateCompiler` to the list of types on which it depends. To do this we require the selector scope which contains a mapping of CSS components declared in components, directives, and pipe names, and their corresponding class.

To get this the for a module the following operations are performed:

1. Add all the type declared in the declarations field.
2. For each module that is imported.
   -Add the exported components, directives, and pipes
   -Repeat these sub-steps for with each exported module

For each type in the list produced above change the selector into a selector matcher that, given a target, produces the type that matches the selector. Here what we have created is a `selector scope`.

Given a selector scope, a dependency list is formed by producing the set of types that are matched in selector scope from the selector target list produced by the `TemplateCompiler`.

Now the only problem left is for the component to find its module.

#### Finding a components module

A component's module is found using the TypeScript language service's `findReferences`. If one of the references is to a class declaration with an `@NgModule` annotation, process the class as described above to produce the selector scope. If the class is the declaration list of the `@NgModule` then use the scope produce for that module.

When processing the `@NgModule` class, the type references can be found using the program's `checker` `getSymbolAtLocation` (potentially calling `getAliasedSymbol` if it is an alias symbol, `SymbolFlags.Alias`) and then using `Symbol`'s `declarations` field to get the list of declarations nodes (there should only be one for a `class`, there can be several for an `interface`).

#### .d.ts modifications

Typescript provides nothing for modifying the .d.ts files. All the Angular operations performed are done and made on parsed AST. We can add delete modify nodes but the type information in the.d.ts files will be emitted from the initial AST and not from the transformed AST.

This leaves us with `WriteFileCallback` as the only option in the typescript compiler where .d.ts file modification is possible. So the .d.ts files are parsed when they are written and we use the transformed AST to coordinate insertion and deletion operations to fix up these files.

### Overall ngtsc architecture

#### Compilation flow

When `ngtsc` starts running, it first parses the `tsconfig.json` file and then creates a `ts.Program`. Several things need to happen before the transforms described above can run:

Metadata must be collected for input source files which contain decorators.

- Resource files listed in @Component decorators must be resolved asynchronously. The CLI, for example, may wish to run Webpack to produce the .css input to the styleUrls property of an @Component.
- Diagnostics must be run, which creates the TypeChecker and touches every node in the program (an expensive operation).
- Because resource loading is asynchronous (and in particular, may actually be concurrent via subprocesses), it's desirable to kick off as much resource loading as possible before doing anything expensive.

Thus, the compiler flow looks like:

1. Create the ts.Program
2. Scan source files for top-level declarations that have trivially detectable @Component annotations. This avoids creating `TypeChecker`.
3. For each such declaration that has a templateUrl or styleUrls, kick-off resource loading for that URL and adds the Promise to a queue.
4. Get diagnostics and report any initial error messages. At this point, the TypeChecker is primed.
5. Do a thorough scan for @Component annotations, using the TypeChecker and the metadata system to resolve any complex expressions.
6. Wait on all resources to be resolved.
7. Calculate the set of transforms that need to be applied.
8. Kick-off Tsickle emits, which runs the transforms.
9. During the emit callback for .d.ts files, re-parse the emitted .d.ts and merge in any requested changes from the Angular compiler.

> Take a breath that was some hardcore stuff.
>
> I will additionally be releasing some small articles on
>
> 1. Tsickle
> 1. Compilation differences in --watch mode
> 1. Resource loading
> 1. ngcc
> 1. Template Type Checking
>
> If you want you can check them out.

Additionally, watch Alex Rickabaugh [talk](https://youtu.be/anphffaCZrQ) on the angular compiler you will be able to connect a lot of things from there. Which make up for a better understanding.
