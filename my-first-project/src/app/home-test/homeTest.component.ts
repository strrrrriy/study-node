import { Component } from '@angular/core'
import { menus } from '../menus'
// import { NzMenuModule } from 'ng-zorro-antd/menu';
@Component({
  selector: 'home-test',
  templateUrl: './homeTest.component.html',
  styleUrls: ['./homeTest.component.css']

})
export class HomeTest {
  menus = menus;
  share(){

  };

}