I've been learning a lot about Angular in the last few months. I always try to go under the hood to have a better understanding of what is happening inside my program. Let us discuss what I've been able to figure out about the Angular framework.

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
