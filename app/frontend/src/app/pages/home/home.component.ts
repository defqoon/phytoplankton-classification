import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Service} from "./iris.service";
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
    public probabilityPredictions: ProbabilityPrediction[];
    public selectedFile: File;
    public uploadr: uploadresults;
    public stepsModel = [];
    public downloadJsonHref: any;

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

                reader.onload = (event) => {
                    const tempEvent = event as any;
                    console.log(tempEvent.target);
                    this.urls.push(tempEvent.target.result);
                }
                        console.log(event.target.files[i]);

                    reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    
    public predict() {
        console.log(this.urls)
        this.Service.predict(this.urls).subscribe((probabilityPredictions) => {
            this.probabilityPredictions = probabilityPredictions;
        });
        this.exportJson();
    }
    
    public exportJson() {
        console.log(this.probabilityPredictions);
        var theJSON = JSON.stringify(this.probabilityPredictions);
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
    }

}
