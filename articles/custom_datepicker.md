![Custom Datepicker](https://dev-to-uploads.s3.amazonaws.com/i/ieq3ih5ohf2zi3xc6tbs.png)
Recently at work, I have been getting a lot of heat because of a custom datepicker they wanted. I was like datepicker, custom why do you want it to be custom please use the default ones available, pick any one you like and use it everywhere. 

I put a lot of effort into styling the datepicker and on each page, they tweaked it just a little so that it gets to my head. Today what I'm going to share is a component that has solved all my problems [ngbDatepicker](https://ng-bootstrap.github.io/#/components/datepicker/overview) of the ng-bootstrap library. It helped me a lot and saved me tonnes of hours that I would've spent styling and tweaking my datepicker. It has many options and let us talk about a few of my favorite ones.

### Available both as a calendar and a dropdown

My first requirement, sometimes they used to embed the date picker sometimes they wanted it in the DOM. Each time different styles and the deprecation of `::ng-deep` made matters worse.

### Different Selections

You can select the date as a range and select a single date also. 

### Custom months

It lets you create the entire view of the months using an Angular template and you just have to put a directive on the ng-template tag. Let me give an example this is a default datepicker.

``` html
<ngb-datepicker #dp navigation="none">
```

and to customize it just add whatever Html you want to add in it and the ngbDatepickerContent directive on that template

``` html
<ngb-datepicker #dp navigation="none">
    <ng-template ngbDatepickerContent>
      <div *ngFor="let month of dp.state.months">
        <div>
          This is custom datepicker
        </div>
      <ngb-datepicker-month [month]="month"></ngb-datepicker-month>
      <div>Here is a footer<div>
    </div>
  </ng-template>
</ngb-datepicker>

```

which will make something like this as an output.

![Custom Datepicker](https://dev-to-uploads.s3.amazonaws.com/i/2pnywo53zserf36zlz3b.png)

Now you can put anything at the bottom or top of the date picker. Style it as you want in those div tags. For footer, you can use inbuilt [footer template](https://ng-bootstrap.github.io/#/components/datepicker/overview#footer-template) input too.

### Change week name labels

This one was a bit complex but you actually just have to extend an NgbDatepickerI18n provider and provide it instead of default one. An example of adding a custom class is as follows: 

``` ts

import {NgbDatepickerI18n, NgbDateStruct, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'en': {// Provide labels in multiple languages
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], // Use whatever values you want in any language
    months: ['January', 'February', 'March',
 'April', 'May', 'June',
 'July', 'August', 'September',
 'October', 'November', 'December']// // Use whatever values you want in any language
  }
};

@Injectable()
export class I18n {
  language = 'en';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
 
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [[I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]]
})

export class DetailsCalendarComponent{
  constructor(public i18n: NgbDatepickerI18n) { }
}

```

### Give custom days template

Now we have styled the months the labels now only thing left is the day template. This can also be styles modified according to your needs. You just have to provide a custom template for your days using the daytemplate input on the ngb-datepicker

```html

<ngb-datepicker #dp [dayTemplate]="customDay"></ngb-datepicker>

<ng-template #customDay let-date let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
  <div [class.selected-date]="selected">
    {{ date.day }}
  </div>
</ng-template>
```

Here you can define different states using disabled, selected and focused. Like I put the selected-date class on the day when ever we select a day of the month. You can add whatever styles you want in that class.

Now, we were able to make custom days too. So, we can see that we can style the entire datepicker using our own template and styles. This is very helpful to me at work. 

> There are lot of other options available in this library please check it out [ngbDatepicker](https://ng-bootstrap.github.io/#/components/datepicker/overview). If you have any questions please mail me [here](mailto:ajitsinghkaler0@gmail.com). It will save you tonnes of time.

Happy coding.