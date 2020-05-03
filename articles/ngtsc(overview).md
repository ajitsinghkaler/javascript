Here is a step by step overview of the compilation steps done by Angular compiler(ngtsc)

1. Create the ts.Program
2. Scan source files for top-level declarations that have trivially detectable @Component annotations. This avoids creating TypeChecker.
3. For each such declaration that has a templateUrl or styleUrls, kick-off resource loading for that URL and adds the Promise to a queue.
4. Get diagnostics and report any initial error messages. At this point, the TypeChecker is primed.
5. Do a thorough scan for @Component annotations, using the TypeChecker and the metadata system to resolve any complex expressions.
Wait on all resources to be resolved.
6. Calculate the set of transforms that need to be applied.
7. Kick-off Tsickle emit, which runs the transforms.
8. During the emit callback for .d.ts files, re-parse the emitted .d.ts and merge in any requested changes from the Angular compiler.

> Detailed article on the whole process soon. Up until then read about the [typescript compiler](https://dev.to/ajitsinghkaler/typescript-compiler-an-overview-5f42) it will really help you what the terms in the article mean and Angular compiler is itself a typescript compiler + some transformations.