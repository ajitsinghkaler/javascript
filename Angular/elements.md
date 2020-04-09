# Angular Elements: Under the hood

With Custom Elements, web developers can create new HTML tags, beef-up existing HTML tags, or extend the components other developers have authored. The API is the foundation of web components. For details [visit](https://developers.google.com/web/fundamentals/web-components/customelements)

## Basically, the work the constructor will do is

it will initialize a factoryComponent based on the component definition
it will initialize observedAttributes based on the Angular Component’s inputs, to support things we’ll need to do in attributeChangedCallback()

eg code
class AngularCustomElementBridge {
  prepare(injector, component) {
    this.componentFactory = injector.get(ComponentFactoryResolver).resolveComponentFactory(component);
    // we use templateName to handle this case @Input('aliasName');
    this.observedAttributes = componentFactory.inputs.map(input => input.templateName); 
  }
}

## connectedCallback()

In this callback, we’ll look to Initialize our Angular Component (just like in Dynamic Components) Set the Component’s initial input values Trigger change detection to render the component Finally, attach HostView to ApplicationRef Here’s all that in action:

class AngularCustomElementBridge {
  initComponent(element: HTMLElement) {
    // first we need an componentInjector to initialize the component.
    // here the injector is from outside of Custom Element, user can register some of their own
    // providers in it.
    const componentInjector = Injector.create([], this.injector);
  
    this.componentRef = this.componentFactory.create(componentInjector, null, element);

    // Then we need to check whether we need to initialize value of component's input
    // the case is, before Angular Element is loaded, user may already set element's property.
    // those values will be kept in an initialInputValues map.
    this.componentFactory.inputs.forEach(prop => this.componentRef.instance[prop.propName] = this.initialInputValues[prop.propName]);

    // then we will trigger a change detection so the component will be rendered in next tick.
    this.changeDetectorRef.detectChanges();
    this.applicationRef = this.injector.get(ApplicationRef);

    // finally we will attach this component's HostView to applicationRef
    this.applicationRef.attachView(this.componentRef.hostView);
  }
}

## disconnectedCallback()

This one’s easy; we’ll just destroy the componentRef here:

class AngularCustomElementBridge {
  destroy() {
    this.componentRef.destroy();
  }
}

## attributeChangedCallback()

Whenever the attribute of this element is changes, we’ll need to update the respective Angular Component’s property accordingly and trigger change detection:

class AngularCustomElementBridge {
  setInputValue(propName, value) {
    if (!this.componentRef) {
      this.initialInputValues[propName] = value;
      return;
    }
    if (this.componentRef[propName] === value) {
      return;
    }
    this.componentRef[propName] = value;
    this.changeDetectorRef.detectChanges();
  }
}

## Finally, we register the Custom Element

customElements.define('hello-elem', HelloComponentClass);

Here is a working [sample](https://github.com/JiaLiPassion/custom-element)

### Here’s a quick synopsis of the modules in Angular Elements and how it relates to what we did in this article

create-custom-element.ts: this module implements the Custom Element callbacks we discussed in this article, and initializes an NgElementStrategy as the bridge to connect our Angular Component to Custom Elements. Currently, we only have the one Strategy — component-factory-strategy.ts — which will use a similar process to the one we demonstrated in this article to implement this bridge. In the future, we may have other Strategies as well, and we can also implement custom Strategies ourselves.
component-factory-strategy.ts: this module facilitates creating and destroying component refs using a component factory. It also handles change detection in response to input changes. This is also covered in the example above.
