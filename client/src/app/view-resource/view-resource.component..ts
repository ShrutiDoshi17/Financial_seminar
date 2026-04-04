import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../services/http.service";

@Component({
    selector: 'view-resource',
    templateUrl: './view-resource.component.html',
    styleUrls: ['./view-resource.component.scss']
})

export class ViewResourceComponent implements OnInit {
    resourceList: any = []

    constructor(private httpService: HttpService) {}

    ngOnInit(): void {
        this.getResources()
    }

    getResources(): void {
        // this.httpService.viewAllResourcesByEventId()
    }
}