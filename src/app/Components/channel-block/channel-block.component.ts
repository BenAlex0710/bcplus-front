import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-channel-block',
    templateUrl: './channel-block.component.html',
    styleUrls: ['./channel-block.component.scss'],
})
export class ChannelBlockComponent implements OnInit {

    @Input('channelData') channelData: any;

    constructor() { }

    ngOnInit() { }

}
