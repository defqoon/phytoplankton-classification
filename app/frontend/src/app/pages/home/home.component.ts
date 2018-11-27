import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Service} from "./service";
import {
    Iris,
    ProbabilityPrediction,
    SVCParameters,
    SVCResult,
    uploadresults
} from "./types";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    public svcParameters: SVCParameters = new SVCParameters();
    public svcResult: SVCResult;
    public iris: Iris = new Iris();
    // public probabilityPredictions: ProbabilityPrediction[];
    public probabilityPredictions: any;
    public selectedFile: File;
    public uploadr: uploadresults;
    public stepsModel = [];
    public downloadJsonHref: any;
    public results = [];

    // graph styling
    public colorScheme = {
        domain: ['#1a242c', '#e81746', '#e67303', '#FF0000', '#6FFF00']
    };

    constructor(private Service: Service, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    public urls = [];
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                const name = event.target.files[i].name
                reader.onload = (event) => {
                    const tempEvent = event as any;
                    this.urls.push([tempEvent.target.result, name])
                }
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    
    public async predict() {
        //  https://stackoverflow.com/questions/43953007/angular-2-wait-for-method-observable-to-complete?rq=1
        // batch size of 1    
        for (let i = 0; i < this.urls.length; i++) {
            this.probabilityPredictions = await this.Service.predict([this.urls[i]]);
            this.urls[i].push(this.probabilityPredictions[0]["height"])
            this.urls[i].push(this.probabilityPredictions[0]["width"])
            this.urls[i].push(this.probabilityPredictions[0]["confidence"])
            this.results.push(this.probabilityPredictions[0])
        }
        this.exportJson();
    }
    
    public exportJson() {
        var theJSON = JSON.stringify(this.results);
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
    }

}
