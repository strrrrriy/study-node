import { Component } from '@angular/core'

@Component({
  selector: 'angular-test',
  templateUrl: './angularTest.component.html',
  styleUrls: ['./angularTest.component.css']

})
export class AngularTest {
  userLoggedIn = true;
  user = {
    admin : true,
    id : 0
  };
  sites : string[] = [];
  courses = ["math","english"];
  // courses = []
  // Array
  arrayTest() {
    // var sites : string[];
    this.sites = ["Google" , "Runoob" , "Taobao"]
    // var sites : string[] = ["Google" , "Runoob" , "Taobao"]
    console.log(this.sites[0]);
    console.log(this.sites[1]);
  }

}