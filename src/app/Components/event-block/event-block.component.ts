import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-event-block',
    templateUrl: './event-block.component.html',
    styleUrls: ['./event-block.component.scss'],
})
export class EventBlockComponent implements OnInit {

    @Input('eventData') eventData: any;

    constructor() { }

    ngOnInit() {
        // console.log(this.eventData);
    }

}
