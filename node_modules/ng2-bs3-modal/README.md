# ng2-bs3-modal [![npm version](https://badge.fury.io/js/ng2-bs3-modal.svg)](http://badge.fury.io/js/ng2-bs3-modal) [![npm downloads](https://img.shields.io/npm/dm/ng2-bs3-modal.svg)](https://npmjs.org/ng2-bs3-modal) [![Build Status](https://travis-ci.org/dougludlow/ng2-bs3-modal.svg?branch=master)](https://travis-ci.org/dougludlow/ng2-bs3-modal)
Angular2 Bootstrap3 Modal Component

## Demo
http://dougludlow.github.io/ng2-bs3-modal/

## Dependencies

`ng2-bs3-modal` depends on `bootstrap` which depends on `jquery`, you'll need to include both scripts before `ng2-bs3-modal` or somehow make them available globally, depending on your build system.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.js"></script>
```

## Install

```bash
npm install --save ng2-bs3-modal
```

Then include the `ng2-bs3-modal` in your project.

Using [SystemJS](https://github.com/systemjs/systemjs), you can add a mapping to your `System.config`:

```javascript
System.config({
    defaultJSExtensions: true,
    map: {
        'ng2-bs3-modal': 'node_modules/ng2-bs3-modal'
    }
});
```

Or you can include a reference to the bundle in your html:

```html
<script src="node_modules/ng2-bs3-modal/bundles/ng2-bs3-modal.js"></script>
```

Then include the module in the `imports` collection of your app's module:

```typescript
import { NgModule } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
    imports: [ Ng2Bs3ModalModule ]
    ...
})
export class MyAppModule { }
```

## Example Projects

The following is a list of basic demo projects that use the ng2-bs3-modal:

- [npm](https://github.com/dougludlow/ng2-bs3-modal-demo-npm)
- [SystemJS](https://github.com/dougludlow/ng2-bs3-modal-demo-systemjs)
- [jspm](https://github.com/dougludlow/ng2-bs3-modal-demo-jspm)
- [angular-cli](https://github.com/dougludlow/ng2-bs3-modal-demo-angular-cli)
- [webpack](https://github.com/dougludlow/ng2-bs3-modal-demo-webpack)

Feel free to request more.

## API

### ModalComponent

#### Inputs

- `animation: boolean`, default: `true`

   Specify `false` to simply show the modal rather than having it fade in/out of view.
   
- `backdrop: string | boolean`, default: `true`

   Specify `'static'` for a backdrop which doesn't close the modal on click or `false` for no backdrop.
   
- `keyboard: boolean`, default: `true`

   Closes the modal when escape key is pressed. Specify `false` to disable.
   
- `size: string`, default: `undefined`

   Specify `'sm'` for small and `'lg'` for large.

- `cssClass: string`, default: `undefined`

   Applies the given cssClass to the modal. Can be used to style the modal, suchas giving it a custom size.

#### Outputs

- `onClose: EventEmitter`

   Emits when `ModalComponent.close()` is called. 

- `onDismiss: EventEmitter`
    
   Emits when `ModalComponent.dismiss()` is called, or when the modal is dismissed with the keyboard or backdrop. 

- `onOpen: EventEmitter`
    
   Emits when `ModalComponent.open()` is called.  

#### Methods

- `open(size?: string): Promise`

   Opens the modal. Size is optional. Specify `'sm'` for small and `'lg'` for large to override size. Returns a promise that resolves when the modal is completely shown.
   
- `close(value?: any): Promise<any>`

   Closes the modal. Causes `onClose` to be emitted. Returns a promise that resolves the value passed to `close` when the modal is completely hidden.

- `dismiss(): Promise`

   Dismisses the modal. Causes `onDismiss` to be emitted. Returns a promise that resolves when the modal is completely hidden.

### ModalHeaderComponent

#### Inputs

- `show-close: boolean`, default: `false`

   Show or hide the close button in the header. Specify `true` to show.
   
### ModalFooterComponent

#### Inputs

- `show-default-buttons: boolean`, default: `false`

   Show or hide the default 'Close' and 'Dismiss' buttons in the footer. Specify `true` to show.

- `close-button-label: string`, default: `'Close'`

   Change the label in the default 'Close' button in the footer. Has no effect if show-default-buttons aren't set.

- `dismiss-button-label: string`, default: `'Dismiss'`

   Change the label in the default 'Dismiss' button in the footer. Has no effect if show-default-buttons aren't set.

## Example Usage

### Default modal

```html
<button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>

<modal #modal>
    <modal-header [show-close]="true">
        <h4 class="modal-title">I'm a modal!</h4>
    </modal-header>
    <modal-body>
        Hello World!
    </modal-body>
    <modal-footer [show-default-buttons]="true"></modal-footer>
</modal>
```
    
![Example](demo/images/modal.png)
    
### Static modal

This will create a modal that cannot be closed with the escape key or by clicking outside of the modal.

```html
<modal #modal [keyboard]="false" [backdrop]="'static'">
    <modal-header [show-close]="false">
        <h4 class="modal-title">I'm a modal!</h4>
    </modal-header>
    <modal-body>
        Hello World!
    </modal-body>
    <modal-footer [show-default-buttons]="true"></modal-footer>
</modal>
```
    
### Use custom buttons in footer

```html    
<modal #modal>
    <modal-header>
        <h4 class="modal-title">I'm a modal!</h4>
    </modal-header>
    <modal-body>
        Hello World!
    </modal-body>
    <modal-footer>
        <button type="button" class="btn btn-default" data-dismiss="modal" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="modal.close()">Ok</button>
    </modal-footer>
</modal>
```
    
![Example](demo/images/modal-custom-footer.png)
    
### Opening and closing the modal from a parent component

```typescript
import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <modal #myModal>
            ...
        </modal>
    `
})
export class ParentComponent {
    @ViewChild('myModal')
    modal: ModalComponent;

    close() {
        this.modal.close();
    }
    
    open() {
        this.modal.open();
    }
}
```

### Multiple modals in a component

```typescript
import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <modal #myFirstModal>
            ...
        </modal>
        <modal #mySecondModal>
            ...
        </modal>
    `
})
export class ParentComponent {
    @ViewChild('myFirstModal')
    modal1: ModalComponent;
    
    @ViewChild('mySecondModal')
    modal2: ModalComponent;
    
    ...
}
```

### Autofocus on a textbox when modal is opened

```html    
<modal #modal>
    <modal-header>
        <h4 class="modal-title">I'm a modal!</h4>
    </modal-header>
    <modal-body>
        <div class="form-group">
            <label for="textbox">I'm a textbox!</label>
            <input autofocus type="text" class="form-control" id="textbox">
        </div>        
    </modal-body>
    <modal-footer [show-default-buttons]="true"></modal-footer>
</modal>
```

## Building

```bash
git clone https://github.com/dougludlow/ng2-bs3-modal.git
npm install
npm run build
```

## Running 

```bash
npm start
```

Navigate to http://127.0.0.1:8080 in your browser.

## Testing

```bash
npm test
```

To have karma to watch for changes:
```bash
npm run test:w
```

## Bugs/Contributions

Report all bugs and feature requests on the [issue tracker](https://github.com/dougludlow/ng2-bs3-modal/issues).

Contributions are welcome! Feel free to open a [pull request](https://github.com/dougludlow/ng2-bs3-modal/pulls). 
