import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Service} from "./service";
import {
    Iris,
    ProbabilityPrediction,
    SVCParameters,
    SVCResult,
    uploadresults,
    Model
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
    public urls = [];
    public success: any;
    public models = ["Phaeocystis antarctica versus all", "All species"];
    // graph styling
    public colorScheme = {
        domain: ['#1a242c', '#e81746', '#e67303', '#FF0000', '#6FFF00']
    };
    public selectedModel = this.models[0];

    constructor(private Service: Service, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    public async loadModel(event) {
        this.selectedModel = event.target.value;
        console.log(this.selectedModel);
        this.success = await this.Service.loadModel([this.selectedModel]);
    }


    public onSelectFile(event) {
        this.urls = [];
        // this.urls.push(this.selectedModel)
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
            console.log(this.probabilityPredictions)
            this.urls[i].push(this.probabilityPredictions[0]["height"])
            this.urls[i].push(this.probabilityPredictions[0]["width"])
            this.urls[i].push(this.probabilityPredictions[0]["scores"][0])
            this.urls[i].push(this.probabilityPredictions[0]["classes"][0])
            this.results.push(this.probabilityPredictions)
        }
        this.exportJson();
    }
    
    public exportJson() {
        var theJSON = JSON.stringify(this.results);
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
    }
    
    public downloadJson(){
        var sJson = JSON.stringify(this.results);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', "primer-server-task.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }

}
