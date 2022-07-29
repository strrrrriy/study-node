import { NgModule, ModuleWithProviders } from '@angular/core'
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SiderComponent } from './components/sider/sider.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@NgModule({
    declarations: [HeaderComponent, SiderComponent],
    imports: [
        NzPageHeaderModule,
        NzAffixModule,
        NzImageModule,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzDividerModule

    ],
    exports: [
        HeaderComponent,
        SiderComponent
    ],
    entryComponents: []
})
export class SharedModule {
}
